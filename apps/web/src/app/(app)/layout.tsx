import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { auth } from "@/lib/auth";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user.id || session.error) {
    redirect("/login");
  }

  if (session.user.role !== "student") {
    redirect(session.redirectTo || "/login");
  }

  return <AppShell>{children}</AppShell>;
}
