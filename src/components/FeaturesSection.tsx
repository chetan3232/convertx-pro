import { motion } from "framer-motion";
import {
  Shield,
  Zap,
  Brain,
  Globe,
  Lock,
  Timer,
  Layers,
  Cpu,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    badge: "< 5s",
    desc: "Sub-5 second conversions for files under 5MB. Async queue for heavy documents with live progress.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Brain,
    title: "Intelligence Layer",
    badge: "AI",
    desc: "Auto format detection via MIME + content sniffing. Smart suggestions for the best target format per use-case.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Shield,
    title: "Privacy First",
    badge: "Zero Retention",
    desc: "Files auto-deleted after 1 hour. No-store mode processes in memory only. TLS + at-rest encryption.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Globe,
    title: "25+ Formats",
    badge: "PRD v1",
    desc: "PDF, DOCX, XLSX, PPTX, EPUB, MOBI, HTML, Markdown, JSON, XML, CSV, Images — all covered.",
    color: "from-sky-500 to-blue-600",
  },
  {
    icon: Layers,
    title: "Layout Recovery",
    badge: "Lossless Mode",
    desc: "Tables, columns, headers, and fonts preserved pixel-perfectly. Choose Quick or Lossless processing mode.",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: Cpu,
    title: "Multi-Engine",
    badge: "v1 Backend",
    desc: "LibreOffice · Pandoc · Ghostscript · Sharp · Tesseract OCR — best engine selected per format pair.",
    color: "from-indigo-500 to-blue-600",
  },
  {
    icon: Timer,
    title: "Batch Processing",
    badge: "ZIP Out",
    desc: "Upload multiple files, set per-file output formats, and download everything as a single ZIP archive.",
    color: "from-lime-500 to-green-600",
  },
  {
    icon: Lock,
    title: "Virus Scanned",
    badge: "ClamAV",
    desc: "Every uploaded file is scanned before processing. Rate limiting and abuse protection built-in.",
    color: "from-red-500 to-rose-600",
  },
];

const FeaturesSection = () => (
  <section className="relative py-24">
    <div className="grid-pattern absolute inset-0 opacity-20" />
    <div className="container relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center"
      >
        <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Enterprise-grade{" "}
          <span className="gradient-text">intelligence</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Every conversion runs through a multi-engine pipeline designed for
          accuracy, speed, and privacy at scale.
        </p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -4 }}
            className="glass group rounded-2xl p-6 transition-all duration-300 hover:border-primary/20"
          >
            <div className="mb-4 flex items-start justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color}`}
              >
                <f.icon className="h-6 w-6 text-white" />
              </div>
              <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {f.badge}
              </span>
            </div>
            <h3 className="mb-2 text-base font-bold text-foreground">
              {f.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
