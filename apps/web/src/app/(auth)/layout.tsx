import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="layout-theme-toggle">
        <ThemeToggle />
      </div>
      {children}
    </>
  );
}
