"use client";
/* KompasCRM — Two-Factor Authentication Setup */
import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Icon, Badge, Spinner } from "@/components/admin/ui";

export default function TwoFactorAuthPage() {
  const [loading, setLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const [setupStep, setSetupStep] = useState(0); // 0: overview, 1: QR code, 2: verify, 3: success
  const [code, setCode] = useState("");
  const [secret, setSecret] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/auth/2fa/status")
      .then((r) => r.json())
      .then((data) => {
        setIsEnabled(!!data.enabled);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const startSetup = async () => {
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/auth/2fa/setup", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Не вдалося створити секрет");
      setSecret(data.secret);
      setQrUrl(data.uri);
      setSetupStep(1);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError("Введіть 6-значний код.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/auth/2fa/enable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Невірний код");
      setIsEnabled(true);
      setSetupStep(3);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDisable = async () => {
    if (!password) {
      setError("Для відключення 2FA потрібен пароль.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/auth/2fa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Не вдалося відключити 2FA");
      setIsEnabled(false);
      setSetupStep(0);
      setPassword("");
      setCode("");
      setSecret("");
      setQrUrl("");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-2xl)" }}>
        <Spinner />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-xl)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Two-Factor Authentication (2FA)</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Add an extra layer of security to your KompasCRM account.
          </p>
        </div>
        <Badge status={isEnabled ? "success" : "dim"} text={isEnabled ? "Enabled" : "Disabled"} />
      </div>

      {error && (
        <div style={{ background: "color-mix(in srgb, var(--color-danger) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--color-danger) 30%, transparent)", color: "var(--color-danger)", padding: "var(--space-md)", borderRadius: "var(--radius-md)", marginBottom: "var(--space-lg)" }}>
          {error}
        </div>
      )}

      <div className="kc-card" style={{ padding: "var(--space-2xl)" }}>
        {isEnabled && setupStep === 0 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 80, height: 80, background: "color-mix(in srgb, var(--color-success) 10%, transparent)", color: "var(--color-success)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto var(--space-lg)" }}>
              <Icon name="check" size={40} />
            </div>
            <h3 className="kc-h3">2FA is Active</h3>
            <p style={{ color: "var(--dim)", maxWidth: 400, margin: "var(--space-md) auto var(--space-xl)" }}>
              Your account requires a code from your authenticator app at login. Enter your password to turn it off.
            </p>
            <div style={{ maxWidth: 300, margin: "0 auto" }}>
              <input
                type="password"
                className="kc-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ marginBottom: "var(--space-md)" }}
              />
              <button className="kc-btn kc-btn-danger" onClick={handleDisable} disabled={busy} style={{ width: "100%" }}>
                {busy ? "..." : "Disable 2FA"}
              </button>
            </div>
          </div>
        )}

        {!isEnabled && setupStep === 0 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 80, height: 80, background: "color-mix(in srgb, var(--color-primary) 10%, transparent)", color: "var(--color-primary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto var(--space-lg)" }}>
              <Icon name="settings" size={40} />
            </div>
            <h3 className="kc-h3">Secure Your Account</h3>
            <p style={{ color: "var(--dim)", maxWidth: 400, margin: "var(--space-md) auto var(--space-xl)" }}>
              Two-factor authentication protects your account by requiring a code from your mobile device when logging in.
            </p>
            <button className="kc-btn kc-btn-primary" onClick={startSetup} disabled={busy} style={{ margin: "0 auto" }}>
              {busy ? "..." : "Setup 2FA Now"}
            </button>
          </div>
        )}

        {setupStep === 1 && (
          <div>
            <h3 className="kc-h3" style={{ marginBottom: "var(--space-md)" }}>1. Scan the QR Code</h3>
            <p style={{ color: "var(--dim)", marginBottom: "var(--space-lg)" }}>
              Open your authenticator app (e.g., Google Authenticator, Authy) and scan this QR code.
            </p>

            <div style={{ background: "var(--panel-2)", padding: "var(--space-lg)", borderRadius: "var(--radius-lg)", display: "flex", gap: "var(--space-xl)", alignItems: "center" }}>
              <div style={{ width: 160, height: 160, background: "white", padding: 10, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {qrUrl ? <QRCodeSVG value={qrUrl} size={140} /> : "Loading..."}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--dim)", marginBottom: 8 }}>Can&apos;t scan the code? Enter this manually:</div>
                <div style={{ fontFamily: "monospace", fontSize: "var(--text-lg)", background: "var(--bg)", padding: "8px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                  {secret}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "var(--space-xl)" }}>
              <button className="kc-btn kc-btn-primary" onClick={() => setSetupStep(2)}>Next Step <Icon name="check" size={16} /></button>
            </div>
          </div>
        )}

        {setupStep === 2 && (
          <div>
            <h3 className="kc-h3" style={{ marginBottom: "var(--space-md)" }}>2. Verify the Code</h3>
            <p style={{ color: "var(--dim)", marginBottom: "var(--space-lg)" }}>
              Enter the 6-digit code from your authenticator app to verify it&apos;s working correctly.
            </p>

            <div style={{ maxWidth: 300 }}>
              <input
                type="text"
                className="kc-input"
                placeholder="000000"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                style={{ fontSize: "var(--text-2xl)", letterSpacing: 8, textAlign: "center", padding: "var(--space-md)" }}
              />
            </div>

            <div style={{ display: "flex", gap: "var(--space-sm)", marginTop: "var(--space-xl)" }}>
              <button className="kc-btn kc-btn-ghost" onClick={() => setSetupStep(1)}>Back</button>
              <button className="kc-btn kc-btn-primary" onClick={handleVerify} disabled={code.length !== 6 || busy}>
                {busy ? "..." : "Verify & Enable"}
              </button>
            </div>
          </div>
        )}

        {setupStep === 3 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 80, height: 80, background: "color-mix(in srgb, var(--color-success) 10%, transparent)", color: "var(--color-success)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto var(--space-lg)" }}>
              <Icon name="check" size={40} />
            </div>
            <h3 className="kc-h3">2FA Successfully Enabled!</h3>
            <p style={{ color: "var(--dim)", maxWidth: 400, margin: "var(--space-md) auto var(--space-xl)" }}>
              Your account is now protected. Next time you log in, you&apos;ll need to enter a code from your authenticator app.
            </p>

            <button className="kc-btn kc-btn-primary" onClick={() => window.location.href = "/admin/settings"} style={{ margin: "0 auto" }}>
              Return to Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
