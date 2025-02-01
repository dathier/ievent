"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelfServiceKioskProps {
  addToQueue: (people: number, queueType: string) => Promise<void>;
}

export default function SelfServiceKiosk({
  addToQueue,
}: SelfServiceKioskProps) {
  const [people, setPeople] = useState(2);
  const [queueType, setQueueType] = useState("普通餐");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addToQueue(people, queueType);
    alert(`取号成功！`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="people"
          className="block text-sm font-medium text-gray-700"
        >
          就餐人数
        </label>
        <Select onValueChange={(value) => setPeople(Number(value))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="选择就餐人数" />
          </SelectTrigger>
          <SelectContent>
            {[2, 4, 6, 8, 10].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num}人
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label
          htmlFor="queueType"
          className="block text-sm font-medium text-gray-700"
        >
          用餐类型
        </label>
        <Select onValueChange={setQueueType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="选择用餐类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="普通餐">普通餐</SelectItem>
            <SelectItem value="自助餐">自助餐</SelectItem>
            <SelectItem value="包间">包间</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">
        取号
      </Button>
    </form>
  );
}
