import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import UploadZone from "@/components/UploadZone";
import ConversionProgress from "@/components/ConversionProgress";
import ResultsView from "@/components/ResultsView";
import FeaturesSection from "@/components/FeaturesSection";
import { UseCases } from "@/components/UseCases";
import ToolsGrid from "@/components/ToolsGrid";
import RoadmapSection from "@/components/RoadmapSection";
import ComparisonSection from "@/components/ComparisonSection";
import FormatsSection from "@/components/FormatsSection";
import { HeroMockup } from "@/components/HeroMockup";
import Footer from "@/components/Footer";
import { useConversionStore } from "@/lib/conversion-store";
import { Shield, Zap, Brain, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const trustBadges = [
  { icon: Lock, label: "No file storage" },
  { icon: Zap, label: "< 5s conversion" },
  { icon: Brain, label: "AI optimized" },
  { icon: Shield, label: "100% private" },
];

const Index = () => {
  const activeView = useConversionStore((s) => s.activeView);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ── HERO ── */}
      <section id="convert" className="relative overflow-hidden pb-0 pt-24">
        {/* Background orbs */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 15% 50%, hsl(var(--primary) / 0.07), transparent 40%),
              radial-gradient(circle at 85% 30%, hsl(var(--accent) / 0.07), transparent 40%)
            `,
          }}
        />
        <div className="grid-pattern absolute inset-0 opacity-[0.15]" />

        <div className="container relative">
          {/* ── Split Layout ── */}
          <div className="flex flex-col items-center gap-12 pb-16 pt-8 lg:flex-row lg:gap-16 lg:pt-12">
            {/* LEFT — Copy */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/60 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground backdrop-blur-md"
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                Privacy-first conversion engine · Phase 1 MVP
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl font-black leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
              >
                Universal file
                <br />
                conversion.
                <br />
                <span className="gradient-text">Zero quality loss.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground lg:mx-0"
              >
                Convert between 25+ formats with enterprise-grade accuracy.
                No tracking, no logs — just perfect output in seconds.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
              >
                <a href="#upload-zone">
                  <Button
                    size="lg"
                    className="gradient-primary h-13 rounded-xl border-0 px-8 text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Start Converting — Free
                  </Button>
                </a>
                <Link to="/#tools">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-13 rounded-xl border-border/70 px-8 text-base font-bold hover:border-primary/40 hover:bg-primary/5"
                  >
                    Explore PDF Tools
                  </Button>
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-start"
              >
                {trustBadges.map((b) => {
                  const Icon = b.icon;
                  return (
                    <div key={b.label} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Icon className="h-4 w-4 text-primary" />
                      <span>{b.label}</span>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* RIGHT — Animated mockup */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-sm flex-shrink-0 lg:max-w-md"
            >
              <HeroMockup />
            </motion.div>
          </div>

          {/* ── Upload Zone ── */}
          <div id="upload-zone" className="border-t border-border/40 pb-16 pt-12">
            <AnimatePresence mode="wait">
              {activeView === "upload" && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <UploadZone />
                </motion.div>
              )}
              {activeView === "converting" && (
                <motion.div
                  key="converting"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <ConversionProgress />
                </motion.div>
              )}
              {activeView === "results" && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <ResultsView />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <FeaturesSection />
      <ComparisonSection />
      <UseCases />
      <FormatsSection />
      <ToolsGrid />
      <RoadmapSection />
      <Footer />
    </div>
  );
};

export default Index;
