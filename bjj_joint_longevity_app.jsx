import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Play, Pause, RotateCcw, Info } from "lucide-react";
import { motion } from "framer-motion";

/* =============================
   PWA SETUP
   =============================
1. public/manifest.json
{
  "name": "BJJ Joint Longevity Rehab",
  "short_name": "BJJ Rehab",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f9fafb",
  "theme_color": "#111827",
  "icons": []
}

2. public/service-worker.js
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("bjj-rehab-cache").then((cache) => {
      return cache.addAll(["/"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
*/

const rehabExercises = [
  {
    name: "Side-Lying External Rotation",
    baseSets: 3,
    reps: "15",
    video: "https://www.youtube.com/embed/6u8QpNmQy_g"
  },
  {
    name: "Prone Trap 3 Raise",
    baseSets: 3,
    reps: "10",
    video: "https://www.youtube.com/embed/0G2_XV7slIg"
  },
  {
    name: "Half-Kneeling Landmine Press",
    baseSets: 3,
    reps: "8/side",
    video: "https://www.youtube.com/embed/8R3dBfG9XwQ"
  },
  {
    name: "Wall Lean Glute Med Isometric",
    baseSets: 3,
    reps: "30s",
    video: "https://www.youtube.com/embed/ydcy3dPf__M"
  },
  {
    name: "Slow Step-Down",
    baseSets: 3,
    reps: "8/side",
    video: "https://www.youtube.com/embed/N3xWfQ2wZ9k"
  }
];

export default function BJJRehabCompanion() {
  const [week, setWeek] = useState(() => Number(localStorage.getItem("rehabWeek")) || 1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [restTime, setRestTime] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [deload, setDeload] = useState(false);
  const [painShoulder, setPainShoulder] = useState(0);
  const [painHip, setPainHip] = useState(0);
  const [notes, setNotes] = useState("");
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem("rehabHistory")) || []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js");
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    }
    if (timeLeft === 0 && isRunning) {
      new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg").play();
      setIsRunning(false);
    }
    return () => clearTimeout(timer);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    localStorage.setItem("rehabWeek", week);
  }, [week]);

  useEffect(() => {
    localStorage.setItem("rehabHistory", JSON.stringify(history));
  }, [history]);

  const progressionMultiplier = week >= 5 ? 1.2 : week >= 3 ? 1.1 : 1;

  const getSets = (baseSets) => {
    if (deload) return Math.max(1, baseSets - 1);
    return Math.round(baseSets * progressionMultiplier);
  };

  const nextSet = () => {
    if (currentSet < getSets(rehabExercises[currentIndex].baseSets)) {
      setCurrentSet(currentSet + 1);
    } else if (currentIndex < rehabExercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentSet(1);
    } else {
      completeSession();
    }
  };

  const completeSession = () => {
    const today = new Date().toLocaleDateString();
    setHistory([...history, { date: today, week, painShoulder, painHip }]);
    setCurrentIndex(0);
    setCurrentSet(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 grid gap-4">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold text-center">
        BJJ Rehab Companion
      </motion.h1>

      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-4 flex justify-between items-center">
          <span>Week {week} of 6</span>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setWeek(Math.max(1, week - 1))}>-</Button>
            <Button size="sm" onClick={() => setWeek(Math.min(6, week + 1))}>+</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-4 grid gap-3 text-center">
          <h2 className="text-lg font-semibold">{rehabExercises[currentIndex].name}</h2>
          <iframe
            className="w-full rounded-xl"
            height="200"
            src={rehabExercises[currentIndex].video}
            title="Exercise demo"
            allowFullScreen
          />
          <p>
            Set {currentSet} of {getSets(rehabExercises[currentIndex].baseSets)} — Reps: {rehabExercises[currentIndex].reps}
          </p>
          <Button className="text-lg py-6" onClick={nextSet}>Complete Set</Button>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-4 text-center grid gap-3">
          <div className="text-4xl font-bold">{timeLeft}s</div>
          <Slider
            defaultValue={[60]}
            min={15}
            max={180}
            step={5}
            onValueChange={(val) => {
              setRestTime(val[0]);
              setTimeLeft(val[0]);
            }}
          />
          <div className="flex justify-center gap-4">
            <Button onClick={() => setIsRunning(true)}><Play size={18} /></Button>
            <Button onClick={() => setIsRunning(false)}><Pause size={18} /></Button>
            <Button onClick={() => { setIsRunning(false); setTimeLeft(restTime); }}><RotateCcw size={18} /></Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-4 grid gap-4">
          <div className="flex justify-between items-center">
            <span>Deload / Flare Mode</span>
            <Switch checked={deload} onCheckedChange={setDeload} />
          </div>

          <div>
            <label>Shoulder Pain (0–10): {painShoulder}</label>
            <Slider defaultValue={[0]} max={10} step={1} onValueChange={(v) => setPainShoulder(v[0])} />
          </div>

          <div>
            <label>Hip Pain (0–10): {painHip}</label>
            <Slider defaultValue={[0]} max={10} step={1} onValueChange={(v) => setPainHip(v[0])} />
          </div>

          <Input
            placeholder="Session notes (rolling intensity, flare triggers, etc.)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-4">
          <h2 className="font-semibold mb-2">Session History</h2>
          {history.map((h, i) => (
            <div key={i} className="text-sm">
              {h.date} — Week {h.week} — Shoulder: {h.painShoulder} — Hip: {h.painHip}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
