import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import UploadZone from "@/components/UploadZone";
import ConversionProgress from "@/components/ConversionProgress";
import ResultsView from "@/components/ResultsView";
import FeaturesSection from "@/components/FeaturesSection";
import ToolsGrid from "@/components/ToolsGrid";
import Footer from "@/components/Footer";
import { useConversionStore } from "@/lib/conversion-store";

const Index = () => {
  const activeView = useConversionStore((s) => s.activeView);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section id="convert" className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary border border-border text-xs text-muted-foreground mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-glow" />
              Privacy-first · Auto-delete after 1 hour
            </motion.div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              Convert any file.
              <br />
              <span className="gradient-text">Perfect output.</span>
            </h1>
            <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto">
              Fast, accurate document conversion across 15+ formats.
              Upload → convert → download in seconds.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {activeView === "upload" && (
              <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <UploadZone />
              </motion.div>
            )}
            {activeView === "converting" && (
              <motion.div key="converting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ConversionProgress />
              </motion.div>
            )}
            {activeView === "results" && (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ResultsView />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <FeaturesSection />
      <ToolsGrid />
      <Footer />
    </div>
  );
};

export default Index;
