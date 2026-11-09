import { redirect } from "next/navigation";
import { SignupForm } from "@/components/auth/signup-form";
import { auth } from "@/lib/auth";

export default async function SignupPage() {
  const session = await auth();

  if (session?.user.id && !session.error) {
    redirect(session.redirectTo || "/home");
  }

  return <SignupForm />;
}
