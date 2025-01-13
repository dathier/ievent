"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeModalProps {
  url: string;
}

export default function QRCodeModal({ url }: QRCodeModalProps) {
  const [open, setOpen] = useState(false);
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    // Check if the current URL is the same as the QR code URL
    setShowButton(window.location.href !== url);
  }, [url]);

  if (!showButton) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>分享二维码</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>活动分享</DialogTitle>
          <DialogDescription>扫描下方二维码以分享此活动链接</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <QRCodeSVG value={url} size={200} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
