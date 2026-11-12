import { AppShell } from "@/components/layout/app-shell";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TEMP: allow direct UI preview without login while designing and testing routes.
  return <AppShell>{children}</AppShell>;
}
