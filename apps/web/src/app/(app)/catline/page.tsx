import { auth } from "@/lib/auth";
import { CatlineWorkspace } from "@/components/assistant/catline-workspace";

export default async function CatlinePage() {
  const session = await auth();
  const userName = session?.user.name?.trim() || "Guest";

  return (
    <main className="app-screen catline-screen">
      <CatlineWorkspace userName={userName} />
    </main>
  );
}
