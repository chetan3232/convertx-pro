import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock,
  Download,
  Trash2,
  ArrowLeft,
  FileCheck,
  FileText,
  Search,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useConversionStore } from "@/lib/conversion-store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { downloadFile } from "@/lib/pdf-tools-service";
import { toast } from "sonner";

export default function History() {
  const { jobs, removeJob, clearJobs } = useConversionStore();
  const doneJobs = jobs.filter((j) => j.status === "done");
  
  const [searchQuery, setSearchQuery] = useState("");

  const filteredJobs = doneJobs.filter((job) =>
    job.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = (job: any) => {
    if (job.publicUrl) {
      const ext = job.targetFormat || "pdf";
      const outputName = job.fileName.replace(/\.\w+$/, `.${ext}`);
      downloadFile(job.publicUrl, outputName);
      toast.success(`Downloaded: ${job.fileName}`);
    } else {
      toast.error("Download URL not found");
    }
  };

  const handleClearAll = () => {
    clearJobs();
    toast.success("History cleared completely!");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Header />

      <main className="flex-1 py-12 px-4 md:px-8 max-w-4xl mx-auto w-full">
        {/* Back navigation */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Converter
          </Link>
        </div>

        {/* Hero title */}
        <div className="mb-10 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-inner">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-foreground">
                Conversion History
              </h1>
              <p className="text-sm font-medium text-muted-foreground">
                Review, download, and manage your recent document exports.
              </p>
            </div>
          </div>

          {doneJobs.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearAll}
              className="rounded-xl border-destructive/20 text-destructive hover:bg-destructive/5 hover:text-destructive font-bold text-xs px-4 h-9"
            >
              Clear Entire History
            </Button>
          )}
        </div>

        {/* Search Bar */}
        {doneJobs.length > 0 && (
          <div className="relative mb-6">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search files by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-2xl border border-border bg-card pl-10 pr-4 text-sm font-medium transition-all focus:border-primary focus:bg-background focus:outline-none"
            />
          </div>
        )}

        {/* Main List */}
        <div className="space-y-4">
          {doneJobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl border border-border bg-card p-12 text-center shadow-xl"
            >
              <Clock className="mx-auto mb-4 h-16 w-16 text-muted-foreground opacity-15" />
              <h3 className="text-lg font-bold text-foreground">No recent conversions found</h3>
              <p className="mt-1 text-sm font-medium text-muted-foreground leading-relaxed">
                Upload and convert PDFs or documents on our homepage to see them here.
              </p>
              <Link to="/">
                <Button className="gradient-primary border-0 rounded-xl px-6 h-10 mt-6 font-bold text-primary-foreground">
                  Start Converting
                </Button>
              </Link>
            </motion.div>
          ) : filteredJobs.length === 0 ? (
            <div className="py-12 text-center rounded-3xl border border-border bg-card">
              <p className="text-muted-foreground font-semibold">No search results found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredJobs.map((job, idx) => {
                const isDocx = job.targetFormat.toLowerCase() === "docx";
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={job.id}
                    className="group relative flex items-center justify-between rounded-2xl border border-border/80 bg-card p-4 hover:border-primary/30 hover:bg-secondary/15 transition-all shadow-md hover:shadow-lg"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-black text-xs shadow-inner ${
                        isDocx ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" : "bg-primary/10 text-primary border border-primary/20"
                      }`}>
                        {isDocx ? <FileText className="h-6 w-6" /> : <FileCheck className="h-6 w-6" />}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-black text-foreground pr-4">
                          {job.fileName}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="inline-flex items-center gap-1 rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-bold text-muted-foreground border border-border/50 uppercase">
                            {job.targetFormat}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                            <CheckCircle2 className="h-3 w-3" />
                            Success
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 ml-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDownload(job)}
                        className="h-9 w-9 rounded-xl hover:bg-primary/5 hover:border-primary/20 group-hover:scale-105 transition-all"
                        title="Download Document"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          removeJob(job.id);
                          toast.success("Item removed from history");
                        }}
                        className="h-9 w-9 rounded-xl hover:bg-destructive/5 text-muted-foreground hover:text-destructive transition-all"
                        title="Delete record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
