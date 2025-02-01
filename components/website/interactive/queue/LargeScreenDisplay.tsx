import type { QueueItem } from "@/types/queue";

interface LargeScreenDisplayProps {
  queueData: QueueItem[];
}

export default function LargeScreenDisplay({
  queueData,
}: LargeScreenDisplayProps) {
  const waitingItems = queueData.filter((item) => item.status === "waiting");
  const calledItems = queueData.filter((item) => item.status === "called");

  return (
    <div className="bg-black text-white p-8 min-h-screen">
      <h1 className="text-6xl font-bold mb-8 text-center">餐厅排队系统</h1>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-4xl font-semibold mb-4">等待中</h2>
          <div className="grid grid-cols-3 gap-4">
            {waitingItems.map((item) => (
              <div key={item.id} className="bg-gray-800 p-4 rounded-lg">
                <p className="text-3xl font-bold">{item.number}</p>
                <p className="text-xl">
                  {item.people}人 - {item.queueType}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-semibold mb-4">请就餐</h2>
          <div className="grid grid-cols-2 gap-4">
            {calledItems.map((item) => (
              <div key={item.id} className="bg-green-800 p-4 rounded-lg">
                <p className="text-5xl font-bold">{item.number}</p>
                <p className="text-2xl">
                  {item.people}人 - {item.queueType}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
