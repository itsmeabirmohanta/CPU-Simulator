import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageLoadingWrapperProps {
  isLoading: boolean;
  children: ReactNode;
  loadingComponent?: ReactNode;
}

export default function PageLoadingWrapper({
  isLoading,
  children,
  loadingComponent,
}: PageLoadingWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {isLoading ? loadingComponent : children}
    </motion.div>
  );
}
