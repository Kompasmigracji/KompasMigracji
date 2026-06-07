import React from 'react';
import AgentsDashboard from '@/components/AgentsDashboard';

export const dynamic = 'force-dynamic';

export default function AgentsAdminPage() {
  return (
    <main className="min-h-screen bg-navy">
      <AgentsDashboard />
    </main>
  );
}
