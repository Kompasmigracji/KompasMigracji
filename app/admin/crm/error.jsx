'use client';
import React from 'react';
import { EmptyState } from '@/components/admin/ui';

export default function Error({ error, reset }) {
  return (
    <div style={{ padding: 24 }}>
      <EmptyState
        icon="alert-triangle"
        title="Щось пішло не так"
        description={error.message || "Сталася помилка при завантаженні модуля."}
      />
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <button
          onClick={() => reset()}
          style={{ padding: '8px 16px', background: 'var(--color-primary)', color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer' }}
        >
          Спробувати ще раз
        </button>
      </div>
    </div>
  );
}
