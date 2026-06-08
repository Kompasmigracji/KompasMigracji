"use client";
/* iPhoenixCRM — AI Data Annotation & Training (Doccano / Piaf style) */
import React, { useState } from "react";
import { Icon, Badge } from "@/components/admin/ui";

export default function AITrainingPage() {
  const [currentSample, setCurrentSample] = useState(0);
  
  const samples = [
    {
      id: "SAMP-992",
      clientMsg: "Hi, I need to cancel my visa application, can I get a refund?",
      aiResponse: "I am sorry to hear that. According to our policy, you can get a 50% refund if you cancel within 14 days.",
      intent: "Refund Request",
      confidence: "92%"
    },
    {
      id: "SAMP-993",
      clientMsg: "How do I add another user to my enterprise plan?",
      aiResponse: "To add a user, go to Settings -> Members and click 'Invite'.",
      intent: "Technical Support",
      confidence: "88%"
    }
  ];

  const sample = samples[currentSample];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
        <div>
          <h2 className="kc-h2" style={{ margin: 0 }}>AI Training & Annotation</h2>
          <p style={{ color: "var(--dim)", marginTop: "var(--space-xs)", fontSize: "var(--text-sm)" }}>
            Review AI responses and annotate data to improve your custom model.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <button className="kc-btn kc-btn-secondary"><Icon name="database" size={16} /> Dataset</button>
          <button className="kc-btn kc-btn-primary"><Icon name="cpu" size={16} /> Retrain Model</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-lg)", flex: 1 }}>
        {/* Left: Annotation Studio */}
        <div className="kc-card" style={{ flex: 2, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-md)" }}>
            <h3 className="kc-h3" style={{ fontSize: "var(--text-sm)", margin: 0 }}>Annotation Studio</h3>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--dim)" }}>Sample {currentSample + 1} of {samples.length}</span>
          </div>

          <div style={{ background: "var(--bg)", padding: "var(--space-md)", borderRadius: 8, marginBottom: "var(--space-md)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginBottom: 8, textTransform: "uppercase" }}>Client Message</div>
            <div style={{ fontSize: "var(--text-md)", lineHeight: 1.5 }}>
              "{sample.clientMsg}"
            </div>
          </div>

          <div style={{ background: "color-mix(in srgb, var(--color-primary) 10%, var(--bg))", padding: "var(--space-md)", borderRadius: 8, marginBottom: "var(--space-lg)", border: "1px solid color-mix(in srgb, var(--color-primary) 30%, var(--border))" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-primary)", textTransform: "uppercase", fontWeight: 600 }}>AI Suggested Response</div>
              <Badge status="info" text={`Confidence: ${sample.confidence}`} />
            </div>
            <textarea 
              className="kc-input" 
              defaultValue={sample.aiResponse} 
              style={{ width: "100%", minHeight: 100, resize: "vertical", background: "var(--bg)" }}
            />
          </div>

          <div style={{ marginTop: "auto", display: "flex", gap: "var(--space-sm)", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "var(--space-md)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>Detected Intent:</span>
              <select className="kc-input" defaultValue={sample.intent}>
                <option>Refund Request</option>
                <option>Technical Support</option>
                <option>Sales Inquiry</option>
                <option>Spam</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="kc-btn kc-btn-danger" onClick={() => setCurrentSample((prev) => (prev + 1) % samples.length)}>
                <Icon name="x" size={16} /> Reject
              </button>
              <button className="kc-btn kc-btn-success" onClick={() => setCurrentSample((prev) => (prev + 1) % samples.length)}>
                <Icon name="check" size={16} /> Approve & Next
              </button>
            </div>
          </div>
        </div>

        {/* Right: Model Metrics */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          <div className="kc-card">
            <h3 className="kc-h3" style={{ fontSize: "var(--text-sm)", marginBottom: "var(--space-md)" }}>Model Accuracy</h3>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 42, fontWeight: 700, color: "var(--color-success)" }}>94.2%</span>
              <span style={{ fontSize: "var(--text-sm)", color: "var(--dim)" }}>F1 Score</span>
            </div>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginTop: "var(--space-xs)" }}>
              Based on the last 10,000 annotated interactions.
            </p>
          </div>

          <div className="kc-card">
            <h3 className="kc-h3" style={{ fontSize: "var(--text-sm)", marginBottom: "var(--space-md)" }}>Training Progress</h3>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)", marginBottom: 8 }}>
              <span>Annotations completed</span>
              <span style={{ fontWeight: 600 }}>1,240 / 5,000</span>
            </div>
            <div style={{ height: 8, background: "var(--panel-2)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: "25%", background: "var(--color-primary)", borderRadius: 4 }}></div>
            </div>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--dim)", marginTop: "var(--space-md)" }}>
              Reach 5,000 annotations to unlock Fine-Tuning v2.0.
            </p>
          </div>

          <div className="kc-card" style={{ flex: 1 }}>
             <h3 className="kc-h3" style={{ fontSize: "var(--text-sm)", marginBottom: "var(--space-md)" }}>Top Contributors</h3>
             <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="award" size={14} color="gold" /> Alex J.</span>
                  <span style={{ fontWeight: 600 }}>842</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-sm)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name="award" size={14} color="silver" /> Maria G.</span>
                  <span style={{ fontWeight: 600 }}>310</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
