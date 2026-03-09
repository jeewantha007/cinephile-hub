import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import MovieCard from "@/components/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getMoviesByLanguagePaginated } from "@/lib/tmdb";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "pt", name: "Portuguese", flag: "🇧🇷" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "th", name: "Thai", flag: "🇹🇭" },
];

const Languages = () => {
  const [selectedLang, setSelectedLang] = useState("en");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["language-movies", selectedLang, page],
    queryFn: () => getMoviesByLanguagePaginated(selectedLang, page),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages || 1;

  const selectLang = (code: string) => {
    setSelectedLang(code);
    setPage(1);
  };

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const selectedName = languages.find((l) => l.code === selectedLang)?.name || "";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://cinemahub.space/" },
      { "@type": "ListItem", position: 2, name: "Languages", item: "https://cinemahub.space/languages" },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Movies by Language | CinemaHub"
        description="Browse movies by language on CinemaHub. Find English, Korean, Japanese, Hindi, Spanish movies and more."
        canonicalPath="/languages"
        jsonLd={breadcrumbJsonLd}
      />
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex items-center gap-3 mb-8">
          <Globe className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Movies by Language</h1>
        </div>

        {/* Language selector */}
        <div className="flex flex-wrap gap-2 mb-8">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => selectLang(lang.code)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                selectedLang === lang.code
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "bg-card ring-1 ring-border/30 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <span>{lang.flag}</span>
              {lang.name}
            </button>
          ))}
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            {selectedName} Movies
          </h2>
          {data && (
            <p className="text-sm text-muted-foreground">
              {data.totalResults.toLocaleString()} movies · Page {data.page} of {totalPages}
            </p>
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-[2/3] rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {data?.movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-10 flex-wrap">
            <Button variant="outline" size="icon" className="h-9 w-9" disabled={page <= 1} onClick={() => setPage(1)}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {getPageNumbers().map((p, i) =>
              p === "..." ? (
                <span key={`e${i}`} className="px-2 text-muted-foreground">…</span>
              ) : (
                <Button key={p} variant={p === page ? "default" : "outline"} size="icon" className="h-9 w-9" onClick={() => setPage(p)}>
                  {p}
                </Button>
              )
            )}
            <Button variant="outline" size="icon" className="h-9 w-9" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9" disabled={page >= totalPages} onClick={() => setPage(totalPages)}>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        )}
        {/* SEO Content */}
        <section className="mt-16 mb-8 max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-foreground mb-4">Discover Movies in Any Language</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            CinemaHub lets you explore movies from around the world, organized by language. Browse popular Korean dramas, Japanese anime films, Hindi Bollywood blockbusters, Spanish-language cinema, French art films, and much more.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            With support for 12+ languages including English, Korean, Japanese, Hindi, Spanish, French, German, Chinese, Portuguese, Italian, Turkish, and Thai, CinemaHub is your gateway to international cinema. Each movie includes ratings, trailers, and downloadable subtitles in 50+ languages.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Languages;
