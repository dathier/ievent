"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Livestream {
  id: number;
  streamUrl: string;
  status: string;
}

export function Livestream({ eventId }: { eventId: number }) {
  const t = useTranslations("Admin.EventManagement.Livestream");
  const [livestream, setLivestream] = useState<Livestream | null>(null);
  const [streamUrl, setStreamUrl] = useState("");
  const [status, setStatus] = useState("not_started");

  useEffect(() => {
    fetchLivestream();
  }, []);

  async function fetchLivestream() {
    try {
      const response = await axios.get(
        `/api/admin/events/${eventId}/livestream`
      );
      setLivestream(response.data);
      if (response.data) {
        setStreamUrl(response.data.streamUrl);
        setStatus(response.data.status);
      }
    } catch (error) {
      console.error("Error fetching livestream:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (livestream) {
        await axios.put(`/api/admin/events/${eventId}/livestream`, {
          streamUrl,
          status,
        });
      } else {
        await axios.post(`/api/admin/events/${eventId}/livestream`, {
          streamUrl,
          status,
        });
      }
      toast({
        title: t("livestreamUpdated"),
        description: t("livestreamUpdatedDescription"),
      });
      fetchLivestream();
    } catch (error) {
      console.error("Error updating livestream:", error);
      toast({
        title: t("livestreamUpdateError"),
        description: t("livestreamUpdateErrorDescription"),
        variant: "destructive",
      });
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder={t("streamUrl")}
          value={streamUrl}
          onChange={(e) => setStreamUrl(e.target.value)}
          required
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder={t("status.selectStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="live">{t("status.live")}</SelectItem>
            <SelectItem value="not_started">
              {t("status.notStarted")}
            </SelectItem>
            <SelectItem value="ended">{t("status.ended")}</SelectItem>
            <SelectItem value="replay">{t("status.replay")}</SelectItem>
            <SelectItem value="no_stream">{t("status.noStream")}</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit">
          {livestream ? t("updateLivestream") : t("createLivestream")}
        </Button>
      </form>
    </div>
  );
}
