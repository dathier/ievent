"use client";

import { useState, useEffect } from "react";
import LargeScreenDisplay from "@/components/website/interactive/queue/LargeScreenDisplay";
import type { QueueItem } from "@/types/queue";

export default function LargeScreenPage() {
  const [queueData, setQueueData] = useState<QueueItem[]>([]);

  useEffect(() => {
    const fetchQueueData = async () => {
      const response = await fetch("/api/interactive/queue");
      const data = await response.json();
      setQueueData(data);
    };

    fetchQueueData();
    const interval = setInterval(fetchQueueData, 5000); // 每5秒更新一次

    return () => clearInterval(interval);
  }, []);

  return <LargeScreenDisplay queueData={queueData} />;
}
