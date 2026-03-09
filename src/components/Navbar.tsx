import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cpu-sim-theme");
      if (stored) return stored === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    const handleThemeChange = () => {
      const stored = localStorage.getItem("cpu-sim-theme");
      if (stored) {
        setIsDark(stored === "dark");
      } else {
        setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
      }
    };

    window.addEventListener("storage", handleThemeChange);
    const observer = new MutationObserver(() => handleThemeChange());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      window.removeEventListener("storage", handleThemeChange);
      observer.disconnect();
    };
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/simulator", label: "Simulator" },
    { to: "/learn", label: "Learn" },
    { to: "/about", label: "About" },
  ];

  return (
    <nav className="border-b bg-card/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
          <Link to="/" className="flex items-center group">
            <motion.div
              className="h-24 w-24 rounded-xl flex items-center justify-center shadow-sm overflow-hidden relative"
              transition={{ duration: 0.2 }}
            >
              <img
                src={isDark ? "/logo/NavBarLogoWhite.png" : "/logo/NavBarLogoBlack.png"}
                alt="CPU Simulator Logo"
                className="h-32 w-32 object-contain"
              />
            </motion.div>
          </Link>
        </motion.div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = link.to === "/" ? location.pathname === "/" : location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors duration-200 ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-lg bg-primary/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
          <div className="ml-2 border-l pl-2">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <motion.button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg hover:bg-muted/50 text-foreground"
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="md:hidden border-t bg-card/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      (link.to === "/" ? location.pathname === "/" : location.pathname.startsWith(link.to))
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
