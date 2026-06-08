"use client";
/* iPhoenixCRM — Two-Factor Authentication Setup */
import React, { useState } from "react";
import { Icon, Badge } from "@/components/admin/ui";

export default function TwoFactorAuthPage() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [setupStep, setSetupStep] = useState(0); // 0: overview, 1: QR code, 2: verify, 3: success
  const [code, setCode] = useState("");

  const handleVerify = () => {
    if (code.length === 6) {
      setIsEnabled(true);
      setSetupStep(3);
    } else {
      alert("Please enter a valid 6-digit code.");
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-xl)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>Two-Factor Authentication (2FA)</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Add an extra layer of security to your iPhoenixCRM account.
          </p>
        </div>
        <Badge status={isEnabled ? "success" : "dim"} text={isEnabled ? "Enabled" : "Disabled"} />
      </div>

      <div className="kc-card" style={{ padding: "var(--space-2xl)" }}>
        {setupStep === 0 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 80, height: 80, background: "color-mix(in srgb, var(--color-primary) 10%, transparent)", color: "var(--color-primary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto var(--space-lg)" }}>
              <Icon name="settings" size={40} />
            </div>
            <h3 className="kc-h3">Secure Your Account</h3>
            <p style={{ color: "var(--dim)", maxWidth: 400, margin: "var(--space-md) auto var(--space-xl)" }}>
              Two-factor authentication protects your account by requiring a code from your mobile device when logging in.
            </p>
            <button className="kc-btn kc-btn-primary" onClick={() => setSetupStep(1)} style={{ margin: "0 auto" }}>
              Setup 2FA Now
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
                {/* Mock QR Code */}
                <div style={{ width: "100%", height: "100%", background: "repeating-linear-gradient(45deg, #000, #000 10px, #fff 10px, #fff 20px)" }}></div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--dim)", marginBottom: 8 }}>Can&apos;t scan the code? Enter this manually:</div>
                <div style={{ fontFamily: "monospace", fontSize: "var(--text-lg)", background: "var(--bg)", padding: "8px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
                  JBSWY3DPEHPK3PXP
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
              <button className="kc-btn kc-btn-primary" onClick={handleVerify} disabled={code.length !== 6}>Verify & Enable</button>
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
            
            <div style={{ background: "color-mix(in srgb, var(--color-warning) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--color-warning) 30%, transparent)", padding: "var(--space-md)", borderRadius: "var(--radius-md)", textAlign: "left", marginBottom: "var(--space-xl)" }}>
              <div style={{ color: "var(--color-warning)", fontWeight: 600, display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Icon name="alert" size={16} /> Save Recovery Codes
              </div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--dim)" }}>
                If you lose access to your authenticator app, you can use these recovery codes to log in. Save them in a secure place.
              </div>
              <div style={{ fontFamily: "monospace", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: "var(--space-md)", background: "var(--bg)", padding: "var(--space-md)", borderRadius: "var(--radius-sm)" }}>
                <div>A1B2-C3D4</div>
                <div>E5F6-G7H8</div>
                <div>I9J0-K1L2</div>
                <div>M3N4-O5P6</div>
              </div>
            </div>

            <button className="kc-btn kc-btn-primary" onClick={() => window.location.href = "/admin/settings"} style={{ margin: "0 auto" }}>
              Return to Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
