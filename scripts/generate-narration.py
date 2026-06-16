#!/usr/bin/env python3
"""Generate epic Ukrainian narration + orchestral bed for intro videos."""
import asyncio
import json
import os
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VIDEOS_DIR = os.path.join(ROOT, "artifacts", "videos")
NARRATION_JSON = os.path.join(VIDEOS_DIR, "narration.json")
AUDIO_DIR = os.path.join(VIDEOS_DIR, "audio")


def run(cmd, **kw):
    subprocess.run(cmd, check=True, **kw)


def probe_duration(path):
    out = subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", path
    ])
    return float(out.decode().strip())


async def tts_segment(text, out_path, voice, rate, pitch):
    import edge_tts
    comm = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
    await comm.save(out_path)


def make_orchestral_bed(duration_sec, out_path):
    """Synthesise cinematic orchestral pad with ffmpeg."""
    d = int(duration_sec) + 2
    fade_out = max(1, d - 5)
    filt = (
        "[1:a]volume=0.14[a1];[2:a]volume=0.10[a2];[3:a]volume=0.08[a3];"
        "[4:a]volume=0.06[a4];[5:a]volume=0.05[a5];[0:a]volume=0.8[bn];"
        "[bn][a1][a2][a3][a4][a5]amix=inputs=6:duration=first,"
        "lowpass=f=900,highpass=f=45,"
        "aecho=0.8:0.7:800:0.3,"
        f"afade=t=in:st=0:d=4,afade=t=out:st={fade_out}:d=5"
    )
    run([
        "ffmpeg", "-y",
        "-f", "lavfi", "-i", f"anoisesrc=color=brown:duration={d}:sample_rate=44100:amplitude=0.02",
        "-f", "lavfi", "-i", f"sine=frequency=65.41:duration={d}:sample_rate=44100",
        "-f", "lavfi", "-i", f"sine=frequency=130.81:duration={d}:sample_rate=44100",
        "-f", "lavfi", "-i", f"sine=frequency=196.00:duration={d}:sample_rate=44100",
        "-f", "lavfi", "-i", f"sine=frequency=261.63:duration={d}:sample_rate=44100",
        "-f", "lavfi", "-i", f"sine=frequency=329.63:duration={d}:sample_rate=44100",
        "-filter_complex", filt,
        "-t", str(d), "-c:a", "libmp3lame", "-b:a", "192k", out_path
    ])


async def build_all_segments(segments, tmp, voice, rate, pitch):
    paths = []
    for i, seg in enumerate(segments):
        seg_path = os.path.join(tmp, f"seg_{i:02d}.mp3")
        await tts_segment(seg["text"], seg_path, voice, rate, pitch)
        paths.append((seg_path, seg["ms"]))
    return paths


def build_voice_track(video_key, config, tmp):
    segments = config["videos"][video_key]["segments"]
    voice = config["voice"]
    rate = config.get("rate", "+0%")
    pitch = config.get("pitch", "+0Hz")

    seg_paths = asyncio.run(build_all_segments(segments, tmp, voice, rate, pitch))
    part_files = []

    for i, (seg_path, slot_ms) in enumerate(seg_paths):
        seg_dur = probe_duration(seg_path)
        slot_sec = slot_ms / 1000
        # Pad or trim: add silence after speech to fill slide slot
        pad = max(0.3, slot_sec - seg_dur - 0.2)
        padded = os.path.join(tmp, f"seg_{i:02d}_padded.mp3")
        run([
            "ffmpeg", "-y", "-i", seg_path,
            "-f", "lavfi", "-i", f"anullsrc=r=44100:cl=stereo,atrim=0:{pad}",
            "-filter_complex", "[0:a][1:a]concat=n=2:v=0:a=1",
            "-c:a", "libmp3lame", "-b:a", "192k", padded
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        part_files.append(padded)
        print(f"   🎙️  Segment {i+1}/{len(segments)}: {seg_dur:.1f}s + {pad:.1f}s pad")

    # Concat all segments
    concat_list = os.path.join(tmp, "concat.txt")
    with open(concat_list, "w") as f:
        for p in part_files:
            f.write(f"file '{p}'\n")
    voice_out = os.path.join(AUDIO_DIR, f"{video_key}-voice-raw.mp3")
    run([
        "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", concat_list,
        "-c:a", "libmp3lame", "-b:a", "192k", voice_out
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # Fit voice duration to video timeline
    target_sec = config["videos"][video_key]["totalMs"] / 1000
    raw_dur = probe_duration(voice_out)
    voice_final = os.path.join(AUDIO_DIR, f"{video_key}-voice.mp3")
    if abs(raw_dur - target_sec) > 1.0:
        tempo = min(2.0, max(0.5, raw_dur / target_sec))
        print(f"   ⏱️  Adjusting voice tempo: {raw_dur:.1f}s → {target_sec:.1f}s (×{tempo:.2f})")
        run([
            "ffmpeg", "-y", "-i", voice_out,
            "-filter:a", f"atempo={tempo}",
            "-t", str(target_sec),
            "-c:a", "libmp3lame", "-b:a", "192k", voice_final
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    else:
        import shutil
        shutil.copy(voice_out, voice_final)

    return voice_final


def mix_audio(video_key, config, voice_path):
    total_ms = config["videos"][video_key]["totalMs"]
    total_sec = total_ms / 1000 + 1
    music_vol = config.get("music", {}).get("volume", 0.22)

    bed_path = os.path.join(AUDIO_DIR, f"{video_key}-orchestral.mp3")
    make_orchestral_bed(total_sec, bed_path)

    mixed = os.path.join(AUDIO_DIR, f"{video_key}-audio.mp3")
    run([
        "ffmpeg", "-y",
        "-i", voice_path,
        "-i", bed_path,
        "-filter_complex",
        f"[0:a]volume=1.0,highpass=f=80,compand=attacks=0.1:decays=0.3:points=-80/-80|-20/-15|-5/-5|0/-2[v];"
        f"[1:a]volume={music_vol},afade=t=in:st=0:d=3,afade=t=out:st={total_sec-4}:d=4[m];"
        f"[v][m]amix=inputs=2:duration=first:dropout_transition=2,"
        f"afade=t=in:st=0:d=1,afade=t=out:st={total_sec-2}:d=2",
        "-t", str(total_sec),
        "-c:a", "libmp3lame", "-b:a", "256k", mixed
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"   🎵 Mixed audio: {mixed}")
    return mixed


def main():
    video_key = sys.argv[1] if len(sys.argv) > 1 else "all"
    os.makedirs(AUDIO_DIR, exist_ok=True)

    with open(NARRATION_JSON) as f:
        config = json.load(f)

    keys = list(config["videos"].keys()) if video_key == "all" else [video_key]

    for key in keys:
        print(f"\n🎤 Generating narration: {key}")
        with tempfile.TemporaryDirectory() as tmp:
            voice = build_voice_track(key, config, tmp)
            mix_audio(key, config, voice)

    print("\n✅ Audio generation complete.")


if __name__ == "__main__":
    main()
