import { Link, useLocation } from "react-router-dom";
import { Cpu, Sparkles, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/simulator", label: "Simulator" },
    { to: "/learn", label: "Learn" },
    { to: "/about", label: "About" },
  ];

  return (
    <nav className="border-b bg-card/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shadow-sm">
            <Cpu className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-base leading-none tracking-tight">CPU Simulator</span>
            <span className="text-[10px] text-muted-foreground leading-none mt-1 flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5" /> Visual Learning
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                (link.to === "/" ? location.pathname === "/" : location.pathname.startsWith(link.to))
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="ml-2 border-l pl-2">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-muted/50 text-foreground">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-card/95 backdrop-blur-xl px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
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
          ))}
        </div>
      )}
    </nav>
  );
}
