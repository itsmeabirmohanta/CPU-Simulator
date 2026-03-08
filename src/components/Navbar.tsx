import { Link } from "react-router-dom";
import { Cpu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <Cpu className="h-5 w-5 text-primary" />
          <span>CPU Simulator</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/simulator" className="text-muted-foreground hover:text-foreground transition-colors">Simulator</Link>
          <Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors">Help</Link>
          <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
        </div>
      </div>
    </nav>
  );
}
