import { Link, useLocation } from "react-router-dom";
import { Cpu, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/simulator", label: "Simulator" },
    { to: "/learn", label: "Learn" },
    { to: "/about", label: "About" },
  ];

  return (
    <nav className="border-b bg-card/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Cpu className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-sm leading-none tracking-tight">CPUverse</span>
            <span className="text-[9px] text-muted-foreground leading-none mt-0.5 flex items-center gap-0.5">
              <Sparkles className="h-2 w-2" /> Visual Learning
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                location.pathname === link.to
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
      </div>
    </nav>
  );
}
