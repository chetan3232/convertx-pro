import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Lock,
  Rocket,
  Cpu,
  Globe,
  Users,
} from "lucide-react";

const phases = [
  {
    phase: "Phase 1",
    label: "MVP",
    timeline: "2–3 weeks",
    status: "active",
    icon: Rocket,
    color: "from-sky-500 to-blue-600",
    borderColor: "border-sky-500/40",
    bgColor: "bg-sky-500/5",
    badgeColor: "bg-sky-500/10 text-sky-600",
    items: [
      { done: true,  text: "Core conversions: PDF ↔ DOCX, TXT, XLSX" },
      { done: true,  text: "Batch upload + ZIP download" },
      { done: true,  text: "Basic OCR (image → text)" },
      { done: true,  text: "Premium UI + dark/light mode" },
      { done: true,  text: "Session history + file preview" },
      { done: true,  text: "Conversion mode: Quick vs Lossless" },
    ],
    priority: "Execution Priority: PDF ↔ DOCX · OCR · Batch",
  },
  {
    phase: "Phase 2",
    label: "Scale",
    timeline: "4–6 weeks",
    status: "upcoming",
    icon: Cpu,
    color: "from-violet-500 to-purple-600",
    borderColor: "border-violet-500/30",
    bgColor: "bg-violet-500/5",
    badgeColor: "bg-violet-500/10 text-violet-600",
    items: [
      { done: false, text: "eBook support: EPUB, MOBI, AZW" },
      { done: false, text: "HTML/MD conversions" },
      { done: false, text: "PDF utilities: watermark, annotate, repair" },
      { done: false, text: "Smart format suggestions (AI)" },
      { done: false, text: "Cloud import/export (Drive, Dropbox)" },
      { done: false, text: "Advanced layout recovery + multi-language OCR" },
    ],
    priority: "Risk: Formatting loss → LibreOffice + post-processing heuristics",
  },
  {
    phase: "Phase 3",
    label: "Enterprise",
    timeline: "v2 Roadmap",
    status: "locked",
    icon: Globe,
    color: "from-emerald-500 to-teal-600",
    borderColor: "border-emerald-500/20",
    bgColor: "bg-emerald-500/5",
    badgeColor: "bg-emerald-500/10 text-emerald-600",
    items: [
      { done: false, text: "Public REST API + API keys" },
      { done: false, text: "Async job queue (Redis + BullMQ)" },
      { done: false, text: "Offline WASM-based conversions" },
      { done: false, text: "Team workspace + quotas" },
      { done: false, text: "Enterprise SLA + on-prem option" },
      { done: false, text: "PaddleOCR multi-engine upgrade" },
    ],
    priority: "Risk: Heavy files → Async + chunked uploads",
  },
];

const metrics = [
  { label: "Layout Fidelity", value: "≥ 97%", desc: "Formatting accuracy score" },
  { label: "Time-to-Download", value: "< 5s", desc: "Small files under 5MB" },
  { label: "Error Rate", value: "< 3%", desc: "Target success threshold" },
  { label: "Queue Wait", value: "< 2s", desc: "p50 median wait time" },
];

const RoadmapSection = () => (
  <section id="roadmap" className="relative overflow-hidden py-24">
    <div className="absolute left-0 top-0 -ml-64 -mt-64 h-[600px] w-[600px] rounded-full bg-primary/3 blur-[150px]" />
    <div className="container relative">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center"
      >
        <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Product <span className="gradient-text">Roadmap</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          From a focused MVP to a full-scale enterprise platform — built
          incrementally, shipped continuously.
        </p>
      </motion.div>

      {/* Phase cards */}
      <div className="mb-20 grid gap-6 md:grid-cols-3">
        {phases.map((p, i) => {
          const Icon = p.icon;
          const isLocked = p.status === "locked";
          const isActive = p.status === "active";
          return (
            <motion.div
              key={p.phase}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className={`relative rounded-3xl border-2 p-6 ${p.borderColor} ${p.bgColor}`}
            >
              {/* Status badge */}
              {isActive && (
                <div className="absolute -top-3 left-6 flex items-center gap-1.5 rounded-full bg-sky-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  In Progress
                </div>
              )}
              {isLocked && (
                <div className="absolute -top-3 right-6">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
              )}

              <div className="mb-5 flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${p.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-foreground">{p.phase}</h3>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${p.badgeColor}`}>
                      {p.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{p.timeline}</p>
                </div>
              </div>

              <ul className="mb-5 space-y-2.5">
                {p.items.map((item) => (
                  <li key={item.text} className="flex items-start gap-2.5">
                    {item.done ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
                    ) : (
                      <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
                    )}
                    <span className={`text-sm ${item.done ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="rounded-xl bg-background/60 px-3 py-2">
                <p className="text-[11px] italic text-muted-foreground">{p.priority}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Success Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-4 text-center"
      >
        <div className="mb-2 flex items-center justify-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-bold text-foreground">Success Metrics</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          How we measure quality at every phase
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl p-5 text-center"
          >
            <p className="gradient-text text-3xl font-bold">{m.value}</p>
            <p className="mt-1 text-sm font-bold text-foreground">{m.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{m.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default RoadmapSection;
