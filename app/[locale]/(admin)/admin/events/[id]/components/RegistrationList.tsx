"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import axios from "axios";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

const registrationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  company: z.string().optional(),
  type: z.enum(["attendee", "media", "exhibitor", "staff"]),
});

interface Registration {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  type: string;
  status: string;
  createdAt: string;
}

export function RegistrationList({ eventId }: { eventId: number }) {
  const t = useTranslations("Admin.EventManagement.Registrations");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    daily: 0,
    weekly: 0,
    monthly: 0,
    byType: {},
  });
  const [isNewRegistrationOpen, setIsNewRegistrationOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      type: "attendee",
    },
  });

  useEffect(() => {
    fetchRegistrations();
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const response = await axios.get(
        `/api/admin/events/${eventId}/registrations/stats`
      );
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching registration stats:", error);
    }
  }

  async function fetchRegistrations() {
    try {
      const response = await axios.get(
        `/api/admin/events/${eventId}/registrations`
      );
      setRegistrations(response.data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      toast({
        title: "Error",
        description: "Failed to fetch registrations",
        variant: "destructive",
      });
    }
  }

  async function handleNewRegistration(
    data: z.infer<typeof registrationSchema>
  ) {
    try {
      await axios.post(`/api/admin/events/${eventId}/registrations`, data);
      toast({
        title: "Success",
        description: "Registration created successfully",
      });
      setIsNewRegistrationOpen(false);
      form.reset();
      fetchRegistrations();
      fetchStats();
    } catch (error) {
      console.error("Error creating registration:", error);
      toast({
        title: "Error",
        description: "Failed to create registration",
        variant: "destructive",
      });
    }
  }

  const handleEdit = (registration: Registration) => {
    // Implementation for edit
  };

  async function handleDelete(registrationId: number) {
    try {
      await axios.delete(
        `/api/admin/events/${eventId}/registrations/${registrationId}`
      );
      fetchRegistrations();
      fetchStats();
      toast({
        title: "Success",
        description: "Registration deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting registration:", error);
      toast({
        title: "Error",
        description: "Failed to delete registration",
        variant: "destructive",
      });
    }
  }

  async function handleReview(registrationId: number, status: string) {
    try {
      await axios.patch(
        `/api/admin/events/${eventId}/registrations/${registrationId}`,
        {
          status,
        }
      );
      fetchRegistrations();
      toast({
        title: "Success",
        description: "Registration status updated successfully",
      });
    } catch (error) {
      console.error("Error updating registration status:", error);
      toast({
        title: "Error",
        description: "Failed to update registration status",
        variant: "destructive",
      });
    }
  }

  const filteredRegistrations = registrations.filter((registration) => {
    return (
      registration.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === "all" || registration.type === filterType)
    );
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("totalRegistrations")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("dailyRegistrations")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.daily}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("weeklyRegistrations")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.weekly}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("monthlyRegistrations")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.monthly}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("registrationsByType")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.byType).map(([type, count]) => (
              <div key={type}>
                <p className="font-semibold">{t(`types.${type}`)}</p>
                <p className="text-xl">{count as number}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <Input
            placeholder={t("search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder={t("filterByType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              <SelectItem value="attendee">{t("types.attendee")}</SelectItem>
              <SelectItem value="media">{t("types.media")}</SelectItem>
              <SelectItem value="exhibitor">{t("types.exhibitor")}</SelectItem>
              <SelectItem value="staff">{t("types.staff")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog
          open={isNewRegistrationOpen}
          onOpenChange={setIsNewRegistrationOpen}
        >
          <DialogTrigger asChild>
            <Button>{t("addRegistration")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("addRegistration")}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleNewRegistration)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("name")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("email")}</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("phone")}</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("company")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("type")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("selectType")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="attendee">
                            {t("types.attendee")}
                          </SelectItem>
                          <SelectItem value="media">
                            {t("types.media")}
                          </SelectItem>
                          <SelectItem value="exhibitor">
                            {t("types.exhibitor")}
                          </SelectItem>
                          <SelectItem value="staff">
                            {t("types.staff")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">{t("submit")}</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("name")}</TableHead>
            <TableHead>{t("email")}</TableHead>
            <TableHead>{t("phone")}</TableHead>
            <TableHead>{t("company")}</TableHead>
            <TableHead>{t("type")}</TableHead>
            <TableHead>{t("statusName")}</TableHead>
            <TableHead>{t("registrationDate")}</TableHead>
            <TableHead>{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRegistrations.map((registration) => (
            <TableRow key={registration.id}>
              <TableCell>{registration.name}</TableCell>
              <TableCell>{registration.email}</TableCell>
              <TableCell>{registration.phone}</TableCell>
              <TableCell>{registration.company}</TableCell>
              <TableCell>{t(`types.${registration.type}`)}</TableCell>
              <TableCell>{t(`status.${registration.status}`)}</TableCell>
              <TableCell>
                {format(new Date(registration.createdAt), "PPp")}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(registration)}
                  >
                    {t("edit")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReview(registration.id, "approved")}
                  >
                    {t("approve")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReview(registration.id, "rejected")}
                  >
                    {t("reject")}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(registration.id)}
                  >
                    {t("delete")}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
