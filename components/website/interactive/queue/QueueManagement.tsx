"use client";

import { useState, useEffect } from "react";
import QueueDisplay from "./QueueDisplay";
import SelfServiceKiosk from "./SelfServiceKiosk";
import StaffInterface from "./StaffInterface";
import type { QueueItem } from "@/types/queue";

export default function QueueManagement() {
  const [queueData, setQueueData] = useState<QueueItem[]>([]);

  useEffect(() => {
    fetchQueueData();
  }, []);

  const fetchQueueData = async () => {
    const response = await fetch("/api/interactive/queue");
    const data = await response.json();
    setQueueData(data);
  };

  const addToQueue = async (people: number, queueType: string) => {
    const response = await fetch("/api/interactive/queue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ people, queueType }),
    });
    const newQueueItem = await response.json();
    setQueueData([...queueData, newQueueItem]);
  };

  const updateQueueItem = async (id: number, status: string) => {
    const response = await fetch("/api/interactive/queue", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const updatedQueueItem = await response.json();
    setQueueData(
      queueData.map((item) =>
        item.id === updatedQueueItem.id ? updatedQueueItem : item
      )
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">自助取号</h2>
        <SelfServiceKiosk addToQueue={addToQueue} />
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">当前排队状况</h2>
        <QueueDisplay queueData={queueData} />
      </div>
      <div className="md:col-span-2">
        <h2 className="text-2xl font-semibold mb-4">员工操作界面</h2>
        <StaffInterface
          queueData={queueData}
          updateQueueItem={updateQueueItem}
        />
      </div>
    </div>
  );
}
