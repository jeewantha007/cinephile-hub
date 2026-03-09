import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSubtitlesByImdbId, Subtitle } from "@/lib/opensubtitles";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Subtitles, Search, Globe, FileText, ExternalLink } from "lucide-react";

interface SubtitlesSectionProps {
  imdbId: string;
}

// Language code to full name mapping
const languageNames: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  ar: "Arabic",
  hi: "Hindi",
  tr: "Turkish",
  pl: "Polish",
  nl: "Dutch",
  sv: "Swedish",
  no: "Norwegian",
  da: "Danish",
  fi: "Finnish",
  cs: "Czech",
  el: "Greek",
  he: "Hebrew",
  th: "Thai",
  vi: "Vietnamese",
  id: "Indonesian",
  ms: "Malay",
  ro: "Romanian",
  hu: "Hungarian",
  uk: "Ukrainian",
  bg: "Bulgarian",
  hr: "Croatian",
  sk: "Slovak",
  sl: "Slovenian",
  sr: "Serbian",
  lt: "Lithuanian",
  lv: "Latvian",
  et: "Estonian",
  fa: "Persian",
  bn: "Bengali",
  ta: "Tamil",
  te: "Telugu",
  ml: "Malayalam",
  mr: "Marathi",
  gu: "Gujarati",
  kn: "Kannada",
  pa: "Punjabi",
  ur: "Urdu",
};

const getLanguageName = (code: string): string => {
  return languageNames[code.toLowerCase()] || code.charAt(0).toUpperCase() + code.slice(1);
};

const SubtitlesSection = ({ imdbId }: SubtitlesSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: subtitles, isLoading, isError } = useQuery({
    queryKey: ["subtitles", imdbId],
    queryFn: () => fetchSubtitlesByImdbId(imdbId),
    enabled: !!imdbId,
    staleTime: 1000 * 60 * 30,
  });

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
            <Skeleton key={i} className="h-24 rounded-xl" />
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

  // Group by language, keep best per language
  const byLanguage = new Map<string, Subtitle>();
  for (const sub of subtitles) {
    if (!byLanguage.has(sub.language)) {
      byLanguage.set(sub.language, sub);
    }
  }
  
  const grouped = Array.from(byLanguage.values()).sort((a, b) =>
    getLanguageName(a.language).localeCompare(getLanguageName(b.language))
  );

  // Filter by search
  const filtered = searchQuery
    ? grouped.filter((sub) =>
        getLanguageName(sub.language).toLowerCase().includes(searchQuery.toLowerCase())
      )
    : grouped;

  return (
    <div className="mt-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Subtitles className="h-6 w-6 text-primary" /> Subtitles
          </h2>
          <Badge variant="secondary" className="text-xs">
            {grouped.length} languages
          </Badge>
        </div>
        
        {grouped.length > 6 && (
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
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">
                    {getLanguageName(sub.language)}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px] bg-muted/30 uppercase">
                      {sub.format}
                    </Badge>
                    {sub.releaseName && (
                      <span className="text-xs text-muted-foreground truncate max-w-[120px]" title={sub.releaseName}>
                        {sub.releaseName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <a
              href={sub.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block"
            >
              <Button
                size="sm"
                variant="secondary"
                className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                <Download className="h-4 w-4" />
                Download Subtitle
                <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
              </Button>
            </a>
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

      {grouped.length > 0 && (
        <p className="text-xs text-muted-foreground text-center mt-6">
          Subtitles provided by OpenSubtitles.com
        </p>
      )}
    </div>
  );
};

export default SubtitlesSection;
