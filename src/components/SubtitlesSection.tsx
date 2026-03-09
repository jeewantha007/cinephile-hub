import { useQuery } from "@tanstack/react-query";
import { fetchSubtitlesByImdbId, Subtitle } from "@/lib/opensubtitles";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Subtitles } from "lucide-react";

interface SubtitlesSectionProps {
  imdbId: string;
}

const SubtitlesSection = ({ imdbId }: SubtitlesSectionProps) => {
  const { data: subtitles, isLoading, isError } = useQuery({
    queryKey: ["subtitles", imdbId],
    queryFn: () => fetchSubtitlesByImdbId(imdbId),
    enabled: !!imdbId,
    staleTime: 1000 * 60 * 30, // cache 30 min
  });

  if (isLoading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Subtitles className="h-5 w-5 text-primary" /> Subtitles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !subtitles || subtitles.length === 0) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Subtitles className="h-5 w-5 text-primary" /> Subtitles
        </h2>
        <p className="text-muted-foreground">No subtitles found for this movie.</p>
      </div>
    );
  }

  // Group by language, keep best per language
  const byLanguage = new Map<string, Subtitle>();
  for (const sub of subtitles) {
    if (!byLanguage.has(sub.language)) {
      byLanguage.set(sub.language, sub);
    }
  }
  const grouped = Array.from(byLanguage.values()).sort((a, b) =>
    a.language.localeCompare(b.language)
  );

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Subtitles className="h-5 w-5 text-primary" /> Subtitles
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {grouped.map((sub) => (
          <div
            key={sub.id}
            className="bg-card rounded-xl px-4 py-3 ring-1 ring-border/30 flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground capitalize">{sub.language}</p>
              {sub.releaseName && (
                <p className="text-xs text-muted-foreground truncate">{sub.releaseName}</p>
              )}
              <Badge variant="outline" className="text-[10px] mt-1 bg-muted/30">
                .{sub.format}
              </Badge>
            </div>
            <a href={sub.downloadUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="secondary" className="shrink-0 gap-1.5">
                <Download className="h-3.5 w-3.5" />
                Download
              </Button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubtitlesSection;
