"use client";
/* KompasCRM — File Upload & Document List Component */
import React, { useState, useEffect, useCallback } from "react";
import { Icon, Spinner, EmptyState } from "./ui";

export default function FileUpload({ entityType, entityId, onUploadSuccess }) {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const loadFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/files?entity_type=${entityType}&entity_id=${entityId}`);
      const d = await res.json();
      setFiles(d.files || []);
    } catch {
      setError("Помилка завантаження файлів");
    } finally {
      setIsLoading(false);
    }
  }, [entityType, entityId]);

  useEffect(() => {
    if (entityType && entityId) {
      loadFiles();
    }
  }, [entityType, entityId, loadFiles]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const uploadFile = async (file) => {
    if (!file) return;
    
    // Check file size (limit to 20MB for safety)
    if (file.size > 20 * 1024 * 1024) {
      setError("Файл занадто великий (макс. 20MB)");
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("entity_type", entityType);
    formData.append("entity_id", String(entityId));

    try {
      const res = await fetch("/api/admin/files", {
        method: "POST",
        body: formData,
      });

      const d = await res.json();
      if (d.error) {
        setError(d.error);
      } else {
        // Prepend new file to list
        setFiles((prev) => [d.file, ...prev]);
        if (onUploadSuccess) {
          onUploadSuccess(d.file);
        }
      }
    } catch {
      setError("Помилка завантаження файлу");
    } finally {
      setUploading(false);
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const dm = 1;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
      
      {/* Upload Zone */}
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        style={{
          border: isDragActive ? "2px dashed var(--color-primary)" : "2px dashed var(--border)",
          background: isDragActive ? "var(--brass-bg)" : "var(--panel-2)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-lg)",
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.2s ease",
          position: "relative"
        }}
        onClick={() => document.getElementById(`file-input-${entityType}-${entityId}`).click()}
      >
        <input 
          id={`file-input-${entityType}-${entityId}`}
          type="file" 
          style={{ display: "none" }} 
          onChange={handleFileInput} 
        />
        
        {uploading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Spinner />
            <span style={{ fontSize: "var(--text-sm)", color: "var(--color-primary)" }}>Завантаження...</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ color: "var(--faint)" }}>
              <Icon name="download" size={24} />
            </div>
            <span style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>
              Перетягніть файл сюди або <span style={{ color: "var(--color-primary)" }}>натисніть для вибору</span>
            </span>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--faint)" }}>
              Будь-які документи або зображення до 20MB
            </span>
          </div>
        )}
      </div>

      {error && (
        <div style={{ color: "var(--color-danger)", fontSize: "var(--text-xs)", textAlign: "center" }}>
          {error}
        </div>
      )}

      {/* File List */}
      {isLoading ? (
        <Spinner />
      ) : files.length === 0 ? (
        <EmptyState title="Немає файлів" description="Документи не додавалися до цієї справи." icon="file" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
          {files.map((file) => (
            <div 
              key={file.id} 
              className="kc-card" 
              style={{ 
                padding: "10px 14px", 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                background: "var(--panel)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", minWidth: 0 }}>
                <div style={{ color: "var(--color-primary)", flexShrink: 0 }}>
                  <Icon name="file" size={18} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div 
                    style={{ 
                      fontSize: "var(--text-sm)", 
                      fontWeight: 500, 
                      overflow: "hidden", 
                      textOverflow: "ellipsis", 
                      whiteSpace: "nowrap" 
                    }}
                    title={file.original_name}
                  >
                    {file.original_name}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--faint)" }}>
                    {formatSize(file.size_bytes)} • Завантажив {file.uploader_name || "Користувач"}
                  </div>
                </div>
              </div>

              <a 
                href={`/api/admin/files/download/${file.id}`} 
                className="kc-btn kc-btn-ghost" 
                style={{ padding: 6, minHeight: "auto" }}
                title="Скачати"
                download
              >
                <Icon name="download" size={16} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
