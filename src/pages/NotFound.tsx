import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Cpu, Home, BookOpen, Terminal, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative text-center max-w-md"
      >
        {/* Logo */}
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-6 mx-auto">
          <Cpu className="h-8 w-8 text-primary" />
        </div>

        {/* 404 */}
        <div className="font-display font-black text-8xl md:text-9xl leading-none bg-clip-text text-transparent bg-gradient-to-br from-primary to-primary/30 mb-2 select-none">
          404
        </div>

        <h1 className="font-display text-2xl font-bold mb-3">Page Not Found</h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          Looks like this address doesn't exist in memory. The CPU tried to fetch it, but got nothing back.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild size="lg" className="rounded-xl gap-2 w-full sm:w-auto">
            <Link to="/"><Home className="h-4 w-4" /> Back to Home</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl gap-2 w-full sm:w-auto">
            <Link to="/simulator"><Terminal className="h-4 w-4" /> Open Simulator</Link>
          </Button>
        </div>

        {/* Quick links */}
        <div className="mt-8 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <Link to="/learn" className="hover:text-foreground transition-colors flex items-center gap-1">
            <BookOpen className="h-3 w-3" /> Learn
          </Link>
          <span className="text-border">·</span>
          <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
          <span className="text-border">·</span>
          <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
