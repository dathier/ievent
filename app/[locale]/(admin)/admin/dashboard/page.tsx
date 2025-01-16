"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  totalAttendees: number;
  totalRevenue: number;
  eventsByMonth: { month: string; count: number }[];
  attendeesByType: { type: string; count: number }[];
}

export default function DashboardPage() {
  const t = useTranslations("Saas.Dashboard");
  const { user } = useUser();
  const [stats, setStats] = useState<DashboardStats | null>({
    totalEvents: 5315,
    upcomingEvents: 45,
    totalAttendees: 984527,
    totalRevenue: 240560,
    eventsByMonth: [
      { month: "January", count: 34 },
      { month: "February", count: 72 },
      { month: "March", count: 11 },
      { month: "April", count: 55 },
      { month: "May", count: 89 },
      { month: "June", count: 23 },
      { month: "July", count: 67 },
      { month: "August", count: 4 },
      { month: "September", count: 92 },
      { month: "October", count: 3 },
      { month: "November", count: 78 },
      { month: "December", count: 51 },
    ],
    attendeesByType: [
      { type: "Regular", count: 23 },
      { type: "VIP", count: 12 },
      { type: "Guest", count: 38 },
      { type: "Speaker", count: 7 },
    ],
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  async function fetchDashboardStats() {
    try {
      const response = await fetch("/api/saas/dashboard-stats");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  }

  if (!stats) {
    return <div>{t("loading")}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        {t("welcome", { name: user?.firstName || "" })}
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("totalEvents")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalEvents}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("upcomingEvents")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.upcomingEvents}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("totalAttendees")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalAttendees}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("totalRevenue")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ${stats.totalRevenue.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("eventsByMonth")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.eventsByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("attendeesByType")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.attendeesByType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className="flex justify-center">
        <Button asChild>
          <Link href="/saas/events/create">{t("createNewEvent")}</Link>
        </Button>
      </div>
    </div>
  );
}
