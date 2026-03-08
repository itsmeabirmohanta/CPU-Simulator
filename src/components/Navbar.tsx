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
    <nav className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <Cpu className="h-4.5 w-4.5 text-primary" />
          </div>
          <span>CPU Simulator</span>
        </Link>
        <div className="flex items-center gap-1 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                location.pathname === link.to
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
