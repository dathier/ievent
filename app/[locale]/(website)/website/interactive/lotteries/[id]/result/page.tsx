"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import dynamic from "next/dynamic";

const Wheel = dynamic(
  () => import("react-custom-roulette").then((mod) => mod.Wheel),
  { ssr: false }
);

interface Prize {
  id: number;
  name: string;
}

interface Lottery {
  id: number;
  name: string;
  isStarted: boolean;
  prizes: Prize[];
}

export default function LotteryResultPage({
  params,
}: {
  params: { id: string };
}) {
  const t = useTranslations("Lottery");
  const [lottery, setLottery] = useState<Lottery | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  useEffect(() => {
    fetchLottery();
  }, []);

  const fetchLottery = async () => {
    try {
      const response = await axios.get(`/api/lotteries/${params.id}`);
      setLottery(response.data);
    } catch (error) {
      console.error("Error fetching lottery:", error);
      toast({
        title: t("fetchError"),
        description: t("fetchErrorDescription"),
        variant: "destructive",
      });
    }
  };

  const startLottery = async () => {
    if (!lottery) return;

    setIsSpinning(true);
    try {
      const response = await axios.post(`/api/lotteries/${params.id}/draw`);
      const winningPrize = response.data.prize;
      setResult(winningPrize ? winningPrize.name : t("noPrize"));
      const prizeIndex = lottery.prizes.findIndex(
        (p) => p.id === winningPrize?.id
      );
      setPrizeNumber(prizeIndex !== -1 ? prizeIndex : lottery.prizes.length);
      setMustSpin(true);
    } catch (error) {
      console.error("Error drawing prize:", error);
      toast({
        title: t("drawError"),
        description: t("drawErrorDescription"),
        variant: "destructive",
      });
      setIsSpinning(false);
    }
  };

  const handleSpinStop = () => {
    setIsSpinning(false);
  };

  if (!lottery) {
    return <div>{t("loading")}</div>;
  }

  const data = [
    ...lottery.prizes.map((prize) => ({ option: prize.name })),
    { option: t("noPrize") },
  ];

  return (
    <div className="container mx-auto px-4 py-12 space-y-12 mt-16">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{lottery.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {lottery.isStarted ? (
            <>
              <div className="flex justify-center">
                {typeof window !== "undefined" && (
                  <Wheel
                    mustStartSpinning={mustSpin}
                    prizeNumber={prizeNumber}
                    data={data}
                    onStopSpinning={handleSpinStop}
                  />
                )}
              </div>
              <div className="text-center">
                <Button onClick={startLottery} disabled={isSpinning}>
                  {isSpinning ? t("spinning") : t("startLottery")}
                </Button>
              </div>
              {result && (
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">{t("result")}</h3>
                  <p>{result}</p>
                </div>
              )}
            </>
          ) : (
            <p className="text-center">{t("lotteryNotStarted")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
