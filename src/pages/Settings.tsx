import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Zap,
  Shield,
  Layers,
  Bell,
  HardDrive,
  Check,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/lib/settings-store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";

export default function Settings() {
  const {
    mode,
    setMode,
    deleteDelay,
    setDeleteDelay,
    noStore,
    toggleNoStore,
    notifications,
    toggleNotifications,
  } = useSettingsStore();

  const handleSave = () => {
    toast.success("Settings saved successfully!");
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
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-inner">
            <SettingsIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Preferences
            </h1>
            <p className="text-sm font-medium text-muted-foreground">
              Customize your layout conversion and data storage options.
            </p>
          </div>
        </div>

        {/* Setting Card Grid */}
        <div className="space-y-6">
          {/* Conversion Mode */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-border bg-card shadow-xl p-6 md:p-8"
          >
            <div className="mb-5 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">
                Conversion Engine
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {([
                {
                  id: "quick" as const,
                  label: "Quick Mode",
                  desc: "Fast, optimized layout assembly and character extraction.",
                  icon: Zap,
                },
                {
                  id: "lossless" as const,
                  label: "Lossless Mode",
                  desc: "Maximum structural fidelity, pixel-perfect layouts, slower compile time.",
                  icon: Layers,
                },
              ] as const).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex flex-col items-start rounded-2xl border-2 p-5 text-left transition-all hover:scale-[1.01] ${
                    mode === m.id
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                      : "border-border hover:border-border/80 hover:bg-secondary/30"
                  }`}
                >
                  <div className="mb-4 flex w-full items-center justify-between">
                    <div className={`p-2.5 rounded-xl ${mode === m.id ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                      <m.icon className="h-5 w-5" />
                    </div>
                    {mode === m.id && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-foreground">{m.label}</h3>
                  <p className="mt-1.5 text-xs font-medium leading-relaxed text-muted-foreground">
                    {m.desc}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Privacy Controls */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-border bg-card shadow-xl p-6 md:p-8 space-y-6"
          >
            <div className="flex items-center gap-2 border-b border-border/65 pb-4">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">
                Data Storage & Privacy
              </h2>
            </div>
            
            {/* Auto-delete delay selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-bold text-foreground">
                  Auto-delete Processed Files
                </span>
              </div>
              <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                Determine the absolute lifespan of your converted documents in our cloud buckets.
              </p>
              <div className="flex gap-2 max-w-md pt-2">
                {(
                  [
                    { id: "30m" as const, label: "30 min" },
                    { id: "1h" as const, label: "1 hour" },
                    { id: "session" as const, label: "Session end" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setDeleteDelay(opt.id)}
                    className={`flex-1 rounded-xl py-3 text-xs font-bold transition-all hover:scale-[1.01] ${
                      deleteDelay === opt.id
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Memory store option */}
            <div className="flex items-center justify-between rounded-2xl bg-secondary/35 p-5 border border-border/80">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  No-Store / Memory Only Processing
                </h3>
                <p className="mt-1 text-xs font-medium text-muted-foreground leading-relaxed max-w-lg">
                  Strictly process files in fast transient memory without copying to physical disk storage. Max security, slightly slower for large conversions.
                </p>
              </div>
              <button
                onClick={toggleNoStore}
                className={`relative h-7 w-12 rounded-full transition-colors shrink-0 ${
                  noStore ? "bg-primary" : "bg-secondary"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                    noStore ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          </motion.div>

          {/* Alerts & Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-border bg-card shadow-xl p-6 md:p-8"
          >
            <div className="mb-5 flex items-center gap-2 border-b border-border/65 pb-4">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">
                Alerts & Notifications
              </h2>
            </div>
            
            <div className="flex items-center justify-between rounded-2xl bg-secondary/35 p-5 border border-border/80">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Browser Push Notifications
                </h3>
                <p className="mt-1 text-xs font-medium text-muted-foreground leading-relaxed max-w-lg">
                  Receive a system sound and native popup toast whenever a long batch conversion finishes in the background.
                </p>
              </div>
              <button
                onClick={toggleNotifications}
                className={`relative h-7 w-12 rounded-full transition-colors shrink-0 ${
                  notifications ? "bg-primary" : "bg-secondary"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                    notifications ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          </motion.div>

          {/* Action Footer */}
          <div className="pt-4 flex justify-end gap-3">
            <Link to="/">
              <Button variant="outline" className="rounded-xl px-6 h-11 font-bold">
                Cancel
              </Button>
            </Link>
            <Button
              onClick={handleSave}
              className="gradient-primary border-0 rounded-xl px-8 h-11 font-bold text-primary-foreground shadow-lg shadow-primary/10 transition-all hover:scale-[1.01]"
            >
              Save Preferences
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
