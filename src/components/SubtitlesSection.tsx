import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSubtitlesByImdbId, getSubtitleDownloadLink, Subtitle } from "@/lib/opensubtitles";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Subtitles, Search, FileText, Loader2, Ear, TrendingDown } from "lucide-react";
import { toast } from "sonner";

interface SubtitlesSectionProps {
  imdbId: string;
}

// Country flag emoji from language code
const languageFlags: Record<string, string> = {
  en: "🇬🇧", es: "🇪🇸", fr: "🇫🇷", de: "🇩🇪", it: "🇮🇹",
  pt: "🇵🇹", ru: "🇷🇺", ja: "🇯🇵", ko: "🇰🇷", zh: "🇨🇳",
  ar: "🇸🇦", hi: "🇮🇳", tr: "🇹🇷", pl: "🇵🇱", nl: "🇳🇱",
  sv: "🇸🇪", no: "🇳🇴", da: "🇩🇰", fi: "🇫🇮", cs: "🇨🇿",
  el: "🇬🇷", he: "🇮🇱", th: "🇹🇭", vi: "🇻🇳", id: "🇮🇩",
  ms: "🇲🇾", ro: "🇷🇴", hu: "🇭🇺", uk: "🇺🇦", bg: "🇧🇬",
  hr: "🇭🇷", sk: "🇸🇰", sl: "🇸🇮", sr: "🇷🇸", lt: "🇱🇹",
  lv: "🇱🇻", et: "🇪🇪", fa: "🇮🇷", bn: "🇧🇩", ta: "🇮🇳",
  te: "🇮🇳", ml: "🇮🇳", mr: "🇮🇳", gu: "🇮🇳", kn: "🇮🇳",
  pa: "🇮🇳", ur: "🇵🇰", sq: "🇦🇱", mk: "🇲🇰", bs: "🇧🇦",
  ka: "🇬🇪", hy: "🇦🇲", is: "🇮🇸", mt: "🇲🇹", ga: "🇮🇪",
  cy: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", eu: "🇪🇸", gl: "🇪🇸", ca: "🇪🇸",
  af: "🇿🇦", sw: "🇰🇪", tl: "🇵🇭", mn: "🇲🇳", ne: "🇳🇵",
  si: "🇱🇰", km: "🇰🇭", lo: "🇱🇦", my: "🇲🇲",
};

const getFlag = (code: string): string => languageFlags[code.toLowerCase()] || "🌐";

const SubtitlesSection = ({ imdbId }: SubtitlesSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  
  const { data: subtitles, isLoading, isError } = useQuery({
    queryKey: ["subtitles", imdbId],
    queryFn: () => fetchSubtitlesByImdbId(imdbId),
    enabled: !!imdbId,
    staleTime: 1000 * 60 * 30,
  });

  const handleDownload = async (sub: Subtitle) => {
    setDownloadingId(sub.id);
    try {
      const downloadUrl = await getSubtitleDownloadLink(sub.fileId);
      window.open(downloadUrl, "_blank");
      toast.success(`Downloading ${sub.languageName} subtitle`);
    } catch (error) {
      toast.error("Failed to get download link. Please try again.");
      console.error("Download error:", error);
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Subtitles className="h-6 w-6 text-primary" /> Subtitles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[72px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !subtitles || subtitles.length === 0) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Subtitles className="h-6 w-6 text-primary" /> Subtitles
        </h2>
        <div className="bg-card rounded-xl p-8 ring-1 ring-border/30 text-center">
          <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No subtitles available</p>
          <p className="text-sm text-muted-foreground/60 mt-1">
            Try checking OpenSubtitles.com directly
          </p>
        </div>
      </div>
    );
  }

  const filtered = searchQuery
    ? subtitles.filter((sub) =>
        sub.languageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.releaseName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : subtitles;

  return (
    <div className="mt-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Subtitles className="h-6 w-6 text-primary" /> Subtitles
          </h2>
          <span className="text-sm text-muted-foreground bg-muted/50 px-2.5 py-0.5 rounded-full">
            {subtitles.length} {subtitles.length === 1 ? "language" : "languages"}
          </span>
        </div>
        
        {subtitles.length > 5 && (
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter languages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-card text-sm"
            />
          </div>
        )}
      </div>

      {/* Subtitle Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map((sub) => (
          <button
            key={sub.id}
            onClick={() => handleDownload(sub)}
            disabled={downloadingId === sub.id}
            className="group bg-card rounded-xl px-4 py-3 ring-1 ring-border/30 hover:ring-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 text-left disabled:opacity-60 disabled:cursor-wait"
          >
            <div className="flex items-center gap-3">
              {/* Flag */}
              <span className="text-2xl leading-none shrink-0" role="img" aria-label={sub.languageName}>
                {getFlag(sub.language)}
              </span>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    {sub.languageName}
                  </span>
                  {sub.hearingImpaired && (
                    <span title="Hearing Impaired" className="text-muted-foreground">
                      <Ear className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 bg-muted/30 uppercase border-border/50">
                    {sub.format}
                  </Badge>
                  {sub.releaseName && (
                    <span className="text-[11px] text-muted-foreground truncate" title={sub.releaseName}>
                      {sub.releaseName}
                    </span>
                  )}
                </div>
              </div>

              {/* Download indicator */}
              <div className="shrink-0">
                {downloadingId === sub.id ? (
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                ) : (
                  <div className="h-8 w-8 rounded-lg bg-primary/10 group-hover:bg-primary flex items-center justify-center transition-colors">
                    <Download className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                )}
              </div>
            </div>

            {sub.downloadCount > 0 && (
              <div className="flex items-center gap-1 mt-2 ml-10">
                <TrendingDown className="h-3 w-3 text-muted-foreground/50 rotate-180" />
                <span className="text-[10px] text-muted-foreground/60">
                  {sub.downloadCount.toLocaleString()} downloads
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* No results */}
      {filtered.length === 0 && searchQuery && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No match for "{searchQuery}"</p>
          <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")} className="mt-2">
            Clear search
          </Button>
        </div>
      )}

      {/* Attribution */}
      <p className="text-[11px] text-muted-foreground/50 text-center mt-5">
        Powered by OpenSubtitles.com
      </p>
    </div>
  );
};

export default SubtitlesSection;
