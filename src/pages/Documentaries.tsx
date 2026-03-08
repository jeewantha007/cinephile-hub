import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieRow from "@/components/MovieRow";
import SEOHead from "@/components/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import { getDocumentaryMovies, getDocumentaryTV } from "@/lib/tmdb";

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

const Documentaries = () => {
  const { data: movies = [], isLoading: moviesLoading } = useQuery({ queryKey: ["doc-movies"], queryFn: getDocumentaryMovies });
  const { data: tvShows = [], isLoading: tvLoading } = useQuery({ queryKey: ["doc-tv"], queryFn: getDocumentaryTV });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Documentaries – Movies & TV Shows | CinemaHub"
        description="Discover powerful documentary movies and TV shows on CinemaHub. Real stories, real impact."
        canonicalPath="/documentaries"
      />
      <Navbar />
      <main className="container mx-auto px-0 md:px-4 space-y-10 pt-24 pb-8">
        <h1 className="text-3xl font-bold text-foreground px-4 md:px-0">🎥 Documentaries</h1>
        {moviesLoading ? <RowSkeleton /> : <MovieRow title="🎬 Documentary Movies" movies={movies} />}
        {tvLoading ? <RowSkeleton /> : <MovieRow title="📺 Documentary TV Shows" movies={tvShows} linkPrefix="/tv" />}
      </main>
      <Footer />
    </div>
  );
};

export default Documentaries;
