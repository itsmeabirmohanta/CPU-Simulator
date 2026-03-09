import React, { Suspense, lazy, ComponentType } from "react";
import Loader from "@/components/Loader";

/**
 * Lazy load a component with a loading fallback
 */
export function lazyLoadComponent<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  fallbackComponent?: ComponentType<any>
) {
  const LazyComponent = lazy(importFn);
  const Fallback = fallbackComponent || (() => <Loader fullScreen text="Loading component..." />);

  return (props: P) => (
    <Suspense fallback={<Fallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Intersection Observer based lazy loading hook for images and elements
 */
export function useLazyLoad() {
  const ref = React.useRef<HTMLElement | HTMLImageElement | null>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        rootMargin: "100px", // Start loading 100px before element enters viewport
        threshold: 0.01,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return { ref, isVisible };
}

/**
 * Lazy loading image component
 */
export function LazyImage({
  src,
  fallbackSrc,
  alt,
  className = "",
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  fallbackSrc?: string;
}) {
  const { ref, isVisible } = useLazyLoad();
  const [imageError, setImageError] = React.useState(false);

  return (
    <img
      ref={ref as React.Ref<HTMLImageElement>}
      src={
        isVisible
          ? src
          : fallbackSrc ||
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3C/svg%3E"
      }
      alt={alt}
      className={`transition-opacity duration-300 ${className}`}
      onError={() => setImageError(true)}
      {...props}
    />
  );
}

/**
 * Lazy loading div wrapper
 */
export function LazyDiv({
  children,
  className = "",
  fallback,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { ref, isVisible } = useLazyLoad();

  return (
    <div ref={ref as React.Ref<HTMLDivElement>} className={className} {...props}>
      {isVisible ? children : fallback || null}
    </div>
  );
}

/**
 * Network quality detection
 */
export function useNetworkQuality() {
  const [quality, setQuality] = React.useState<"4g" | "3g" | "2g" | "slow-2g">("4g");

  React.useEffect(() => {
    const connection = (navigator as any).connection;
    if (!connection) return;

    const updateQuality = () => {
      setQuality(connection.effectiveType || "4g");
    };

    connection.addEventListener("change", updateQuality);
    updateQuality();

    return () => {
      connection.removeEventListener("change", updateQuality);
    };
  }, []);

  return quality;
}
