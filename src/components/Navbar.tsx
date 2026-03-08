import { Link, useLocation } from "react-router-dom";
import { Cpu } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/simulator", label: "Simulator" },
    { to: "/help", label: "Help" },
    { to: "/about", label: "About" },
  ];

  return (
    <nav className="border-b bg-card/90 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-12 px-4">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-sm">
          <Cpu className="h-4 w-4 text-primary" />
          <span>CPU Sim</span>
        </Link>
        <div className="flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-2.5 py-1 rounded text-[12px] font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="ml-1.5 border-l pl-1.5">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
