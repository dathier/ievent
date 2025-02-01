import type { QueueItem } from "@/types/queue";

interface QueueDisplayProps {
  queueData: QueueItem[];
}

export default function QueueDisplay({ queueData }: QueueDisplayProps) {
  const waitingItems = queueData.filter((item) => item.status === "waiting");

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          当前等待: {waitingItems.length} 组
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          {waitingItems.map((item, index) => (
            <div
              key={item.id}
              className={`${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              } px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
            >
              <dt className="text-sm font-medium text-gray-500">排队号</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {item.number}
              </dd>
              <dt className="text-sm font-medium text-gray-500">就餐人数</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {item.people}人
              </dd>
              <dt className="text-sm font-medium text-gray-500">用餐类型</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {item.queueType}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
