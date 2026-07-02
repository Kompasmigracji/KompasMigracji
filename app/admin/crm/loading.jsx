'use client';
import React from 'react';
import { Spinner } from '@/components/admin/ui';

export default function Loading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
      <Spinner />
    </div>
  );
}
