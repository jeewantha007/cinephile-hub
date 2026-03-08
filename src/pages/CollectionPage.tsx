import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import SEOHead from "@/components/SEOHead";
import { getCollectionDetails } from "@/lib/tmdb";

const CollectionPage = () => {
  const { id } = useParams<{ id: string }>();
  const collectionId = Number(id);

  const { data: collection, isLoading } = useQuery({
    queryKey: ["collection", collectionId],
    queryFn: () => getCollectionDetails(collectionId),
    enabled: !!collectionId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 container mx-auto px-4 space-y-4">
          <Skeleton className="h-10 w-96" />
          <Skeleton className="h-6 w-full max-w-2xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 text-center">
          <p className="text-muted-foreground">Collection not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${collection.name} – Movie Collection | CinemaHub`}
        description={collection.overview || `Browse all movies in the ${collection.name} collection on CinemaHub.`}
        canonicalPath={`/collection/${collection.id}`}
        ogImage={collection.backdrop_path || undefined}
      />
      <Navbar />

      {/* Backdrop */}
      <div className="relative w-full h-[40vh]">
        <img
          src={collection.backdrop_path || "/placeholder.svg"}
          alt={collection.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-24 relative z-10 pb-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{collection.name}</h1>
        {collection.overview && (
          <p className="text-muted-foreground max-w-2xl mb-8 leading-relaxed">{collection.overview}</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {collection.parts
            .sort((a, b) => (a.release_date || "").localeCompare(b.release_date || ""))
            .map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CollectionPage;
