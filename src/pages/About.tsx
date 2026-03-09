import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Film, Search, Play, Star, Globe } from "lucide-react";

const features = [
  { icon: Search, title: "Discover Movies", desc: "Browse trending, popular, top-rated, and upcoming movies from around the world." },
  { icon: Play, title: "Watch Trailers", desc: "Preview official trailers directly on the site before deciding what to watch." },
  { icon: Star, title: "Ratings & Reviews", desc: "See community ratings and detailed information for every movie." },
  { icon: Globe, title: "Browse by Genre", desc: "Explore movies by genre with powerful filtering and sorting options." },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is CinemaHub?",
      acceptedAnswer: { "@type": "Answer", text: "CinemaHub is a modern movie discovery platform that helps you explore trending, popular, top-rated, and upcoming movies and TV shows from around the world, powered by the TMDB API." },
    },
    {
      "@type": "Question",
      name: "Is CinemaHub free to use?",
      acceptedAnswer: { "@type": "Answer", text: "Yes, CinemaHub is completely free. You can browse movies, watch trailers, read reviews, and explore actor profiles without any cost." },
    },
    {
      "@type": "Question",
      name: "Where does CinemaHub get its movie data?",
      acceptedAnswer: { "@type": "Answer", text: "All movie data including posters, ratings, overviews, trailers, and cast information is provided by The Movie Database (TMDB), one of the most comprehensive community-driven movie databases." },
    },
    {
      "@type": "Question",
      name: "Can I watch full movies on CinemaHub?",
      acceptedAnswer: { "@type": "Answer", text: "No, CinemaHub is a discovery platform. You can watch trailers and find where to stream movies, but full movies are not hosted on the site." },
    },
  ],
};

const About = () => (
  <div className="min-h-screen bg-background">
    <SEOHead title="About CinemaHub – Movie Discovery Platform" description="Learn about CinemaHub, a free movie and TV show discovery platform powered by the TMDB API. Browse trending movies, watch trailers, and explore actor profiles." canonicalPath="/about" jsonLd={faqJsonLd} />
    <Navbar />
    <main className="container mx-auto px-4 pt-24 pb-12 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">About CinemaHub</h1>

      <section className="space-y-4 mb-10">
        <p className="text-muted-foreground leading-relaxed">
          CinemaHub is a modern movie discovery platform designed to help you explore, discover, and learn about movies from all around the world. Whether you're looking for the latest blockbusters, hidden gems, or timeless classics, CinemaHub makes it easy to find your next favorite film.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          All movie data — including posters, ratings, overviews, trailers, and cast information — is provided by <span className="text-foreground font-medium">The Movie Database (TMDB)</span>, one of the most comprehensive community-driven movie databases available.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-foreground mb-5">What You Can Do</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div key={f.title} className="bg-card rounded-xl p-5 ring-1 ring-border/30 space-y-2">
              <div className="flex items-center gap-2">
                <f.icon className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">{f.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-foreground mb-3">Technology</h2>
        <p className="text-muted-foreground leading-relaxed">
          CinemaHub is built with <span className="text-foreground font-medium">React</span>, <span className="text-foreground font-medium">TailwindCSS</span>, and the <span className="text-foreground font-medium">TMDB API</span>, delivering a fast, responsive, and visually rich browsing experience across all devices.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-foreground mb-3">Our Mission</h2>
        <p className="text-muted-foreground leading-relaxed">
          We believe everyone deserves a simple, beautiful, and ad-free way to explore the world of cinema. CinemaHub is built with passion for movies and a commitment to providing the best discovery experience possible.
        </p>
      </section>

      <div className="bg-card rounded-xl p-5 ring-1 ring-border/30 flex items-start gap-3">
        <Film className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
      </div>
    </main>
    <Footer />
  </div>
);

export default About;
