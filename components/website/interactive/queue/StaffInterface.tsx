"use client";

import { useState } from "react";
import type { QueueItem } from "@/types/queue";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StaffInterfaceProps {
  queueData: QueueItem[];
  updateQueueItem: (id: number, status: string) => Promise<void>;
}

export default function StaffInterface({
  queueData,
  updateQueueItem,
}: StaffInterfaceProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleCall = async () => {
    if (selectedId) {
      await updateQueueItem(selectedId, "called");
      alert(
        `已叫号：${queueData.find((item) => item.id === selectedId)?.number}`
      );
    }
  };

  const handleSeat = async () => {
    if (selectedId) {
      await updateQueueItem(selectedId, "seated");
      alert(
        `${queueData.find((item) => item.id === selectedId)?.number}号已入座`
      );
    }
  };

  const handleSkip = async () => {
    if (selectedId) {
      await updateQueueItem(selectedId, "skipped");
      alert(
        `${queueData.find((item) => item.id === selectedId)?.number}号已跳过`
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Select onValueChange={(value) => setSelectedId(Number(value))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="选择排队号码" />
          </SelectTrigger>
          <SelectContent>
            {queueData
              .filter((item) => item.status === "waiting")
              .map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.number} ({item.people}人 - {item.queueType})
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Button onClick={handleCall}>叫号</Button>
        <Button onClick={handleSeat}>入座</Button>
        <Button onClick={handleSkip}>跳过</Button>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">当前排队状况</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                排队号
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                人数
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                类型
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                时间
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {queueData.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.people}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.queueType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
