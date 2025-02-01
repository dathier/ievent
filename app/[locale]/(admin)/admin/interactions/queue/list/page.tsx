"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { QueueItem } from "@/types/queue";

export default function QueueListPage() {
  const t = useTranslations("Admin.Interactions.Queue");
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);

  useEffect(() => {
    const fetchQueueItems = async () => {
      const response = await fetch("/api/interactive/queue");
      const data = await response.json();
      setQueueItems(data);
    };
    fetchQueueItems();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("list.title")}</h1>
      <Button asChild>
        <Link href="/admin/interactions/queue/create">{t("create")}</Link>
      </Button>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("list.number")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("list.people")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("list.type")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("list.status")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("list.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {queueItems.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap">{item.number}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.people}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.queueType}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.status}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  href={`/admin/interactions/queue/edit/${item.id}`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  {t("list.edit")}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
