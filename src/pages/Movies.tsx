import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import MovieRow from "@/components/MovieRow";
import SEOHead from "@/components/SEOHead";
import SEOContentBlock from "@/components/SEOContentBlock";
import Breadcrumbs from "@/components/Breadcrumbs";
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

  const jsonLd = [{
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Movies – CinemaHub",
    description: "Browse popular, top rated, upcoming, and trending movies on CinemaHub.",
    url: "https://cinemahub.space/movies",
  }, {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://cinemahub.space/" },
      { "@type": "ListItem", position: 2, name: "Movies", item: "https://cinemahub.space/movies" },
    ],
  }];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Movies – Popular, Top Rated & Upcoming Films | CinemaHub"
        description="Browse popular, top rated, upcoming, and trending movies on CinemaHub. Watch trailers, check ratings, read reviews, and download subtitles in 50+ languages."
        canonicalPath="/movies"
        jsonLd={jsonLd}
      />
      <Navbar />
      {trendingLoading ? (
        <Skeleton className="w-full h-[70vh]" />
      ) : (
        heroMovie && <HeroSection movie={heroMovie} />
      )}
      <main className="container mx-auto px-0 md:px-4 space-y-10 py-8">
        <div className="px-4 md:px-0">
          <Breadcrumbs items={[{ label: "Movies" }]} />
        </div>
        {popularLoading ? <RowSkeleton /> : <MovieRow title="🎬 Popular Movies" movies={popular} viewAllHref="/popular" />}
        <MovieRow title="⭐ Top Rated Movies" movies={topRated} viewAllHref="/top-rated" />
        <MovieRow title="🎞️ Upcoming Movies" movies={upcoming} viewAllHref="/upcoming" />
        <MovieRow title="🔥 Trending Movies" movies={trending} viewAllHref="/trending" />
      </main>
      <SEOContentBlock
        title="Discover the Best Movies on CinemaHub"
        paragraphs={[
          "CinemaHub is your ultimate movie discovery platform. Browse thousands of popular, top-rated, and upcoming movies with detailed information including cast, trailers, ratings, and reviews — all powered by the TMDB database.",
          "Whether you're looking for the latest blockbusters, hidden indie gems, or classic films, CinemaHub makes it easy to find your next favorite movie. Download subtitles in over 50 languages for any film and enjoy cinema without language barriers.",
          "Explore movies by genre, language, or trending status. From action and comedy to horror and sci-fi, CinemaHub covers every genre with comprehensive movie data, high-quality posters, and embedded trailers.",
        ]}
      />
      <Footer />
    </div>
  );
};

export default Movies;
