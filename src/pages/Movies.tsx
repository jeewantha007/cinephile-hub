import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import MovieRow from "@/components/MovieRow";
import SEOHead from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import { getPopular, getTopRated, getUpcoming, getTrending } from "@/lib/tmdb";

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

const Movies = () => {
  const { data: trending = [], isLoading: trendingLoading } = useQuery({ queryKey: ["trending"], queryFn: getTrending });
  const { data: popular = [], isLoading: popularLoading } = useQuery({ queryKey: ["popular"], queryFn: getPopular });
  const { data: topRated = [] } = useQuery({ queryKey: ["topRated"], queryFn: getTopRated });
  const { data: upcoming = [] } = useQuery({ queryKey: ["upcoming"], queryFn: getUpcoming });

  const heroMovie = trending[0];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Movies – Popular, Top Rated & Upcoming | CinemaHub"
        description="Browse popular, top rated, upcoming, and trending movies on CinemaHub. Powered by TMDB."
        canonicalPath="/movies"
      />
      <Navbar />
      {trendingLoading ? (
        <Skeleton className="w-full h-[70vh]" />
      ) : (
        heroMovie && <HeroSection movie={heroMovie} />
      )}
      <main className="container mx-auto px-0 md:px-4 space-y-10 py-8">
        {popularLoading ? <RowSkeleton /> : <MovieRow title="🎬 Popular Movies" movies={popular} viewAllHref="/popular" />}
        <MovieRow title="⭐ Top Rated Movies" movies={topRated} viewAllHref="/top-rated" />
        <MovieRow title="🎞️ Upcoming Movies" movies={upcoming} viewAllHref="/upcoming" />
        <MovieRow title="🔥 Trending Movies" movies={trending} viewAllHref="/trending" />
      </main>
      <Footer />
    </div>
  );
};

export default Movies;
