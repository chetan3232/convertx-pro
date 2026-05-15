import { motion } from "framer-motion";
import { Check, X, AlertTriangle } from "lucide-react";

const rows = [
  { feature: "Zero quality loss", us: "yes", them: "no" },
  { feature: "AI layout recovery", us: "yes", them: "no" },
  { feature: "Privacy-first (no retention)", us: "yes", them: "partial" },
  { feature: "Batch conversion + ZIP", us: "yes", them: "partial" },
  { feature: "25+ format support", us: "yes", them: "no" },
  { feature: "OCR → editable DOCX", us: "yes", them: "no" },
  { feature: "Open API access", us: "yes", them: "no" },
  { feature: "No login required", us: "yes", them: "no" },
];

const Cell = ({ val }: { val: "yes" | "no" | "partial" }) => {
  if (val === "yes") return (
    <div className="flex items-center justify-center">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500/10">
        <Check className="h-4 w-4 text-green-500" />
      </span>
    </div>
  );
  if (val === "no") return (
    <div className="flex items-center justify-center">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-destructive/10">
        <X className="h-4 w-4 text-destructive" />
      </span>
    </div>
  );
  return (
    <div className="flex items-center justify-center">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500/10">
        <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
      </span>
    </div>
  );
};

const ComparisonSection = () => (
  <section className="relative overflow-hidden py-24">
    <div className="absolute inset-0 bg-secondary/20" />
    <div className="container relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14 text-center"
      >
        <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Why <span className="gradient-text">ConvertX Pro?</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Most converters strip your formatting and hope you don't notice. We don't.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-border bg-card shadow-xl"
      >
        {/* Table header */}
        <div className="grid grid-cols-3 border-b border-border bg-secondary/50 px-6 py-4">
          <div className="text-sm font-bold text-muted-foreground">Feature</div>
          <div className="text-center text-sm font-bold text-primary">ConvertX Pro</div>
          <div className="text-center text-sm font-bold text-muted-foreground">Others</div>
        </div>

        {/* Rows */}
        {rows.map((row, i) => (
          <motion.div
            key={row.feature}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className={`grid grid-cols-3 items-center px-6 py-4 ${
              i % 2 === 0 ? "" : "bg-secondary/20"
            } border-b border-border/40 last:border-0`}
          >
            <span className="text-sm font-medium text-foreground">{row.feature}</span>
            <Cell val={row.us} />
            <Cell val={row.them} />
          </motion.div>
        ))}

        {/* Footer */}
        <div className="grid grid-cols-3 bg-primary/5 px-6 py-4">
          <div />
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground">
              <Check className="h-3.5 w-3.5" />
              8 / 8
            </span>
          </div>
          <div className="text-center">
            <span className="text-xs font-bold text-muted-foreground">0–2 / 8</span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default ComparisonSection;
