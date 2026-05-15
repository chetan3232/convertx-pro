import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Code, Sparkles } from "lucide-react";

const useCases = [
  {
    icon: GraduationCap,
    title: "For Students",
    features: [
      "Handwritten notes to Searchable PDF",
      "Quick PDF to DOCX for editing",
      "Thesis formatting preservation",
    ],
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: Briefcase,
    title: "For Office Professionals",
    features: [
      "Excel to PDF with perfect columns",
      "Batch PPTX conversion",
      "Secure password protection",
    ],
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    icon: Code,
    title: "For Developers",
    features: [
      "JSON to CSV/XML datasets",
      "HTML to high-fidelity PDF",
      "API-ready transformation engine",
    ],
    color: "bg-purple-500/10 text-purple-500",
  },
];

export const UseCases = () => (
  <section className="bg-secondary/30 py-24">
    <div className="container">
      <div className="mb-16 flex flex-col items-center justify-between gap-8 md:flex-row">
        <div className="max-w-xl text-center md:text-left">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Built for <span className="gradient-text">every workflow.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Whether you're finalizing a thesis, preparing a boardroom
            presentation, or managing complex data, we've got the tools.
          </p>
        </div>
        <div className="flex -space-x-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-background bg-secondary"
            >
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
          ))}
          <div className="flex flex-col justify-center pl-6">
            <p className="text-sm font-bold text-foreground">50k+ Users</p>
            <p className="text-xs text-muted-foreground">Trusting ConvertX</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {useCases.map((uc, i) => (
          <motion.div
            key={uc.title}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-3xl p-8 transition-all hover:border-primary/20"
          >
            <div
              className={`h-14 w-14 rounded-2xl ${uc.color} mb-6 flex items-center justify-center`}
            >
              <uc.icon className="h-7 w-7" />
            </div>
            <h3 className="mb-4 text-xl font-bold text-foreground">
              {uc.title}
            </h3>
            <ul className="space-y-3">
              {uc.features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
