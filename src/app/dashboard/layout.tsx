import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 pl-20 pr-8 py-8">
      <div className="max-w-6xl mx-auto">{children}</div>
    </div>
  );
}
