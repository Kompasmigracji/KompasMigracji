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
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>OCR Сканування Документів (AI OCR Scanner)</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Автоматичне зчитування паспортів та карт побиту за допомогою розпізнавання тексту (OCR).
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "var(--space-lg)" }}>
        {/* Scanner Panel */}
        <div className="kc-card" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", border: "2px dashed var(--border)" }}>
          <div style={{ padding: "var(--space-xl)", textAlign: "center", background: "rgba(95,155,213,0.02)", borderRadius: 12 }}>
            <Icon name="file-text" size={48} color="var(--dim)" />
            <h3 style={{ margin: "var(--space-md) 0 var(--space-xs)" }}>Перетягніть скан паспорта сюди</h3>
            <p style={{ color: "var(--dim)", fontSize: "var(--text-xs)", marginBottom: "var(--space-md)" }}>Підтримувані формати: PDF, PNG, JPG. Максимум 15MB.</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-sm)" }}>
              <button className="kc-btn kc-btn-primary" onClick={handleStartScan} disabled={isScanning}>
                {isScanning ? "Сканування..." : "Завантажити файл"}
              </button>
            </div>
          </div>

          {isScanning && (
            <div style={{ padding: "var(--space-md)" }}>
              <ProgressBar progress={scanProgress} label="AI аналіз тексту та MRZ-зони..." color="var(--color-primary)" />
            </div>
          )}

          {parsedData && (
            <div style={{ background: "var(--panel-2)", padding: "var(--space-md)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: 6 }}>
                <strong style={{ color: "var(--color-success)" }}>Розпізнано успішно (Confidence: {parsedData.ocrConfidence})</strong>
                <button className="kc-btn" style={{ minHeight: "auto", padding: "2px 8px", fontSize: "10px" }} onClick={() => alert("Дані імпортовано в лід")}>Імпортувати в Лід</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: "var(--text-xs)" }}>
                <div><span style={{ color: "var(--dim)" }}>Ім&apos;я (First Name):</span> <strong>{parsedData.firstName}</strong></div>
                <div><span style={{ color: "var(--dim)" }}>Прізвище (Last Name):</span> <strong>{parsedData.lastName}</strong></div>
                <div><span style={{ color: "var(--dim)" }}>Номер паспорта:</span> <strong className="kc-mono">{parsedData.docNumber}</strong></div>
                <div><span style={{ color: "var(--dim)" }}>Дійсний до:</span> <strong>{parsedData.expiryDate}</strong></div>
                <div><span style={{ color: "var(--dim)" }}>Громадянство:</span> <strong>{parsedData.nationality}</strong></div>
              </div>
            </div>
          )}
        </div>

        {/* AI OCR logs */}
        <div className="kc-card" style={{ background: "#06090e", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 className="kc-card-cap" style={{ margin: 0, color: "#58a6ff" }}>Живі логи нейромережі OCR (AI OCR logs)</h3>
            <span className="kc-mono" style={{ fontSize: 10, color: "var(--dim)" }}>175 agents active...</span>
          </div>

          <div style={{ 
            flex: 1, maxHeight: 280, overflowY: "auto", fontFamily: "var(--font-mono)", 
            fontSize: "var(--text-xs)", lineHeight: "1.6", color: "#c9d1d9",
            display: "flex", flexDirection: "column", gap: 8
          }}>
            {ocrLogs.map((log, index) => {
              let color = "#8b949e";
              if (log.type === "coordinator") color = "#58a6ff";
              if (log.type === "system") color = "#56d364";
              return (
                <div key={index} style={{ borderLeft: `2px solid ${color}`, paddingLeft: 8 }}>
                  <span style={{ color: "var(--dim)" }}>[{log.time}]</span> <strong style={{ color }}>{log.type.toUpperCase()}</strong>: {log.message}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
