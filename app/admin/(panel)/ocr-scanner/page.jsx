"use client";
/* iPhoenixCRM — Document OCR & AI Parsing */
import React, { useState } from "react";
import { Icon, Badge } from "@/components/admin/ui";

export default function OCRScannerPage() {
  const [scanStatus, setScanStatus] = useState("idle"); // idle, scanning, complete

  const simulateScan = () => {
    setScanStatus("scanning");
    setTimeout(() => {
      setScanStatus("complete");
    }, 2500);
  };

  const resetScan = () => {
    setScanStatus("idle");
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            AI Document Scanner <Badge status="primary" text="BETA" />
          </h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Upload a passport or ID card. AI will automatically extract the text to prevent manual entry errors.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="history" size={16} /> Scan History</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)", flex: 1, overflow: "hidden" }}>
        
        {/* Left Column: Upload Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          <div className="kc-card" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", border: "2px dashed var(--border)", background: "var(--panel-2)", cursor: "pointer", position: "relative" }}>
            
            {scanStatus === "idle" && (
              <div style={{ textAlign: "center" }} onClick={simulateScan}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto", border: "1px solid var(--border)" }}>
                  <Icon name="upload-cloud" size={32} color="var(--color-primary)" />
                </div>
                <h3 style={{ margin: "0 0 8px 0" }}>Drag & Drop Document Here</h3>
                <p style={{ color: "var(--dim)", margin: 0, fontSize: "var(--text-sm)" }}>Supports JPG, PNG, PDF (Max 5MB)</p>
                <div style={{ marginTop: "var(--space-md)" }}>
                  <Badge status="default" text="Passports" /> <Badge status="default" text="ID Cards" /> <Badge status="default" text="Karta Pobytu" />
                </div>
              </div>
            )}

            {scanStatus === "scanning" && (
              <div style={{ textAlign: "center" }}>
                <Icon name="loader" size={48} color="var(--color-primary)" className="kc-spin" style={{ marginBottom: 16 }} />
                <h3 style={{ margin: "0 0 8px 0" }}>Extracting Text via AI...</h3>
                <p style={{ color: "var(--dim)", margin: 0, fontSize: "var(--text-sm)" }}>Analyzing MRZ (Machine Readable Zone) and text fields.</p>
              </div>
            )}

            {scanStatus === "complete" && (
              <div style={{ width: "100%", height: "100%", padding: "var(--space-md)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-md)" }}>
                  <Badge status="success" text="SCAN COMPLETE" />
                  <button className="kc-btn kc-btn-ghost" onClick={resetScan} style={{ padding: "4px 8px", fontSize: "12px" }}><Icon name="x" size={14} /> Clear</button>
                </div>
                {/* Simulated Image with Overlay */}
                <div style={{ width: "100%", height: "calc(100% - 40px)", background: "#1a1a1a", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                  <div style={{ width: "80%", height: "60%", background: "#e5e5e5", borderRadius: 8, position: "relative", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
                    {/* Dummy Passport Visual */}
                    <div style={{ width: 100, height: 120, background: "#ccc", position: "absolute", top: 20, left: 20, borderRadius: 4 }}></div>
                    <div style={{ position: "absolute", top: 20, left: 140, width: 200, height: 12, background: "rgba(59, 130, 246, 0.3)", border: "1px solid var(--color-primary)" }}></div>
                    <div style={{ position: "absolute", top: 40, left: 140, width: 150, height: 12, background: "rgba(59, 130, 246, 0.3)", border: "1px solid var(--color-primary)" }}></div>
                    <div style={{ position: "absolute", bottom: 20, left: 20, width: "calc(100% - 40px)", height: 24, background: "rgba(16, 185, 129, 0.3)", border: "1px solid var(--color-success)" }}></div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Extracted Data */}
        <div style={{ width: 450, display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          <div className="kc-card" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <h3 style={{ margin: "0 0 16px 0", borderBottom: "1px solid var(--border)", paddingBottom: 16 }}>Extracted Data</h3>
            
            {scanStatus === "idle" || scanStatus === "scanning" ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--dim)" }}>
                No document scanned yet.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", flex: 1, overflowY: "auto" }}>
                <div>
                  <label className="kc-label">Document Type <span style={{ color: "var(--color-success)", float: "right", fontSize: "10px" }}>99% Confidence</span></label>
                  <select className="kc-input" defaultValue="passport">
                    <option value="passport">Passport</option>
                    <option value="id">ID Card</option>
                    <option value="trc">Residence Permit</option>
                  </select>
                </div>
                
                <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                  <div style={{ flex: 1 }}>
                    <label className="kc-label">First Name</label>
                    <input type="text" className="kc-input" defaultValue="IVAN" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="kc-label">Last Name</label>
                    <input type="text" className="kc-input" defaultValue="PETROV" />
                  </div>
                </div>

                <div>
                  <label className="kc-label">Document Number</label>
                  <input type="text" className="kc-input" defaultValue="FH492011" />
                </div>

                <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                  <div style={{ flex: 1 }}>
                    <label className="kc-label">Date of Birth</label>
                    <input type="text" className="kc-input" defaultValue="1985-04-12" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="kc-label">Nationality</label>
                    <input type="text" className="kc-input" defaultValue="UKR" />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "var(--space-sm)" }}>
                  <div style={{ flex: 1 }}>
                    <label className="kc-label">Date of Issue</label>
                    <input type="text" className="kc-input" defaultValue="2020-08-15" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="kc-label">Date of Expiry</label>
                    <input type="text" className="kc-input" defaultValue="2030-08-15" />
                  </div>
                </div>

                <div>
                  <label className="kc-label">MRZ (Machine Readable Zone)</label>
                  <textarea className="kc-input" rows="2" defaultValue="P<UKRPETROV<<IVAN<<<<<<<<<<<<<<<<<<<<<<<<<<&#10;FH492011<4UKR8504126M3008155<<<<<<<<<<<<<<02" style={{ fontFamily: "monospace", fontSize: "12px", background: "var(--panel-2)" }}></textarea>
                </div>

              </div>
            )}

            <div style={{ marginTop: "var(--space-md)", paddingTop: "var(--space-md)", borderTop: "1px solid var(--border)", display: "flex", gap: "var(--space-sm)" }}>
               <button className="kc-btn kc-btn-primary" style={{ flex: 1 }} disabled={scanStatus !== "complete"}>
                 <Icon name="save" size={16} /> Save to Client Profile
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
