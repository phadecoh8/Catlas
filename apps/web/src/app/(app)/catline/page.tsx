import { CalmCat } from "@/components/cats/calm-cat";
import { CatlineChat } from "@/components/assistant/catline-chat";

export default function CatlinePage() {
  return (
    <main className="app-screen catline-screen">
      <section aria-labelledby="catline-heading" className="catline-welcome">
        <CalmCat className="catline-cat" size={132} />
        <h1 id="catline-heading">Hello from Catline</h1>
        <p>Your Catlas assistant is here to help.</p>
      </section>

      <CatlineChat />
    </main>
  );
}
