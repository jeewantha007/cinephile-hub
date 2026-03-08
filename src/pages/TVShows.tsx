import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieRow from "@/components/MovieRow";
import SEOHead from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import { getTrendingTV, getPopularTV, getTopRatedTV } from "@/lib/tmdb";

const RowSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-48" />
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-[200px] space-y-2">
          <Skeleton className="aspect-[2/3] rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  </div>
);

const TVShows = () => {
  const { data: trending = [], isLoading: trendingLoading } = useQuery({ queryKey: ["tv-trending"], queryFn: getTrendingTV });
  const { data: popular = [], isLoading: popularLoading } = useQuery({ queryKey: ["tv-popular"], queryFn: getPopularTV });
  const { data: topRated = [] } = useQuery({ queryKey: ["tv-topRated"], queryFn: getTopRatedTV });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="TV Shows – Trending, Popular & Top Rated | CinemaHub"
        description="Discover trending, popular, and top rated TV shows on CinemaHub. Browse detailed show information powered by TMDB."
        canonicalPath="/tv-shows"
      />
      <Navbar />
      <main className="container mx-auto px-0 md:px-4 space-y-10 pt-24 pb-8">
        <h1 className="text-3xl font-bold text-foreground px-4 md:px-0">📺 TV Shows</h1>
        {trendingLoading ? <RowSkeleton /> : <MovieRow title="🔥 Trending TV Shows" movies={trending} viewAllHref="/tv-shows/trending" />}
        {popularLoading ? <RowSkeleton /> : <MovieRow title="🎬 Popular TV Shows" movies={popular} viewAllHref="/tv-shows/popular" />}
        <MovieRow title="⭐ Top Rated TV Shows" movies={topRated} viewAllHref="/tv-shows/top-rated" />
      </main>
      <Footer />
    </div>
  );
};

export default TVShows;
