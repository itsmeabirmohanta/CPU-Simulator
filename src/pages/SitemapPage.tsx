import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Cpu,
  Zap,
  GitBranch,
  Brain,
  Gauge,
  Home,
  HelpCircle,
  Info,
  Play,
  ChevronRight,
  Search,
  Lock,
  Unlock,
  Clock,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { modules } from "@/lib/curriculum";

interface SiteSection {
  title: string;
  route: string;
  icon: React.ReactNode;
  description: string;
  priority: "high" | "medium" | "low";
  category: "main" | "module" | "resource";
  keywords?: string[];
}

export default function SitemapPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "main" | "module" | "resource">("all");

  // Icon renderer helper
  const renderIcon = (IconComponent: LucideIcon | React.ComponentType<{ className?: string }>) => {
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
  };

  // Generate module pages with memoization
  const modulePages: SiteSection[] = useMemo(
    () =>
      modules.map((mod) => ({
        title: `Module ${mod.number}: ${mod.title}`,
        route: `/learn/${mod.id}`,
        icon: renderIcon(mod.icon as LucideIcon),
        description: `${mod.lessons.length} lessons | ${mod.difficulty} | ${mod.description.substring(0, 80)}...`,
        priority: "high" as const,
        category: "module" as const,
        keywords: [mod.id, mod.title.toLowerCase(), mod.difficulty],
      })),
    []
  );

  // Main pages
  const mainPages: SiteSection[] = useMemo(
    () => [
      {
        title: "Home",
        route: "/",
        icon: <Home className="w-5 h-5" />,
        description: "Landing page with project overview and quick start guide",
        priority: "high",
        category: "main",
        keywords: ["landing", "welcome", "introduction"],
      },
      {
        title: "CPU Simulator",
        route: "/simulator",
        icon: <Play className="w-5 h-5" />,
        description: "Interactive 8-bit CPU simulator with beginner and advanced modes",
        priority: "high",
        category: "main",
        keywords: ["simulator", "interactive", "practice"],
      },
      {
        title: "Learning Hub",
        route: "/learn",
        icon: <BookOpen className="w-5 h-5" />,
        description: "Access all 6 modules and 29 lessons organized by difficulty",
        priority: "high",
        category: "main",
        keywords: ["learn", "education", "curriculum", "modules"],
      },
      {
        title: "About",
        route: "/about",
        icon: <Info className="w-5 h-5" />,
        description: "Project information, features, technology stack, and credits",
        priority: "medium",
        category: "main",
        keywords: ["about", "info", "team", "license"],
      },
      {
        title: "Help & Support",
        route: "/help",
        icon: <HelpCircle className="w-5 h-5" />,
        description: "Support and help resources (redirects to learning hub)",
        priority: "medium",
        category: "main",
        keywords: ["help", "support", "faq", "guide"],
      },
    ],
    []
  );

  // All sections combined
  const allSections = useMemo(() => [...mainPages, ...modulePages], [mainPages, modulePages]);

  // Filtered and searched results
  const filteredSections = useMemo(() => {
    return allSections.filter((section) => {
      const matchesFilter = filter === "all" || section.category === filter;
      const matchesSearch =
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.keywords?.some((kw) =>
          kw.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesFilter && matchesSearch;
    });
  }, [searchQuery, filter, allSections]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <Unlock className="w-4 h-4" />;
      case "medium":
        return <Layers className="w-4 h-4" />;
      default:
        return <Lock className="w-4 h-4" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "main":
        return "Main Page";
      case "module":
        return "Learning Module";
      default:
        return "Resource";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <Navbar />

      {/* Hero Section */}
      <div className="px-4 py-12 md:py-20 border-b">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Site Map</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Explore the complete structure of CPU Simulator platform. Find lessons, modules, and
              resources organized by difficulty and topic.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg border">
              <div>
                <div className="text-2xl font-bold text-primary">6</div>
                <div className="text-sm text-muted-foreground">Learning Modules</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">29</div>
                <div className="text-sm text-muted-foreground">Total Lessons</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">5-6h</div>
                <div className="text-sm text-muted-foreground">Learning Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">11</div>
                <div className="text-sm text-muted-foreground">Total Pages</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search modules, lessons, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["all", "main", "module", "resource"] as const).map((cat) => (
                <Button
                  key={cat}
                  variant={filter === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(cat)}
                  className="capitalize"
                >
                  {cat === "all"
                    ? "All"
                    : cat === "main"
                      ? "Main"
                      : cat === "module"
                        ? "Modules"
                        : "Resources"}
                </Button>
              ))}
            </div>
          </div>
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-2">
              Showing {filteredSections.length} results for "{searchQuery}"
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {filteredSections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No pages found matching your search.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setFilter("all");
              }}
              className="mt-4"
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            {/* Main Pages Section */}
            {filteredSections.some((s) => s.category === "main") && (
              <motion.div
                className="mb-12"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                    <Home className="w-6 h-6" />
                    Main Pages
                  </h2>
                  <p className="text-muted-foreground">Core pages of the CPU Simulator platform</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredSections
                    .filter((s) => s.category === "main")
                    .map((section) => (
                      <motion.div key={section.route} variants={itemVariants}>
                        <Card
                          className="p-4 cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all group"
                          onClick={() => navigate(section.route)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                {section.icon}
                              </div>
                              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                {section.title}
                              </h3>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{section.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">{getCategoryBadge(section.category)}</Badge>
                            <span className="text-xs font-mono text-muted-foreground">{section.route}</span>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* Learning Modules Section */}
            {filteredSections.some((s) => s.category === "module") && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                    <BookOpen className="w-6 h-6" />
                    Learning Modules
                  </h2>
                  <p className="text-muted-foreground">
                    Progressive curriculum organized by difficulty level
                  </p>
                </div>

                <div className="space-y-3">
                  {filteredSections
                    .filter((s) => s.category === "module")
                    .map((section) => {
                      const module = modules.find((m) => `/learn/${m.id}` === section.route);
                      return (
                        <motion.div key={section.route} variants={itemVariants}>
                          <div
                            className="p-4 border rounded-lg hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
                            onClick={() => navigate(section.route)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                    {module?.number}
                                  </div>
                                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                    {section.title}
                                  </h3>
                                </div>
                                <p className="text-sm text-muted-foreground ml-11">{section.description}</p>
                              </div>
                              <div className="flex flex-col items-end gap-2 ml-4">
                                <Badge
                                  className={
                                    module?.difficulty === "beginner"
                                      ? getDifficultyColor("beginner")
                                      : module?.difficulty === "intermediate"
                                        ? getDifficultyColor("intermediate")
                                        : getDifficultyColor("advanced")
                                  }
                                >
                                  {module?.difficulty}
                                </Badge>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  {module?.lessons.length} lessons
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Learning Paths Section */}
      {filter === "all" && searchQuery === "" && (
        <div className="bg-muted/30 border-t py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6" />
              Recommended Learning Paths
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Complete Beginner",
                  time: "3-4 hours",
                  description: "Start from scratch and learn fundamentals",
                  icon: <BookOpen className="w-5 h-5" />,
                },
                {
                  title: "Hands-On Learner",
                  time: "4-5 hours",
                  description: "Interactive focus with simulator practice",
                  icon: <Play className="w-5 h-5" />,
                },
                {
                  title: "Deep Dive",
                  time: "5-6 hours",
                  description: "Complete curriculum with advanced topics",
                  icon: <Brain className="w-5 h-5" />,
                },
                {
                  title: "Quick Reference",
                  time: "1-2 hours",
                  description: "Fast refresher on core concepts",
                  icon: <Gauge className="w-5 h-5" />,
                },
              ].map((path, idx) => (
                <Card key={idx} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    {path.icon}
                  </div>
                  <h3 className="font-semibold mb-1">{path.title}</h3>
                  <p className="text-xs text-primary font-medium mb-2">{path.time}</p>
                  <p className="text-sm text-muted-foreground">{path.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="border-t bg-muted/20 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Last updated: March 9, 2026 •{" "}
            <span className="font-medium">
              Total: {mainPages.length} main pages + {modulePages.length} learning modules
            </span>
          </p>
          <div className="mt-4 flex justify-center gap-4 flex-wrap">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              Home
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/simulator")}>
              Simulator
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/learn")}>
              Learn
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/about")}>
              About
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
