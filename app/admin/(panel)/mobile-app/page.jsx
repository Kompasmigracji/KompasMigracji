"use client";
/* KompasCRM — Mobile App Builder & White-Label Portal */
import React, { useState } from "react";
import { Icon, Badge } from "@/components/admin/ui";

export default function MobileAppPage() {
  const [activeTab, setActiveTab] = useState("branding");

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-md)", margin: "-var(--space-lg)" }}>
      
      {/* Header */}
      <div style={{ padding: "var(--space-lg) var(--space-lg) 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Mobile App Builder (PWA)</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Customize your white-label Client Portal. Clients can install it on their phones directly from the browser.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="external-link" size={16} /> Web Preview</button>
          <button className="kc-btn kc-btn-primary"><Icon name="smartphone" size={16} /> Publish Changes</button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, borderTop: "1px solid var(--border)", overflow: "hidden" }}>
        
        {/* Settings Sidebar */}
        <div style={{ width: 400, background: "var(--panel)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
          
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
            <button 
              onClick={() => setActiveTab("branding")}
              style={{ flex: 1, padding: "var(--space-md)", background: activeTab === "branding" ? "var(--bg)" : "transparent", border: "none", borderBottom: activeTab === "branding" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "branding" ? "var(--color-primary)" : "var(--fg)", fontWeight: 600, cursor: "pointer" }}
            >
              Branding
            </button>
            <button 
              onClick={() => setActiveTab("navigation")}
              style={{ flex: 1, padding: "var(--space-md)", background: activeTab === "navigation" ? "var(--bg)" : "transparent", border: "none", borderBottom: activeTab === "navigation" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "navigation" ? "var(--color-primary)" : "var(--fg)", fontWeight: 600, cursor: "pointer" }}
            >
              Navigation
            </button>
            <button 
              onClick={() => setActiveTab("features")}
              style={{ flex: 1, padding: "var(--space-md)", background: activeTab === "features" ? "var(--bg)" : "transparent", border: "none", borderBottom: activeTab === "features" ? "2px solid var(--color-primary)" : "2px solid transparent", color: activeTab === "features" ? "var(--color-primary)" : "var(--fg)", fontWeight: 600, cursor: "pointer" }}
            >
              Features
            </button>
          </div>

          <div style={{ padding: "var(--space-lg)", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
            
            {activeTab === "branding" && (
              <>
                <div>
                  <label style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: "var(--space-xs)" }}>App Name</label>
                  <input type="text" className="kc-input" defaultValue="Kompas Portal" />
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginTop: 4 }}>This is the name that will appear on the phone's home screen.</div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: "var(--space-xs)" }}>App Icon (Logo)</label>
                  <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
                    <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg, #111, #333)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-md)" }}>
                      <Icon name="compass" size={32} color="white" />
                    </div>
                    <button className="kc-btn kc-btn-secondary">Upload Icon</button>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: "var(--space-xs)" }}>Brand Color (Primary)</label>
                  <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "#8b5cf6", border: "1px solid var(--border)" }}></div>
                    <input type="text" className="kc-input" defaultValue="#8b5cf6" style={{ flex: 1 }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: "var(--space-xs)" }}>Splash Screen Background</label>
                  <select className="kc-input">
                    <option>Solid Brand Color</option>
                    <option>Gradient</option>
                    <option>Dark Minimal</option>
                  </select>
                </div>
              </>
            )}

            {activeTab === "navigation" && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ display: "block", fontSize: "var(--text-sm)", fontWeight: 600 }}>Bottom Tab Bar</label>
                  <button className="kc-btn kc-btn-ghost" style={{ padding: "4px 8px" }}><Icon name="plus" size={14} /> Add</button>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", background: "var(--bg)", padding: "var(--space-sm)", borderRadius: 8, border: "1px solid var(--border)" }}>
                    <Icon name="menu" size={16} color="var(--dim)" style={{ cursor: "grab" }} />
                    <Icon name="home" size={16} color="var(--color-primary)" />
                    <input type="text" className="kc-input" defaultValue="Home" style={{ flex: 1, height: 28 }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", background: "var(--bg)", padding: "var(--space-sm)", borderRadius: 8, border: "1px solid var(--border)" }}>
                    <Icon name="menu" size={16} color="var(--dim)" style={{ cursor: "grab" }} />
                    <Icon name="folder" size={16} color="var(--fg)" />
                    <input type="text" className="kc-input" defaultValue="Documents" style={{ flex: 1, height: 28 }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", background: "var(--bg)", padding: "var(--space-sm)", borderRadius: 8, border: "1px solid var(--border)" }}>
                    <Icon name="menu" size={16} color="var(--dim)" style={{ cursor: "grab" }} />
                    <Icon name="message-circle" size={16} color="var(--fg)" />
                    <input type="text" className="kc-input" defaultValue="Chat" style={{ flex: 1, height: 28 }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", background: "var(--bg)", padding: "var(--space-sm)", borderRadius: 8, border: "1px solid var(--border)" }}>
                    <Icon name="menu" size={16} color="var(--dim)" style={{ cursor: "grab" }} />
                    <Icon name="user" size={16} color="var(--fg)" />
                    <input type="text" className="kc-input" defaultValue="Profile" style={{ flex: 1, height: 28 }} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Live Preview Area */}
        <div style={{ flex: 1, background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          
          {/* Subtle Grid Background */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.05, backgroundImage: "linear-gradient(var(--fg) 1px, transparent 1px), linear-gradient(90deg, var(--fg) 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

          {/* iPhone Mockup */}
          <div style={{ width: 320, height: 650, background: "#fff", borderRadius: 40, border: "8px solid #222", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            
            {/* Dynamic Island (Notch) */}
            <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 100, height: 24, background: "#000", borderRadius: 12, zIndex: 10 }}></div>
            
            {/* App Header */}
            <div style={{ padding: "48px 20px 20px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "#8b5cf6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="compass" size={16} color="white" />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 18, color: "#0f172a" }}>Kompas</span>
                </div>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e2e8f0" }}></div>
              </div>
            </div>

            {/* App Body */}
            <div style={{ flex: 1, background: "#f8fafc", padding: 20, overflowY: "auto" }}>
              <div style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>Good morning,</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 24 }}>Anna Smirnova</div>

              <div style={{ background: "#8b5cf6", borderRadius: 16, padding: 20, color: "white", marginBottom: 24, boxShadow: "0 10px 15px -3px rgba(139, 92, 246, 0.3)" }}>
                <div style={{ fontSize: 14, opacity: 0.9 }}>Next Appointment</div>
                <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>Visa Consultation</div>
                <div style={{ fontSize: 14, marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="calendar" size={14} color="white" /> Tomorrow, 14:00
                </div>
              </div>

              <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", marginBottom: 16 }}>Required Documents</div>
              
              <div style={{ background: "white", borderRadius: 12, padding: 16, border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="file-text" size={20} color="#64748b" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>Passport Copy</div>
                    <div style={{ fontSize: 12, color: "#ef4444" }}>Missing</div>
                  </div>
                </div>
                <button style={{ background: "#8b5cf6", color: "white", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 600 }}>Upload</button>
              </div>

              <div style={{ background: "white", borderRadius: 12, padding: 16, border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="check" size={20} color="#10b981" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>Rental Agreement</div>
                    <div style={{ fontSize: 12, color: "#10b981" }}>Verified</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Tab Bar */}
            <div style={{ height: 60, background: "white", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-around", alignItems: "center", paddingBottom: 8 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: "#8b5cf6" }}>
                <Icon name="home" size={24} color="#8b5cf6" />
                <span style={{ fontSize: 10, fontWeight: 600 }}>Home</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: "#94a3b8" }}>
                <Icon name="folder" size={24} color="#94a3b8" />
                <span style={{ fontSize: 10, fontWeight: 500 }}>Docs</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: "#94a3b8", position: "relative" }}>
                <Icon name="message-circle" size={24} color="#94a3b8" />
                <div style={{ position: "absolute", top: -2, right: -4, width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }}></div>
                <span style={{ fontSize: 10, fontWeight: 500 }}>Chat</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: "#94a3b8" }}>
                <Icon name="user" size={24} color="#94a3b8" />
                <span style={{ fontSize: 10, fontWeight: 500 }}>Profile</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
