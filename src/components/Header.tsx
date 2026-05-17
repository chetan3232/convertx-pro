import { motion } from "framer-motion";
import { Zap, Menu, X, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import { ThemeToggle } from "./ThemeToggle";
import { HistoryDrawer } from "./HistoryDrawer";
import { SettingsPanel } from "./SettingsPanel";
import { AuthModal } from "./AuthModal";
import { Clock, LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const navItems = ["Convert", "Tools", "API", "Pricing"];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

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
            className="h-10 w-auto object-contain"
            onError={(e) => {
              const t = e.currentTarget;
              t.style.display = "none";
              const fallback = t.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = "flex";
            }}
          />
          <div
            className="items-center gap-2.5"
            style={{ display: "none" }}
          >
            <div className="gradient-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">
              Convert<span className="gradient-text">X</span> Pro
            </span>
          </div>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item}
              href={`/#${item.toLowerCase()}`}
              onClick={(e) => {
                if (window.location.pathname === "/") {
                  e.preventDefault();
                  const el = document.getElementById(item.toLowerCase());
                  el?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/history">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground"
            >
              <Clock className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </Link>
          <Link to="/settings">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </Link>
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl bg-secondary/80 px-3 py-1.5 text-xs font-bold text-foreground border border-border/80">
                <User className="h-3.5 w-3.5 text-primary" />
                <span className="max-w-[120px] truncate">{user.user_metadata?.full_name || user.email}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="font-bold text-destructive hover:bg-destructive/5 hover:text-destructive flex items-center gap-1.5"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAuthOpen(true)}
                className="font-medium text-muted-foreground"
              >
                Sign in
              </Button>
              <Button
                size="sm"
                onClick={() => setAuthOpen(true)}
                className="gradient-primary border-0 font-medium text-primary-foreground"
              >
                Get Started
              </Button>
            </>
          )}
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

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
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
            <Link
              to="/history"
              onClick={() => setMobileOpen(false)}
              className="py-2 text-sm text-muted-foreground flex items-center gap-2 border-t border-border/40 pt-3"
            >
              <Clock className="h-4 w-4" /> History
            </Link>
            <Link
              to="/settings"
              onClick={() => setMobileOpen(false)}
              className="py-2 text-sm text-muted-foreground flex items-center gap-2"
            >
              <Settings className="h-4 w-4" /> Settings
            </Link>
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
