import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circle" | "card" | "button" | "avatar";
  count?: number;
}

const skeletonVariants = {
  shimmer: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear" as const,
    },
  },
};

export function Skeleton({ className = "", variant = "text" }: SkeletonProps) {
  const baseClass = "bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 bg-[200%_0] rounded";
  
  const variantClasses = {
    text: "h-4 w-full",
    circle: "h-10 w-10 rounded-full",
    card: "h-40 w-full rounded-lg",
    button: "h-10 w-24 rounded-md",
    avatar: "h-12 w-12 rounded-full",
  };

  return (
    <motion.div
      className={`${baseClass} ${variantClasses[variant]} ${className}`}
      animate={{
        backgroundPosition: ["200% 0", "-200% 0"],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

export function SkeletonText({ count = 3, className = "" }: SkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="text" className={i === count - 1 ? "w-4/5" : ""} />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-lg p-6 space-y-4 ${className}`}>
      <Skeleton variant="card" className="h-40" />
      <SkeletonText count={2} />
      <Skeleton variant="button" />
    </div>
  );
}

export function SkeletonGrid({ count = 3, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default Skeleton;
