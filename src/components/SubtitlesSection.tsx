import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSubtitlesByImdbId, getSubtitleDownloadLink, Subtitle } from "@/lib/opensubtitles";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Subtitles, Search, FileText, Loader2, Ear, ArrowDownToLine, Star } from "lucide-react";
import { toast } from "sonner";

interface SubtitlesSectionProps {
  imdbId: string;
  seasonNumber?: number;
  episodeNumber?: number;
  showName?: string;
}

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

// Force download instead of opening in browser
const forceDownloadFile = async (url: string, filename: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch {
    // Fallback: open in new tab
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const formatDownloads = (count: number): string => {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
};

const SubtitlesSection = ({ imdbId, seasonNumber, episodeNumber, showName }: SubtitlesSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { data: subtitles, isLoading, isError } = useQuery({
    queryKey: ["subtitles", imdbId, seasonNumber, episodeNumber],
    queryFn: () => fetchSubtitlesByImdbId(imdbId, seasonNumber, episodeNumber),
    enabled: !!imdbId,
    staleTime: 1000 * 60 * 30,
  });

  const handleDownload = async (sub: Subtitle) => {
    setDownloadingId(sub.id);
    try {
      const downloadUrl = await getSubtitleDownloadLink(sub.fileId);
      // Build filename with show name, season/episode, and language
      let filename: string;
      if (showName && seasonNumber != null && episodeNumber != null) {
        const s = String(seasonNumber).padStart(2, "0");
        const e = String(episodeNumber).padStart(2, "0");
        const safeName = showName.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");
        filename = `${safeName}_S${s}E${e}_${sub.languageName}.srt`;
      } else {
        const baseName = sub.releaseName || `${sub.languageName}_subtitle`;
        filename = `${baseName.replace(/\.[^.]+$/, "")}.srt`;
      }
      await forceDownloadFile(downloadUrl, filename);
      toast.success(`${sub.languageName} subtitle downloaded!`);
    } catch (error) {
      toast.error("Failed to download. Please try again.");
      console.error("Download error:", error);
    } finally {
      setDownloadingId(null);
    }
  };

  // Loading
  if (isLoading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <Subtitles className="h-5 w-5 text-primary" />
          </div>
          Subtitles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card rounded-2xl p-5 ring-1 ring-border/20">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty / Error
  if (isError || !subtitles || subtitles.length === 0) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <Subtitles className="h-5 w-5 text-primary" />
          </div>
          Subtitles
        </h2>
        <div className="bg-card rounded-2xl p-10 ring-1 ring-border/20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <p className="text-foreground font-semibold">No subtitles available</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
            We couldn't find subtitles for this title. Check back later or visit OpenSubtitles.com
          </p>
        </div>
      </div>
    );
  }

  const filtered = searchQuery
    ? subtitles.filter(
        (sub) =>
          sub.languageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.releaseName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : subtitles;

  return (
    <section className="mt-12" aria-label="Download subtitles">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Subtitles className="h-5 w-5 text-primary" />
            </div>
            Download Subtitles
          </h2>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-medium">
            {subtitles.length} {subtitles.length === 1 ? "Language" : "Languages"}
          </Badge>
        </div>

        {subtitles.length > 5 && (
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search language or release..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 bg-card/80 text-sm rounded-xl border-border/30 focus:ring-primary/30"
            />
          </div>
        )}
      </div>

      {/* Subtitle Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {filtered.map((sub) => {
          const isDownloading = downloadingId === sub.id;

          return (
            <div
              key={sub.id}
              className="group relative bg-card rounded-2xl p-5 ring-1 ring-border/20 hover:ring-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
            >
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="relative">
                {/* Top row: Flag + Language + Format */}
                <div className="flex items-start gap-3 mb-4">
                  {/* Flag container */}
                  <div className="h-12 w-12 rounded-xl bg-muted/50 ring-1 ring-border/20 flex items-center justify-center text-2xl shrink-0 group-hover:ring-primary/30 transition-colors">
                    {getFlag(sub.language)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {sub.languageName}
                      </h3>
                      {sub.hearingImpaired && (
                        <span title="Hearing Impaired" className="text-muted-foreground">
                          <Ear className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                    {sub.releaseName && (
                      <p
                        className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]"
                        title={sub.releaseName}
                      >
                        {sub.releaseName}
                      </p>
                    )}
                  </div>

                  {/* Format badge */}
                  <Badge
                    variant="outline"
                    className="text-[10px] px-2 py-0.5 uppercase bg-muted/40 border-border/30 shrink-0"
                  >
                    .{sub.format}
                  </Badge>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-4 mb-4">
                  {sub.downloadCount > 0 && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <ArrowDownToLine className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">
                        {formatDownloads(sub.downloadCount)}
                      </span>
                    </div>
                  )}
                  {sub.downloadCount > 10000 && (
                    <div className="flex items-center gap-1 text-primary">
                      <Star className="h-3.5 w-3.5 fill-primary" />
                      <span className="text-xs font-medium">Popular</span>
                    </div>
                  )}
                </div>

                {/* Download button */}
                <Button
                  size="sm"
                  onClick={() => handleDownload(sub)}
                  disabled={isDownloading}
                  className="w-full h-10 rounded-xl gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20 hover:border-primary transition-all duration-200 font-medium"
                  variant="ghost"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Preparing download...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download Subtitle
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty search */}
      {filtered.length === 0 && searchQuery && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            No subtitles match "<span className="text-foreground font-medium">{searchQuery}</span>"
          </p>
          <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")} className="mt-3">
            Clear search
          </Button>
        </div>
      )}

      {/* Footer */}
      <p className="text-[11px] text-muted-foreground/40 text-center mt-6">
        Powered by OpenSubtitles.com
      </p>
    </div>
  );
};

export default SubtitlesSection;
