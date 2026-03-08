import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieRow from "@/components/MovieRow";
import SEOHead from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import { getPopularTV, getTopRatedTV, getOnAirTV, getTrendingTV } from "@/lib/tmdb";

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
  const { data: popular = [], isLoading: popularLoading } = useQuery({ queryKey: ["tv-popular"], queryFn: getPopularTV });
  const { data: topRated = [], isLoading: topRatedLoading } = useQuery({ queryKey: ["tv-topRated"], queryFn: getTopRatedTV });
  const { data: onAir = [] } = useQuery({ queryKey: ["tv-onAir"], queryFn: getOnAirTV });
  const { data: trending = [] } = useQuery({ queryKey: ["tv-trending"], queryFn: getTrendingTV });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="TV Shows – Popular, Top Rated & On Air | CinemaHub"
        description="Discover popular, top rated, and currently airing TV shows on CinemaHub. Powered by TMDB."
        canonicalPath="/tv-shows"
      />
      <Navbar />
      <main className="container mx-auto px-0 md:px-4 space-y-10 pt-24 pb-8">
        <h1 className="text-3xl font-bold text-foreground px-4 md:px-0">📺 TV Shows</h1>
        {popularLoading ? <RowSkeleton /> : <MovieRow title="🎬 Popular TV Shows" movies={popular} viewAllHref="/tv-shows/popular" linkPrefix="/tv" />}
        {topRatedLoading ? <RowSkeleton /> : <MovieRow title="⭐ Top Rated TV Shows" movies={topRated} viewAllHref="/tv-shows/top-rated" linkPrefix="/tv" />}
        <MovieRow title="📡 On Air TV Shows" movies={onAir} viewAllHref="/tv-shows/on-air" linkPrefix="/tv" />
        <MovieRow title="🔥 Trending TV Shows" movies={trending} viewAllHref="/tv-shows/trending" linkPrefix="/tv" />
      </main>
      <Footer />
    </div>
  );
};

export default TVShows;
