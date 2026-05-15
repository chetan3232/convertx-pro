import { motion } from "framer-motion";
import { useState } from "react";
import {
  Settings,
  X,
  Zap,
  Shield,
  Layers,
  Bell,
  HardDrive,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ConversionMode = "quick" | "lossless";
type DeleteDelay = "1h" | "30m" | "session";

interface SettingsState {
  mode: ConversionMode;
  deleteDelay: DeleteDelay;
  noStore: boolean;
  notifications: boolean;
}

const defaultSettings: SettingsState = {
  mode: "quick",
  deleteDelay: "1h",
  noStore: false,
  notifications: true,
};

export const SettingsPanel = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);

  return (
    <motion.div
      initial={false}
      animate={isOpen ? { opacity: 1, pointerEvents: "auto" } : { opacity: 0, pointerEvents: "none" }}
      className="fixed inset-0 z-[80]"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isOpen ? { opacity: 1 } : { opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      />

      {/* Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={isOpen ? { x: 0 } : { x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className="absolute bottom-0 right-0 top-0 flex w-full max-w-md flex-col border-l border-border bg-card shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-8 overflow-y-auto p-6">
          {/* Conversion Mode */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Conversion Mode
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {([
                {
                  id: "quick" as const,
                  label: "Quick Mode",
                  desc: "Fast, optimized output",
                  icon: Zap,
                },
                {
                  id: "lossless" as const,
                  label: "Lossless Mode",
                  desc: "Max fidelity, slower",
                  icon: Layers,
                },
              ] as const).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSettings((s) => ({ ...s, mode: m.id }))}
                  className={`flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all ${
                    settings.mode === m.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-border/80 hover:bg-secondary/50"
                  }`}
                >
                  <div className="mb-2 flex w-full items-center justify-between">
                    <m.icon
                      className={`h-5 w-5 ${settings.mode === m.id ? "text-primary" : "text-muted-foreground"}`}
                    />
                    {settings.mode === m.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <p className="text-sm font-bold text-foreground">{m.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {m.desc}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* Privacy */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Privacy
              </h3>
            </div>
            <div className="space-y-3">
              {/* Auto-delete */}
              <div className="glass rounded-xl p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      Auto-delete after
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {(
                    [
                      { id: "30m" as const, label: "30 min" },
                      { id: "1h" as const, label: "1 hour" },
                      { id: "session" as const, label: "Session end" },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() =>
                        setSettings((s) => ({ ...s, deleteDelay: opt.id }))
                      }
                      className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                        settings.deleteDelay === opt.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* No-store mode */}
              <div className="glass flex items-center justify-between rounded-xl p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    No-store mode
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Process in memory only (slower)
                  </p>
                </div>
                <button
                  onClick={() =>
                    setSettings((s) => ({ ...s, noStore: !s.noStore }))
                  }
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    settings.noStore ? "bg-primary" : "bg-secondary"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${
                      settings.noStore ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Notifications
              </h3>
            </div>
            <div className="glass flex items-center justify-between rounded-xl p-4">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Conversion complete alerts
                </p>
                <p className="text-xs text-muted-foreground">
                  Browser notification when ready
                </p>
              </div>
              <button
                onClick={() =>
                  setSettings((s) => ({
                    ...s,
                    notifications: !s.notifications,
                  }))
                }
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  settings.notifications ? "bg-primary" : "bg-secondary"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${
                    settings.notifications ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6">
          <Button
            className="gradient-primary w-full border-0 font-bold text-primary-foreground"
            onClick={onClose}
          >
            Save Settings
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};
