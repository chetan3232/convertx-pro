import { motion } from "framer-motion";
import { Zap, Menu, X, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { ThemeToggle } from "./ThemeToggle";
import { HistoryDrawer } from "./HistoryDrawer";
import { SettingsPanel } from "./SettingsPanel";
import { Clock } from "lucide-react";

const navItems = ["Convert", "Tools", "API", "Pricing"];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass fixed left-0 right-0 top-0 z-50"
    >
      <div className="container flex h-16 items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="ConvertX Pro"
            className="h-9 w-auto object-contain"
            onError={(e) => {
              const t = e.currentTarget;
              t.style.display = "none";
              const fallback = t.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = "flex";
            }}
          />
          <div
            className="gradient-primary hidden h-8 w-8 items-center justify-center rounded-lg"
            style={{ display: "none" }}
          >
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">
            Convert<span className="gradient-text">X</span> Pro
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item}
              href={`/#${item.toLowerCase()}`}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setHistoryOpen(true)}
            className="relative text-muted-foreground hover:text-foreground"
          >
            <Clock className="h-[1.2rem] w-[1.2rem]" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSettingsOpen(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-[1.2rem] w-[1.2rem]" />
          </Button>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="font-medium text-muted-foreground"
          >
            Sign in
          </Button>
          <Button
            size="sm"
            className="gradient-primary border-0 font-medium text-primary-foreground"
          >
            Get Started
          </Button>
        </div>

        <button
          className="text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="glass border-t border-border md:hidden"
        >
          <div className="container flex flex-col gap-3 py-4">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="py-2 text-sm text-muted-foreground"
              >
                {item}
              </a>
            ))}
            <Button
              size="sm"
              className="gradient-primary mt-2 w-full border-0 text-primary-foreground"
            >
              Get Started
            </Button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
