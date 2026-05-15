import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import UploadZone from "@/components/UploadZone";
import ConversionProgress from "@/components/ConversionProgress";
import ResultsView from "@/components/ResultsView";
import FeaturesSection from "@/components/FeaturesSection";
import { UseCases } from "@/components/UseCases";
import ToolsGrid from "@/components/ToolsGrid";
import Footer from "@/components/Footer";
import { useConversionStore } from "@/lib/conversion-store";

const Index = () => {
  const activeView = useConversionStore((s) => s.activeView);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section id="convert" className="relative overflow-hidden pb-16 pt-32">
        <div className="grid-pattern absolute inset-0 opacity-20" />
        <div className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16 text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-secondary/50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground backdrop-blur-md"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              Privacy-centric conversion engine
            </motion.div>
            <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
              Universal file conversion.
              <br />
              <span className="gradient-text">Zero quality loss.</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Convert between 15+ formats with enterprise-grade accuracy. No
              tracking, no logs, just perfect output in seconds.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {activeView === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <UploadZone />
              </motion.div>
            )}
            {activeView === "converting" && (
              <motion.div
                key="converting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ConversionProgress />
              </motion.div>
            )}
            {activeView === "results" && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ResultsView />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <FeaturesSection />
      <UseCases />
      <ToolsGrid />
      <Footer />
    </div>
  );
};

export default Index;
