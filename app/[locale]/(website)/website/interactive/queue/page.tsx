import QueueManagement from "@/components/website/interactive/queue/QueueManagement";

export default function QueuePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">餐厅排队系统</h1>
      <QueueManagement />
    </div>
  );
}
