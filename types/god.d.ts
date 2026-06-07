export interface GodAgent {
  id: string;
  name: string; // e.g., "Grand Architect Oleksandr Khrysytodul"
  policies: Record<string, any>; // JSON policy blob
  createdAt: string;
}

export interface GodCommand {
  command: string; // free‑form command description
  payload?: any;
}
