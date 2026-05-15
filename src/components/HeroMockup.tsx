import { motion } from "framer-motion";
import {
  FileText,
  Image,
  FileSpreadsheet,
  Presentation,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

const conversions = [
  {
    from: { label: "Resume.pdf", icon: FileText, color: "text-red-500", bg: "bg-red-500/10" },
    to:   { label: "Resume.docx", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
    tag: "PDF → DOCX",
  },
  {
    from: { label: "Scan.png", icon: Image, color: "text-purple-500", bg: "bg-purple-500/10" },
    to:   { label: "Searchable.pdf", icon: FileText, color: "text-red-500", bg: "bg-red-500/10" },
    tag: "OCR → PDF",
  },
  {
    from: { label: "Budget.xlsx", icon: FileSpreadsheet, color: "text-green-500", bg: "bg-green-500/10" },
    to:   { label: "Budget.csv", icon: FileSpreadsheet, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    tag: "XLSX → CSV",
  },
  {
    from: { label: "Thesis.docx", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
    to:   { label: "Thesis.epub", icon: BookOpen, color: "text-violet-500", bg: "bg-violet-500/10" },
    tag: "DOCX → EPUB",
  },
  {
    from: { label: "Deck.pptx", icon: Presentation, color: "text-orange-500", bg: "bg-orange-500/10" },
    to:   { label: "Deck.pdf", icon: FileText, color: "text-red-500", bg: "bg-red-500/10" },
    tag: "PPTX → PDF",
  },
];

const stats = [
  { value: "25+", label: "Formats" },
  { value: "< 5s", label: "Per file" },
  { value: "97%", label: "Accuracy" },
];

export const HeroMockup = () => {
  const [active, setActive] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDone(false);
      setTimeout(() => {
        setDone(true);
        setTimeout(() => {
          setActive((a) => (a + 1) % conversions.length);
          setDone(false);
        }, 1400);
      }, 1600);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const c = conversions[active];
  const FromIcon = c.from.icon;
  const ToIcon = c.to.icon;

  return (
    <div className="relative flex flex-col items-center gap-4 lg:items-end">
      {/* Background glow */}
      <div className="pointer-events-none absolute -inset-8 rounded-3xl bg-primary/5 blur-2xl" />

      {/* Main conversion card */}
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-6 shadow-2xl backdrop-blur-xl"
      >
        {/* Header bar */}
        <div className="mb-5 flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-400" />
          <div className="h-3 w-3 rounded-full bg-yellow-400" />
          <div className="h-3 w-3 rounded-full bg-green-400" />
          <div className="ml-auto rounded-full bg-primary/10 px-3 py-0.5 text-[10px] font-bold text-primary">
            {c.tag}
          </div>
        </div>

        {/* File conversion flow */}
        <div className="flex items-center gap-3">
          {/* FROM */}
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${c.from.bg}`}>
            <FromIcon className={`h-7 w-7 ${c.from.color}`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground">{c.from.label}</p>
            <p className="text-xs text-muted-foreground">Source file</p>
          </div>
        </div>

        {/* Arrow + Processing */}
        <div className="my-4 flex items-center gap-3">
          <div className="flex-1 border-t border-dashed border-border" />
          <motion.div
            animate={done ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.4 }}
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
              done ? "bg-green-500" : "gradient-primary"
            }`}
          >
            {done ? (
              <CheckCircle2 className="h-5 w-5 text-white" />
            ) : (
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              >
                <Zap className="h-4 w-4 text-white" />
              </motion.div>
            )}
          </motion.div>
          <div className="flex-1 border-t border-dashed border-border" />
        </div>

        {/* TO */}
        <div className="flex items-center gap-3">
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all ${c.to.bg} ${done ? "ring-2 ring-green-400/40" : ""}`}>
            <ToIcon className={`h-7 w-7 ${c.to.color}`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground">{c.to.label}</p>
            <p className={`text-xs font-medium ${done ? "text-green-500" : "text-muted-foreground"}`}>
              {done ? "✓ Ready to download" : "Converting..."}
            </p>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: done ? 1 : 0 }}
            className="rounded-lg bg-green-500/10 p-2"
          >
            <ArrowRight className="h-4 w-4 text-green-500" />
          </motion.div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="h-full rounded-full gradient-primary"
            initial={{ width: "0%" }}
            animate={{ width: done ? "100%" : "65%" }}
            transition={{ duration: done ? 0.4 : 1.4, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      {/* Format dots */}
      <div className="flex gap-2">
        {conversions.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-6 bg-primary" : "w-1.5 bg-border"
            }`}
          />
        ))}
      </div>

      {/* Floating stat pills */}
      <div className="flex gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border/60 bg-card/70 px-4 py-2 text-center backdrop-blur-sm"
          >
            <p className="text-base font-black text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
