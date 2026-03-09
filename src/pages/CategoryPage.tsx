import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import MovieCard from "@/components/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  getTrendingPaginated,
  getPopularPaginated,
  getTopRatedPaginated,
  getUpcomingPaginated,
  type PaginatedResult,
} from "@/lib/tmdb";

interface CategoryPageProps {
  category: "trending" | "popular" | "top-rated" | "upcoming";
}

const config = {
  trending: {
    title: "🔥 Trending Movies",
    seoTitle: "Trending Movies – CinemaHub",
    seoDesc: "Discover this week's trending movies on CinemaHub. Browse popular picks and find your next favorite film.",
    fetcher: getTrendingPaginated,
  },
  popular: {
    title: "🎬 Popular Movies",
    seoTitle: "Popular Movies – CinemaHub",
    seoDesc: "Explore the most popular movies right now on CinemaHub.",
    fetcher: getPopularPaginated,
  },
  "top-rated": {
    title: "⭐ Top Rated Movies",
    seoTitle: "Top Rated Movies – CinemaHub",
    seoDesc: "Browse the highest rated movies of all time on CinemaHub.",
    fetcher: getTopRatedPaginated,
  },
  upcoming: {
    title: "🎞️ Upcoming Movies",
    seoTitle: "Upcoming Movies – CinemaHub",
    seoDesc: "See what movies are coming soon to theaters on CinemaHub.",
    fetcher: getUpcomingPaginated,
  },
};

const CategoryPage = ({ category }: CategoryPageProps) => {
  const [page, setPage] = useState(1);
  const { title, seoTitle, seoDesc, fetcher } = config[category];

  const { data, isLoading } = useQuery({
    queryKey: [category, page],
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

  const categoryLabels = {
    trending: "Trending",
    popular: "Popular",
    "top-rated": "Top Rated",
    upcoming: "Upcoming",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://cinemahub.space/" },
      { "@type": "ListItem", position: 2, name: "Movies", item: "https://cinemahub.space/movies" },
      { "@type": "ListItem", position: 3, name: categoryLabels[category], item: `https://cinemahub.space/${category}` },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={seoTitle} description={seoDesc} canonicalPath={`/${category}`} jsonLd={breadcrumbJsonLd} />
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <Breadcrumbs items={[{ label: "Movies", href: "/movies" }, { label: categoryLabels[category] }]} />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {data && (
            <p className="text-sm text-muted-foreground">
              {data.totalResults.toLocaleString()} movies · Page {data.page} of {totalPages}
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
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
