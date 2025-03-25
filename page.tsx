"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

function calculateCountdown(targetDate: Date) {
  const now = new Date().getTime();
  const distance = targetDate.getTime() - now;
  const total = distance > 0 ? distance : 0;

  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((total % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, total };
}

function getProgressColor(pct: number) {
  if (pct <= 10) return "stroke-red-500";
  if (pct <= 30) return "stroke-yellow-400";
  return "stroke-green-500";
}

export default function CountdownWidget() {
  const [title, setTitle] = useState("My Countdown");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });

  useEffect(() => {
    if (!endDate || !startDate) return;
    const target = new Date(endDate);
    const start = new Date(startDate);

    const updateCountdown = () => {
      const newCountdown = calculateCountdown(target);
      setCountdown(newCountdown);
    };

    updateCountdown();
    const id = setInterval(updateCountdown, 1000);
    return () => clearInterval(id);
  }, [endDate, startDate]);

  const progress = (() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const percent = ((now - start) / (end - start)) * 100;
    return Math.min(Math.max(percent, 0), 100);
  })();

  const strokeColor = getProgressColor(progress);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Card className="w-full max-w-md p-4 flex flex-col items-center gap-4">
        <div className="text-xl font-bold">{title}</div>
        <svg width="120" height="120" className="rotate-[-90deg]">
          <circle cx="60" cy="60" r="50" strokeWidth="10" className="stroke-gray-300 fill-none" />
          <circle
            cx="60"
            cy="60"
            r="50"
            strokeWidth="10"
            className={`fill-none ${strokeColor}`}
            strokeDasharray={314}
            strokeDashoffset={314 - (314 * progress) / 100}
            strokeLinecap="round"
          />
        </svg>
        <div className="text-2xl font-semibold">
          {`${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`}
        </div>
      </Card>
      <Card className="w-full max-w-md p-4 flex flex-col gap-2">
        <Input placeholder="Countdown Title" value={title} onChange={e => setTitle(e.target.value)} />
        <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        <Button onClick={() => {}}>Update</Button>
      </Card>
    </div>
  );
}