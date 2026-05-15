import { motion } from "framer-motion";
import { Shield, Zap, Eye, Globe } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Sub-5 second conversions for most files. Async processing for larger documents.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    desc: "Files auto-deleted after 1 hour. No-store mode available for sensitive documents.",
  },
  {
    icon: Eye,
    title: "Perfect Fidelity",
    desc: "Layout, tables, fonts, and images preserved with pixel-perfect accuracy.",
  },
  {
    icon: Globe,
    title: "15+ Formats",
    desc: "PDF, DOCX, XLSX, PPTX, HTML, EPUB, Images, JSON, CSV, and more.",
  },
];

const FeaturesSection = () => (
  <section className="relative py-24">
    <div className="grid-pattern absolute inset-0 opacity-30" />
    <div className="container relative">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <div className="gradient-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
              <f.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
