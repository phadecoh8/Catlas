import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { auth } from "@/lib/auth";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user.id && !session.error) {
    redirect(session.redirectTo || "/home");
  }

  return <LoginForm />;
}
