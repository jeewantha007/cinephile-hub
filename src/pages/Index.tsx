import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import MovieRow from "@/components/MovieRow";
import SEOHead from "@/components/SEOHead";
import SEOContentBlock from "@/components/SEOContentBlock";
import { Skeleton } from "@/components/ui/skeleton";
import { getTrending, getPopular, getTopRated, getTrendingTV, getPopularTV } from "@/lib/tmdb";

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

const homepageJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CinemaHub",
    url: "https://cinemahub.space",
    description: "Discover trending movies, watch trailers, download subtitles in 50+ languages, and browse detailed movie and TV show information.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://cinemahub.space/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CinemaHub",
    url: "https://cinemahub.space",
    logo: "https://cinemahub.space/og-image.png",
    sameAs: [],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is CinemaHub?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "CinemaHub is a free movie discovery platform where you can explore trending movies, watch trailers, read reviews, and browse detailed information about thousands of movies and TV shows.",
        },
      },
      {
        "@type": "Question",
        name: "Can I download subtitles on CinemaHub?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, CinemaHub lets you search and download subtitles in over 50 languages for movies and TV shows, including SRT format subtitles.",
        },
      },
      {
        "@type": "Question",
        name: "Is CinemaHub free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, CinemaHub is completely free to use. You can browse movies, watch trailers, read reviews, and download subtitles without any subscription or payment.",
        },
      },
      {
        "@type": "Question",
        name: "How do I find movies by genre on CinemaHub?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Navigate to the Genres page where you can filter movies by Action, Comedy, Drama, Horror, Sci-Fi, Thriller, Romance, and many more categories.",
        },
      },
      {
        "@type": "Question",
        name: "Can I browse movies by language?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, CinemaHub supports browsing movies in 12+ languages including English, Korean, Japanese, Hindi, Spanish, French, German, Chinese, and more.",
        },
      },
    ],
  },
];

const Index = () => {
  const { data: trending = [], isLoading: trendingLoading } = useQuery({ queryKey: ["trending"], queryFn: getTrending });
  const { data: popular = [], isLoading: popularLoading } = useQuery({ queryKey: ["popular"], queryFn: getPopular });
  const { data: topRated = [] } = useQuery({ queryKey: ["topRated"], queryFn: getTopRated });
  const { data: trendingTV = [] } = useQuery({ queryKey: ["tv-trending"], queryFn: getTrendingTV });
  const { data: popularTV = [] } = useQuery({ queryKey: ["tv-popular"], queryFn: getPopularTV });

  const heroMovie = trending[0];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead canonicalPath="/" jsonLd={homepageJsonLd} />
      <Navbar />
      {trendingLoading ? (
        <Skeleton className="w-full h-[85vh]" />
      ) : (
        heroMovie && <HeroSection movie={heroMovie} />
      )}
      <main className="container mx-auto px-0 md:px-4 space-y-10 py-8">
        {trendingLoading ? <RowSkeleton /> : <MovieRow title="🔥 Trending Movies" movies={trending} viewAllHref="/trending" />}
        {popularLoading ? <RowSkeleton /> : <MovieRow title="🎬 Popular Movies" movies={popular} viewAllHref="/popular" />}
        <MovieRow title="⭐ Top Rated Movies" movies={topRated} viewAllHref="/top-rated" />
        <MovieRow title="🔥 Trending TV Shows" movies={trendingTV} viewAllHref="/tv-shows/trending" linkPrefix="/tv" />
        <MovieRow title="🎬 Popular TV Shows" movies={popularTV} viewAllHref="/tv-shows/popular" linkPrefix="/tv" />
      </main>

      {/* FAQ Section for SEO */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-foreground mb-8">Frequently Asked Questions</h2>
        <div className="grid gap-6 md:grid-cols-2 max-w-5xl">
          <div className="bg-card rounded-xl p-6 ring-1 ring-border/30">
            <h3 className="font-semibold text-foreground mb-2">What is CinemaHub?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">CinemaHub is a free movie discovery platform where you can explore trending movies, watch trailers, read reviews, and browse detailed information about thousands of movies and TV shows.</p>
          </div>
          <div className="bg-card rounded-xl p-6 ring-1 ring-border/30">
            <h3 className="font-semibold text-foreground mb-2">Can I download subtitles on CinemaHub?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Yes, CinemaHub lets you search and download subtitles in over 50 languages for movies and TV shows, including SRT format subtitles.</p>
          </div>
          <div className="bg-card rounded-xl p-6 ring-1 ring-border/30">
            <h3 className="font-semibold text-foreground mb-2">Is CinemaHub free to use?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Yes, CinemaHub is completely free. Browse movies, watch trailers, read reviews, and download subtitles without any subscription or payment.</p>
          </div>
          <div className="bg-card rounded-xl p-6 ring-1 ring-border/30">
            <h3 className="font-semibold text-foreground mb-2">How do I find movies by genre?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Navigate to the Genres page where you can filter movies by Action, Comedy, Drama, Horror, Sci-Fi, Thriller, Romance, and many more categories.</p>
          </div>
          <div className="bg-card rounded-xl p-6 ring-1 ring-border/30">
            <h3 className="font-semibold text-foreground mb-2">Can I browse movies by language?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Yes, CinemaHub supports browsing movies in 12+ languages including English, Korean, Japanese, Hindi, Spanish, French, German, Chinese, and more.</p>
          </div>
        </div>
      </section>

      <SEOContentBlock
        title="Your Ultimate Movie Discovery Platform"
        paragraphs={[
          "CinemaHub is the go-to destination for movie enthusiasts looking to discover new films, explore trending movies, and find detailed information about their favorite movies and TV shows. Whether you're searching for the latest blockbusters, hidden indie gems, or classic films, CinemaHub has you covered.",
          "Browse movies by genre, language, or popularity. Watch trailers, read community reviews, check ratings, and download subtitles in over 50 languages. From action-packed thrillers to heartwarming dramas, our comprehensive database helps you find exactly what you want to watch next.",
          "Explore top-rated movies, upcoming releases, and trending TV shows all in one place. CinemaHub provides cast information, crew details, watch providers, and similar recommendations to enhance your movie-watching experience.",
        ]}
      />
      <Footer />
    </div>
  );
};

export default Index;
