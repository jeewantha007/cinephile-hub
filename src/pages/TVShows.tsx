import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
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
  const { data: trending = [], isLoading: trendingLoading } = useQuery({ queryKey: ["tv-trending"], queryFn: getTrendingTV });
  const { data: popular = [], isLoading: popularLoading } = useQuery({ queryKey: ["tv-popular"], queryFn: getPopularTV });
  const { data: topRated = [] } = useQuery({ queryKey: ["tv-topRated"], queryFn: getTopRatedTV });
  const { data: onAir = [] } = useQuery({ queryKey: ["tv-onAir"], queryFn: getOnAirTV });

  const heroShow = trending[0];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="TV Shows – Popular, Top Rated & On Air | CinemaHub"
        description="Discover popular, top rated, and currently airing TV shows on CinemaHub. Powered by TMDB."
        canonicalPath="/tv-shows"
      />
      <Navbar />
      {trendingLoading ? (
        <Skeleton className="w-full h-[70vh]" />
      ) : (
        heroShow && <HeroSection movie={heroShow} linkPrefix="/tv" />
      )}
      <main className="container mx-auto px-0 md:px-4 space-y-10 py-8">
        {popularLoading ? <RowSkeleton /> : <MovieRow title="🎬 Popular TV Shows" movies={popular} viewAllHref="/tv-shows/popular" linkPrefix="/tv" />}
        <MovieRow title="⭐ Top Rated TV Shows" movies={topRated} viewAllHref="/tv-shows/top-rated" linkPrefix="/tv" />
        <MovieRow title="📡 On Air TV Shows" movies={onAir} viewAllHref="/tv-shows/on-air" linkPrefix="/tv" />
        <MovieRow title="🔥 Trending TV Shows" movies={trending} viewAllHref="/tv-shows/trending" linkPrefix="/tv" />
      </main>
      <Footer />
    </div>
  );
};

export default TVShows;
