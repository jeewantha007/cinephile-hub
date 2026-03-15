import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Subtitles } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-background">
      <SEOHead canonicalPath="/" jsonLd={homepageJsonLd} />
      <Navbar />
      {trendingLoading ? (
        <Skeleton className="w-full h-[85vh]" />
      ) : (
        trending.length > 0 && <HeroSection movies={trending} />
      )}
      <main className="container mx-auto px-0 md:px-4 space-y-10 py-8">
        {trendingLoading ? <RowSkeleton /> : <MovieRow title="🔥 Trending Movies" movies={trending} viewAllHref="/trending" />}
        {popularLoading ? <RowSkeleton /> : <MovieRow title="🎬 Popular Movies" movies={popular} viewAllHref="/popular" />}
        <MovieRow title="⭐ Top Rated Movies" movies={topRated} viewAllHref="/top-rated" />
        <MovieRow title="🔥 Trending TV Shows" movies={trendingTV} viewAllHref="/tv-shows/trending" linkPrefix="/tv" />
        <MovieRow title="🎬 Popular TV Shows" movies={popularTV} viewAllHref="/tv-shows/popular" linkPrefix="/tv" />

        {/* Subtitles CTA */}
        <Link to="/subtitles" className="block mx-4 md:mx-0">
          <div className="relative bg-card/60 backdrop-blur-sm rounded-2xl ring-1 ring-border/20 hover:ring-primary/30 p-6 md:p-8 flex items-center gap-6 transition-all duration-300 group overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 shrink-0">
              <Subtitles className="h-7 w-7 text-primary" />
            </div>
            <div className="relative z-10">
              <h2 className="text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors">Download Free Subtitles in 50+ Languages</h2>
              <p className="text-sm text-muted-foreground mt-1">Search any movie or TV show and download SRT subtitles instantly. Compatible with VLC, MPC, PotPlayer & more.</p>
            </div>
          </div>
        </Link>
      </main>
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-2">Got Questions?</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Frequently Asked Questions</h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            { q: "What is CinemaHub?", a: "CinemaHub is a free movie discovery platform where you can explore trending movies, watch trailers, read reviews, and browse detailed information about thousands of movies and TV shows." },
            { q: "Can I download subtitles on CinemaHub?", a: "Yes, CinemaHub lets you search and download subtitles in over 50 languages for movies and TV shows, including SRT format subtitles." },
            { q: "Is CinemaHub free to use?", a: "Yes, CinemaHub is completely free. Browse movies, watch trailers, read reviews, and download subtitles without any subscription or payment." },
            { q: "How do I find movies by genre?", a: "Navigate to the Genres page where you can filter movies by Action, Comedy, Drama, Horror, Sci-Fi, Thriller, Romance, and many more categories." },
            { q: "Can I browse movies by language?", a: "Yes, CinemaHub supports browsing movies in 12+ languages including English, Korean, Japanese, Hindi, Spanish, French, German, Chinese, and more." },
          ].map((item, i) => (
            <details key={i} className="group bg-card/60 backdrop-blur-sm rounded-xl ring-1 ring-border/20 hover:ring-primary/30 transition-all duration-300">
              <summary className="flex items-center justify-between cursor-pointer p-5 text-foreground font-medium select-none list-none">
                <span>{item.q}</span>
                <span className="ml-4 shrink-0 text-primary transition-transform duration-300 group-open:rotate-45 text-xl leading-none">+</span>
              </summary>
              <div className="px-5 pb-5 -mt-1">
                <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            </details>
          ))}
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
