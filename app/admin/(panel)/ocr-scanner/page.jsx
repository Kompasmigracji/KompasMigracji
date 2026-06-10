"use client";
/* KompasCRM — AI Document OCR & Scanner */
import React, { useState, useEffect } from "react";
import { Icon, Badge, ProgressBar } from "@/components/admin/ui";

export default function OcrScannerPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [parsedData, setParsedData] = useState(null);

  // AI OCR logs
  const [ocrLogs, setOcrLogs] = useState([
    { time: "14:40:01", type: "system", message: "President approved OCR parsing model updates (Tesseract-ML)." },
    { time: "14:38:15", type: "coordinator", message: "OCR Coordinator [Agent-C09] validated fields output alignment." },
    { time: "14:35:10", type: "agent", message: "OCR Agent-142 matched MRZ checksum zone for document scan #4092." },
    { time: "14:30:00", type: "system", message: "KompasCRM AI OCR Scanner initialized (175 background agents scanning image attachments)." }
  ]);

  useEffect(() => {
    const messages = [
      { type: "agent", text: "Agent-054 parsed Ukrainian passport scan. Extracted Name: Roman, Surname: Sydorenko." },
      { type: "agent", text: "Agent-128 matched PESEL number from residence card scan: Validated." },
      { type: "coordinator", text: "Coordinator [Agent-C12] escalated low-contrast scan to manual audit review queue." },
      { type: "system", text: "President key confirmed encryption for processed identity document uploads." },
      { type: "agent", text: "Agent-110 matched expiry date: Dec 2029. Extracted successfully." }
    ];

    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      setOcrLogs(prev => [
        { time: timeStr, type: randomMsg.type, message: randomMsg.text },
        ...prev.slice(0, 19)
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setParsedData(null);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setParsedData({
            firstName: "ROMAN",
            lastName: "SYDORENKO",
            docNumber: "FD8899012",
            expiryDate: "2029-12-15",
            nationality: "UKR",
            ocrConfidence: "98.7%"
          });
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-xs)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>OCR Сканування Документів (AI OCR Scanner)</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Автоматичне зчитування паспортів та карт побиту за допомогою розпізнавання тексту (OCR).
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-lg)" }}>
        {/* Scanner Panel */}
        <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", border: "2px dashed var(--border)", background: "var(--panel)" }}>
          <div style={{ padding: "var(--space-xl) var(--space-md)", textAlign: "center", background: "var(--panel-2)", borderRadius: 12, border: "1px solid var(--border)" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto var(--space-md)", color: "var(--color-primary)" }}>
              <Icon name="file-text" size={32} />
            </div>
            <h3 style={{ margin: "0 0 var(--space-xs)", color: "var(--text)" }}>Перетягніть скан паспорта сюди</h3>
            <p style={{ color: "var(--dim)", fontSize: "var(--text-xs)", marginBottom: "var(--space-md)" }}>Підтримувані формати: PDF, PNG, JPG. Максимум 15MB.</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-sm)" }}>
              <button className="kc-btn kc-btn-primary" onClick={handleStartScan} disabled={isScanning}>
                <Icon name="upload" size={16} /> {isScanning ? "Сканування..." : "Завантажити файл"}
              </button>
            </div>
          </div>

          {isScanning && (
            <div style={{ padding: "var(--space-sm) var(--space-md)" }}>
              <ProgressBar progress={scanProgress} label="AI аналіз тексту та MRZ-зони..." color="var(--color-primary)" />
            </div>
          )}

          {parsedData && (
            <div style={{ background: "var(--panel-2)", padding: "var(--space-md)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: 8, flexWrap: "wrap", gap: 8 }}>
                <strong style={{ color: "var(--color-success)" }}>Розпізнано успішно (Confidence: {parsedData.ocrConfidence})</strong>
                <button className="kc-btn kc-btn-primary" style={{ minHeight: "auto", padding: "4px 8px", fontSize: "11px" }} onClick={() => alert("Дані імпортовано в лід")}>
                  Імпортувати
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, fontSize: "var(--text-xs)", color: "var(--text)" }}>
                <div><span style={{ color: "var(--dim)" }}>Ім&apos;я (First Name):</span> <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginTop: 2 }}>{parsedData.firstName}</div></div>
                <div><span style={{ color: "var(--dim)" }}>Прізвище (Last Name):</span> <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginTop: 2 }}>{parsedData.lastName}</div></div>
                <div><span style={{ color: "var(--dim)" }}>Номер паспорта:</span> <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginTop: 2, fontFamily: "var(--font-mono)" }}>{parsedData.docNumber}</div></div>
                <div><span style={{ color: "var(--dim)" }}>Дійсний до:</span> <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginTop: 2 }}>{parsedData.expiryDate}</div></div>
                <div><span style={{ color: "var(--dim)" }}>Громадянство:</span> <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginTop: 2 }}>{parsedData.nationality}</div></div>
              </div>
            </div>
          )}
        </div>

        {/* AI OCR logs */}
        <div className="kc-card" style={{ background: "#0d1117", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #30363d", paddingBottom: 8 }}>
            <h3 className="kc-card-cap" style={{ margin: 0, color: "#58a6ff" }}>Живі логи нейромережі OCR</h3>
            <span className="kc-mono" style={{ fontSize: 10, color: "var(--dim)" }}>175 agents active...</span>
          </div>

          <div style={{ 
            flex: 1, maxHeight: 380, overflowY: "auto", fontFamily: "var(--font-mono)", 
            fontSize: "var(--text-xs)", lineHeight: "1.6", color: "#c9d1d9",
            display: "flex", flexDirection: "column", gap: 8
          }}>
            {ocrLogs.map((log, index) => {
              let color = "#8b949e";
              if (log.type === "coordinator") color = "#58a6ff";
              if (log.type === "system") color = "#56d364";
              return (
                <div key={index} style={{ borderLeft: `2px solid ${color}`, paddingLeft: 8 }}>
                  <span style={{ color: "#8b949e" }}>[{log.time}]</span> <strong style={{ color }}>{log.type.toUpperCase()}</strong>: {log.message}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
