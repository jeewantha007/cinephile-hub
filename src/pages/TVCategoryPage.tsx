import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import MovieCard from "@/components/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  getTrendingTVPaginated,
  getPopularTVPaginated,
  getTopRatedTVPaginated,
  getOnAirTVPaginated,
  type PaginatedResult,
} from "@/lib/tmdb";

interface TVCategoryPageProps {
  category: "trending" | "popular" | "top-rated" | "on-air";
}

const config = {
  trending: {
    title: "🔥 Trending TV Shows",
    seoTitle: "Trending TV Shows – CinemaHub",
    seoDesc: "Discover this week's trending TV shows on CinemaHub.",
    fetcher: getTrendingTVPaginated,
  },
  popular: {
    title: "🎬 Popular TV Shows",
    seoTitle: "Popular TV Shows – CinemaHub",
    seoDesc: "Explore the most popular TV shows right now on CinemaHub.",
    fetcher: getPopularTVPaginated,
  },
  "top-rated": {
    title: "⭐ Top Rated TV Shows",
    seoTitle: "Top Rated TV Shows – CinemaHub",
    seoDesc: "Browse the highest rated TV shows of all time on CinemaHub.",
    fetcher: getTopRatedTVPaginated,
  },
  "on-air": {
    title: "📡 On Air TV Shows",
    seoTitle: "On Air TV Shows – CinemaHub",
    seoDesc: "See what TV shows are currently airing on CinemaHub.",
    fetcher: getOnAirTVPaginated,
  },
};

const TVCategoryPage = ({ category }: TVCategoryPageProps) => {
  const [page, setPage] = useState(1);
  const { title, seoTitle, seoDesc, fetcher } = config[category];

  const { data, isLoading } = useQuery({
    queryKey: ["tv", category, page],
    queryFn: () => fetcher(page),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages || 1;

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

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={seoTitle} description={seoDesc} canonicalPath={`/tv-shows/${category}`} />
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {data && (
            <p className="text-sm text-muted-foreground">
              {data.totalResults.toLocaleString()} shows · Page {data.page} of {totalPages}
            </p>
          )}
        </div>

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
            {data?.movies.map((show) => (
              <MovieCard key={show.id} movie={show} linkPrefix="/tv" />
            ))}
          </div>
        )}

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
      </main>
      <Footer />
    </div>
  );
};

export default TVCategoryPage;
