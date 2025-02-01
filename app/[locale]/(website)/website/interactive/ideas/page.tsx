import { InteractiveIdeasList } from "@/components/website/interactive/InteractiveIdeasList";

export default function InteractiveIdeasPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8 mt-16">
      <h1 className="text-3xl font-bold mb-4">100 Interactive Event Ideas</h1>
      <p className="mb-6">
        Explore our comprehensive list of interactive event ideas to enhance
        your next event experience.
      </p>
      <InteractiveIdeasList />
    </div>
  );
}
