import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import VideoEmbed from "@/components/learn/VideoEmbed";
import LessonCard from "@/components/learn/LessonCard";
import ProgressTracker, {
  getModuleProgress,
  markLessonComplete,
  resetModuleProgress,
} from "@/components/learn/LessonProgress";
import { modules, getModuleById, difficultyConfig } from "@/lib/curriculum";
import { useState, useCallback } from "react";

export default function LearnModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const module = getModuleById(moduleId || "");

  const [completed, setCompleted] = useState<string[]>(() =>
    getModuleProgress(moduleId || "")
  );

  const handleComplete = useCallback(
    (lessonId: string) => {
      if (!moduleId) return;
      markLessonComplete(moduleId, lessonId);
      setCompleted(getModuleProgress(moduleId));
    },
    [moduleId]
  );

  const handleReset = useCallback(() => {
    if (!moduleId) return;
    resetModuleProgress(moduleId);
    setCompleted([]);
  }, [moduleId]);

  if (!module) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Module Not Found</h1>
          <Button asChild>
            <Link to="/learn">Back to Curriculum</Link>
          </Button>
        </div>
      </div>
    );
  }

  const dc = difficultyConfig[module.difficulty];
  const Icon = module.icon;
  const currentIndex = modules.findIndex((m) => m.id === module.id);
  const prevModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const nextModule = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;
  const allComplete = completed.length === module.lessons.length && module.lessons.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-accent/4 to-background" />
        <div className="relative container mx-auto px-4 py-10 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Link
              to="/learn"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="h-3 w-3" /> Back to Curriculum
            </Link>

            <div className="flex items-start gap-4">
              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${
                allComplete ? "bg-accent/15" : "bg-primary/10"
              }`}>
                {allComplete ? (
                  <CheckCircle2 className="h-7 w-7 text-accent" />
                ) : (
                  <Icon className="h-7 w-7 text-primary" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    Module {module.number}
                  </span>
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${dc.color}`}>
                    {module.difficulty}
                  </Badge>
                  {allComplete && (
                    <Badge className="text-[10px] px-1.5 py-0 bg-accent/15 text-accent border-accent/20">
                      ✓ Complete
                    </Badge>
                  )}
                </div>
                <h1 className="font-display text-2xl md:text-3xl font-bold">{module.title}</h1>
                <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{module.description}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-10 max-w-4xl space-y-10">
        {/* Progress */}
        <ProgressTracker
          totalLessons={module.lessons.length}
          completedCount={completed.length}
          onReset={handleReset}
          label={`Module ${module.number} Progress`}
        />

        {/* Videos */}
        {module.videos.length > 0 && (
          <section>
            <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> Watch & Learn
            </h2>
            <div className={`grid gap-4 ${module.videos.length > 1 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 max-w-2xl"}`}>
              {module.videos.map((video) => (
                <VideoEmbed key={video.youtubeId} video={video} />
              ))}
            </div>
          </section>
        )}

        {/* Lessons */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4">
            Lessons ({completed.length}/{module.lessons.length})
          </h2>
          <div className="space-y-3">
            {module.lessons.map((lesson, i) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                index={i}
                isCompleted={completed.includes(lesson.id)}
                onComplete={handleComplete}
              />
            ))}
          </div>
        </section>

        {/* Module Navigation */}
        <nav className="flex items-center justify-between pt-6 border-t">
          {prevModule ? (
            <Link
              to={`/learn/${prevModule.id}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <div>
                <div className="text-[10px] uppercase tracking-wider">Previous</div>
                <div className="font-medium text-foreground">{prevModule.title}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextModule ? (
            <Link
              to={`/learn/${nextModule.id}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors text-right"
            >
              <div>
                <div className="text-[10px] uppercase tracking-wider">Next</div>
                <div className="font-medium text-foreground">{nextModule.title}</div>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </div>
    </div>
  );
}
