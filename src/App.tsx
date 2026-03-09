import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense, useEffect } from "react";
import Loader from "@/components/Loader";
import { LoadingProvider } from "@/hooks/useLoading";
import { setupProtectionProtocols } from "@/lib/security";
import Index from "./pages/Index";

// Lazy load pages
const SimulatorPage = lazy(() => import("./pages/SimulatorPage"));
const LearnPage = lazy(() => import("./pages/LearnPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const LearnModulePage = lazy(() => import("./pages/LearnModulePage"));
const SitemapPage = lazy(() => import("./pages/SitemapPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.22, ease: "easeIn" as const },
  },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ minHeight: "100vh" }}
      >
        <Suspense fallback={<Loader fullScreen text="Loading page..." />}>
          <Routes location={location}>
            <Route path="/" element={<Index />} />
            <Route path="/simulator" element={<SimulatorPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/learn/:moduleId" element={<LearnModulePage />} />
            <Route path="/help" element={<LearnPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/sitemap" element={<SitemapPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function AppContent() {
  useEffect(() => {
    // Initialize security and protection protocols
    setupProtectionProtocols();

    // Preload resources
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = "/";
    document.head.appendChild(link);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

const App = () => (
  <LoadingProvider>
    <AppContent />
  </LoadingProvider>
);

export default App;
