import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="admin-theme-toggle fixed bottom-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {children}
    </>
  );
}
