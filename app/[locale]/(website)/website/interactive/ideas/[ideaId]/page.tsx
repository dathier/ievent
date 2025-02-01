import { InteractiveIdeaDetail } from "@/components/website/interactive/InteractiveIdeaDetail";

export default function InteractiveIdeaDetailPage({
  params,
}: {
  params: { ideaId: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <InteractiveIdeaDetail ideaId={params.ideaId} />
    </div>
  );
}
