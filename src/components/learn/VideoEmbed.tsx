import type { Video } from "@/lib/curriculum";
import { Play } from "lucide-react";
import { useState } from "react";

interface VideoEmbedProps {
  video: Video;
}

export default function VideoEmbed({ video }: VideoEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;

  return (
    <div className="rounded-xl border bg-card/50 overflow-hidden">
      <div className="relative aspect-video bg-muted/30">
        {!loaded ? (
          <button
            onClick={() => setLoaded(true)}
            className="absolute inset-0 group cursor-pointer"
            aria-label={`Play ${video.title}`}
          >
            <img
              src={thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-background/30 group-hover:bg-background/20 transition-colors flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="h-7 w-7 text-primary-foreground ml-1" />
              </div>
            </div>
          </button>
        ) : (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            loading="lazy"
          />
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-display font-semibold text-sm">{video.title}</h4>
          <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
            {video.duration}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{video.channel}</p>
        <p className="text-xs text-muted-foreground/80 mt-1.5">{video.description}</p>
      </div>
    </div>
  );
}
