"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

interface Prize {
  id: number;
  name: string;
  quantity: number;
  probability: number;
}

interface Winner {
  id: number;
  name: string;
  prizeId: number | null;
}

interface Lottery {
  id: number;
  name: string;
  numberOfWinners: number;
  status: "PENDING" | "COMPLETED";
  isStarted: boolean;
  winnersJson: string | null;
  prizes: Prize[];
  participants?: Winner[];
  _count: {
    participants: number;
  };
}

export default function LotteriesPage() {
  const t = useTranslations("Admin.Interactions.Lotteries");
  const router = useRouter();
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [filteredLotteries, setFilteredLotteries] = useState<Lottery[]>([]);
  const [newLottery, setNewLottery] = useState({
    name: "",
    numberOfWinners: 1,
  });
  const [editingLottery, setEditingLottery] = useState<Lottery | null>(null);
  const [newPrize, setNewPrize] = useState<Omit<Prize, "id">>({
    name: "",
    quantity: 1,
    probability: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchLotteries();
  }, []);

  useEffect(() => {
    setFilteredLotteries(
      lotteries.filter((lottery) =>
        lottery.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [lotteries, searchTerm]);

  async function fetchLotteries() {
    try {
      const response = await axios.get("/api/admin/lotteries");
      setLotteries(response.data);
    } catch (error) {
      console.error("Error fetching lotteries:", error);
      toast({
        title: t("fetchError"),
        description: t("fetchErrorDescription"),
        variant: "destructive",
      });
    }
  }

  async function createLottery() {
    try {
      await axios.post("/api/admin/lotteries", newLottery);
      toast({
        title: t("createSuccess"),
        description: t("createSuccessDescription"),
      });
      fetchLotteries();
      setNewLottery({ name: "", numberOfWinners: 1 });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating lottery:", error);
      toast({
        title: t("createError"),
        description: t("createErrorDescription"),
        variant: "destructive",
      });
    }
  }

  async function deleteLottery(id: number) {
    try {
      await axios.delete(`/api/admin/lotteries/${id}`);
      toast({
        title: t("deleteSuccess"),
        description: t("deleteSuccessDescription"),
      });
      fetchLotteries();
    } catch (error) {
      console.error("Error deleting lottery:", error);
      toast({
        title: t("deleteError"),
        description: t("deleteErrorDescription"),
        variant: "destructive",
      });
    }
  }

  async function toggleLotteryStatus(id: number, isStarted: boolean) {
    try {
      await axios.put(`/api/admin/lotteries/${id}`, { isStarted });
      toast({
        title: isStarted ? t("lotteryStarted") : t("lotteryStopped"),
        description: isStarted
          ? t("lotteryStartedDescription")
          : t("lotteryStoppedDescription"),
      });
      fetchLotteries();
    } catch (error) {
      console.error("Error toggling lottery status:", error);
      toast({
        title: t("updateError"),
        description: t("updateErrorDescription"),
        variant: "destructive",
      });
    }
  }

  async function addPrize(lotteryId: number) {
    try {
      await axios.post(`/api/admin/lotteries/${lotteryId}/prizes`, newPrize);
      toast({
        title: t("prizeAdded"),
        description: t("prizeAddedDescription"),
      });
      fetchLotteries();
      setNewPrize({ name: "", quantity: 1, probability: 0 });
      setEditingLottery(null);
    } catch (error) {
      console.error("Error adding prize:", error);
      toast({
        title: t("addPrizeError"),
        description: t("addPrizeErrorDescription"),
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>{t("createLottery")}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("createLottery")}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    {t("lotteryName")}
                  </Label>
                  <Input
                    id="name"
                    value={newLottery.name}
                    onChange={(e) =>
                      setNewLottery({ ...newLottery, name: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="winners" className="text-right">
                    {t("numberOfWinners")}
                  </Label>
                  <Input
                    id="winners"
                    type="number"
                    value={newLottery.numberOfWinners}
                    onChange={(e) =>
                      setNewLottery({
                        ...newLottery,
                        numberOfWinners: Number.parseInt(e.target.value),
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={createLottery}>{t("create")}</Button>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder={t("searchLotteries")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("lotteryName")}</TableHead>
                <TableHead>{t("numberOfWinners")}</TableHead>
                <TableHead>{t("statusTitle")}</TableHead>
                <TableHead>{t("participants")}</TableHead>
                <TableHead>{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLotteries.map((lottery) => (
                <TableRow key={lottery.id}>
                  <TableCell>{lottery.name}</TableCell>
                  <TableCell>{lottery.numberOfWinners}</TableCell>
                  <TableCell>{t(`status.${lottery.status}`)}</TableCell>
                  <TableCell>{lottery._count.participants}</TableCell>
                  <TableCell>
                    <div className="space-x-2">
                      <Button
                        onClick={() =>
                          toggleLotteryStatus(lottery.id, !lottery.isStarted)
                        }
                      >
                        {lottery.isStarted ? t("stop") : t("start")}
                      </Button>
                      <Button
                        onClick={() => deleteLottery(lottery.id)}
                        variant="destructive"
                      >
                        {t("delete")}
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button onClick={() => setEditingLottery(lottery)}>
                            {t("addPrize")}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t("addPrize")}</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                {t("prizeName")}
                              </Label>
                              <Input
                                id="name"
                                value={newPrize.name}
                                onChange={(e) =>
                                  setNewPrize({
                                    ...newPrize,
                                    name: e.target.value,
                                  })
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="quantity" className="text-right">
                                {t("prizeQuantity")}
                              </Label>
                              <Input
                                id="quantity"
                                type="number"
                                value={newPrize.quantity}
                                onChange={(e) =>
                                  setNewPrize({
                                    ...newPrize,
                                    quantity: Number.parseInt(e.target.value),
                                  })
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="probability"
                                className="text-right"
                              >
                                {t("prizeProbability")}
                              </Label>
                              <Input
                                id="probability"
                                type="number"
                                step="0.01"
                                value={newPrize.probability}
                                onChange={(e) =>
                                  setNewPrize({
                                    ...newPrize,
                                    probability: Number.parseFloat(
                                      e.target.value
                                    ),
                                  })
                                }
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <Button
                            onClick={() => lottery && addPrize(lottery.id)}
                          >
                            {t("addPrize")}
                          </Button>
                        </DialogContent>
                      </Dialog>
                      <Button asChild>
                        <Link href={`/website/lottery/${lottery.id}/register`}>
                          {t("registerLink")}
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link href={`/website/lottery/${lottery.id}/result`}>
                          {t("resultLink")}
                        </Link>
                      </Button>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="prizes">
                        <AccordionTrigger>{t("prizeList")}</AccordionTrigger>
                        <AccordionContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>{t("prizeName")}</TableHead>
                                <TableHead>{t("prizeQuantity")}</TableHead>
                                <TableHead>{t("prizeProbability")}</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {lottery.prizes.map((prize) => (
                                <TableRow key={prize.id}>
                                  <TableCell>{prize.name}</TableCell>
                                  <TableCell>{prize.quantity}</TableCell>
                                  <TableCell>{prize.probability}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="winners">
                        <AccordionTrigger>{t("winnerList")}</AccordionTrigger>
                        <AccordionContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>{t("winnerName")}</TableHead>
                                <TableHead>{t("prizeName")}</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(lottery.participants || []).map((winner) => (
                                <TableRow key={winner.id}>
                                  <TableCell>{winner.name}</TableCell>
                                  <TableCell>
                                    {winner.prizeId
                                      ? lottery.prizes.find(
                                          (prize) => prize.id === winner.prizeId
                                        )?.name || t("unknownPrize")
                                      : t("noPrize")}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
