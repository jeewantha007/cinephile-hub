import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieRow from "@/components/MovieRow";
import SEOHead from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import { getAnimationMovies, getAnimationTV } from "@/lib/tmdb";

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

const Animation = () => {
  const { data: movies = [], isLoading: moviesLoading } = useQuery({ queryKey: ["animation-movies"], queryFn: getAnimationMovies });
  const { data: tvShows = [], isLoading: tvLoading } = useQuery({ queryKey: ["animation-tv"], queryFn: getAnimationTV });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Animation – Movies & TV Shows | CinemaHub"
        description="Explore popular animated movies and TV shows on CinemaHub. From anime to family-friendly cartoons."
        canonicalPath="/animation"
      />
      <Navbar />
      <main className="container mx-auto px-0 md:px-4 space-y-10 pt-24 pb-8">
        <h1 className="text-3xl font-bold text-foreground px-4 md:px-0">🎨 Animation</h1>
        {moviesLoading ? <RowSkeleton /> : <MovieRow title="🎬 Popular Animation Movies" movies={movies} />}
        {tvLoading ? <RowSkeleton /> : <MovieRow title="📺 Popular Animation TV Shows" movies={tvShows} linkPrefix="/tv" />}
      </main>
      <Footer />
    </div>
  );
};

export default Animation;
