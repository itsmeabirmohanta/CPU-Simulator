import { motion } from "framer-motion";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
}

const sizeMap = {
  sm: "w-6 h-6",
  md: "w-10 h-10",
  lg: "w-16 h-16",
};

export default function Loader({ size = "md", text, fullScreen = false }: LoaderProps) {
  const containerClass = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm z-50"
    : "flex flex-col items-center justify-center gap-4";

  return (
    <div className={containerClass}>
      <div className="relative">
        {/* Outer spinning ring */}
        <motion.div
          className={`${sizeMap[size]} border-4 border-transparent border-t-purple-600 border-r-purple-500 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner pulsing dot */}
        <motion.div
          className={`${sizeMap[size]} absolute inset-0 border-2 border-purple-300 dark:border-purple-700 rounded-full`}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      {text && (
        <motion.p
          className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-2"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
