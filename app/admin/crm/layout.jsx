import React from "react";
import DualSidebarShell from "@/components/admin/DualSidebarShell";
import "@/app/globals.css";

export const metadata = { title: "iPhoenixCRM" };

export default function CrmDemoLayout({ children }) {
  return <DualSidebarShell>{children}</DualSidebarShell>;
}
