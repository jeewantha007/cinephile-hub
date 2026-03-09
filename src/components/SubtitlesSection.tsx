import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSubtitlesByImdbId, getSubtitleDownloadLink, Subtitle } from "@/lib/opensubtitles";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Subtitles, Search, Globe, FileText, Loader2, Ear } from "lucide-react";
import { toast } from "sonner";

interface SubtitlesSectionProps {
  imdbId: string;
}

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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Subtitles className="h-6 w-6 text-primary" /> Subtitles
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
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
        <div className="bg-card rounded-xl p-6 ring-1 ring-border/30 text-center">
          <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">No subtitles available for this title.</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Check back later or visit OpenSubtitles directly.
          </p>
        </div>
      </div>
    );
  }

  // Filter by search
  const filtered = searchQuery
    ? subtitles.filter((sub) =>
        sub.languageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.releaseName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : subtitles;

  return (
    <div className="mt-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Subtitles className="h-6 w-6 text-primary" /> Subtitles
          </h2>
          <Badge variant="secondary" className="text-xs">
            {subtitles.length} languages
          </Badge>
        </div>
        
        {subtitles.length > 6 && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search language..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-card"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((sub) => (
          <div
            key={sub.id}
            className="group bg-card rounded-xl p-4 ring-1 ring-border/30 hover:ring-primary/40 hover:bg-primary/5 transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">
                    {sub.languageName}
                  </p>
                  {sub.hearingImpaired && (
                    <span title="Hearing Impaired">
                      <Ear className="h-4 w-4 text-muted-foreground" />
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px] bg-muted/30 uppercase">
                    .{sub.format}
                  </Badge>
                  {sub.releaseName && (
                    <span className="text-xs text-muted-foreground truncate max-w-[140px]" title={sub.releaseName}>
                      {sub.releaseName}
                    </span>
                  )}
                </div>
                {sub.downloadCount > 0 && (
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    {sub.downloadCount.toLocaleString()} downloads
                  </p>
                )}
              </div>
            </div>
            
            <Button
              size="sm"
              variant="secondary"
              className="w-full mt-3 gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              onClick={() => handleDownload(sub)}
              disabled={downloadingId === sub.id}
            >
              {downloadingId === sub.id ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Getting link...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download Subtitle
                </>
              )}
            </Button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && searchQuery && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No subtitles found for "{searchQuery}"
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchQuery("")}
            className="mt-2"
          >
            Clear search
          </Button>
        </div>
      )}

      {subtitles.length > 0 && (
        <p className="text-xs text-muted-foreground text-center mt-6">
          Subtitles provided by OpenSubtitles.com
        </p>
      )}
    </div>
  );
};

export default SubtitlesSection;
