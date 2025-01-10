"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import axios from "axios";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegistrationList } from "./components/RegistrationList";
import { GuestList } from "./components/GuestList";
import { ScheduleList } from "./components/ScheduleList";
import { ExhibitorList } from "./components/ExhibitorList";
import { MaterialList } from "./components/MaterialList";
import { NewsList } from "./components/NewsList";
import { VideoList } from "./components/VideoList";
import { PhotoList } from "./components/PhotoList";
import { Livestream } from "./components/Livestream";

export default function EventManagementPage() {
  const t = useTranslations("Admin.EventManagement");
  const params = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetchEvent();
  }, []);

  async function fetchEvent() {
    try {
      const response = await axios.get(`/api/admin/events/${params.id}`);
      setEvent(response.data);
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  }

  if (!event) return <div>{t("loading")}</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">
        {t("eventManagement", { eventTitle: event.title })}
      </h1>
      <Tabs defaultValue="registrations">
        <TabsList>
          <TabsTrigger value="registrations">{t("registrations")}</TabsTrigger>
          <TabsTrigger value="guests">{t("guests")}</TabsTrigger>
          <TabsTrigger value="schedule">{t("schedule")}</TabsTrigger>
          <TabsTrigger value="exhibitors">{t("exhibitors")}</TabsTrigger>
          <TabsTrigger value="materials">{t("materials")}</TabsTrigger>
          <TabsTrigger value="news">{t("news")}</TabsTrigger>
          <TabsTrigger value="videos">{t("videos")}</TabsTrigger>
          <TabsTrigger value="photos">{t("photos")}</TabsTrigger>
          <TabsTrigger value="livestream">{t("livestream")}</TabsTrigger>
        </TabsList>
        <TabsContent value="registrations">
          <RegistrationList eventId={event.id} />
        </TabsContent>
        <TabsContent value="guests">
          <GuestList eventId={event.id} />
        </TabsContent>
        <TabsContent value="schedule">
          <ScheduleList eventId={event.id} />
        </TabsContent>
        <TabsContent value="exhibitors">
          <ExhibitorList eventId={event.id} />
        </TabsContent>
        <TabsContent value="materials">
          <MaterialList eventId={event.id} />
        </TabsContent>
        <TabsContent value="news">
          <NewsList eventId={event.id} />
        </TabsContent>
        <TabsContent value="videos">
          <VideoList eventId={event.id} />
        </TabsContent>
        <TabsContent value="photos">
          <PhotoList eventId={event.id} />
        </TabsContent>
        <TabsContent value="livestream">
          <Livestream eventId={event.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
