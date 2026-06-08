"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Icon, Spinner } from "./ui";

export default function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults(null);
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }
    
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results);
        }
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setIsLoading(false);
      }
    }, 400); // 400ms debounce
    
    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard shortcut to close (Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
      // Cmd+K to open (should be handled in Shell, but we can prevent default here if needed)
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="kc-modal-bg" style={{ alignItems: "flex-start", paddingTop: "10vh" }} onClick={onClose}>
      <div 
        className="kc-modal" 
        style={{ padding: 0, overflow: "hidden", maxWidth: 600 }} 
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
          <Icon name="search" size={20} color="var(--dim)" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads, users, cases..."
            style={{ 
              flex: 1, border: "none", background: "transparent", 
              outline: "none", color: "var(--text)", fontSize: "16px",
              padding: "0 12px"
            }}
          />
          {isLoading && <div className="kc-spin" style={{ width: 16, height: 16, borderWidth: 2 }} />}
          <button 
            onClick={onClose} 
            style={{ background: "var(--panel-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "2px 6px", fontSize: 10, color: "var(--dim)", cursor: "pointer", marginLeft: 8 }}
          >
            ESC
          </button>
        </div>

        <div style={{ maxHeight: "60vh", overflowY: "auto", padding: "8px" }}>
          {!query && (
            <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--dim)", fontSize: 13 }}>
              Type to start searching across the CRM...
            </div>
          )}
          
          {query && !isLoading && results && results.length === 0 && (
            <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--dim)", fontSize: 13 }}>
              No results found for "{query}"
            </div>
          )}

          {results && results.map((group, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ padding: "4px 8px", fontSize: 11, fontWeight: 600, color: "var(--faint)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                {group.type}
              </div>
              {group.items.map((item, j) => (
                <div 
                  key={j}
                  onClick={() => { onClose(); router.push(item.url); }}
                  style={{ 
                    display: "flex", alignItems: "center", padding: "10px 8px", 
                    borderRadius: 8, cursor: "pointer", gap: 12, transition: "background 0.15s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--panel-2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--brass-bg)", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={item.icon || "file"} size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 2 }}>{item.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
