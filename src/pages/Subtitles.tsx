import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, Download, Globe, Film, Tv } from "lucide-react";
import { Subtitles as SubtitlesIcon, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import SEOContentBlock from "@/components/SEOContentBlock";
import Breadcrumbs from "@/components/Breadcrumbs";
import MovieCard from "@/components/MovieCard";
import { searchMovies, getTrending, type Movie } from "@/lib/tmdb";

const popularLanguages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "pl", name: "Polish", flag: "🇵🇱" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "sv", name: "Swedish", flag: "🇸🇪" },
  { code: "th", name: "Thai", flag: "🇹🇭" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
  { code: "id", name: "Indonesian", flag: "🇮🇩" },
  { code: "ro", name: "Romanian", flag: "🇷🇴" },
  { code: "cs", name: "Czech", flag: "🇨🇿" },
  { code: "hu", name: "Hungarian", flag: "🇭🇺" },
  { code: "el", name: "Greek", flag: "🇬🇷" },
  { code: "fi", name: "Finnish", flag: "🇫🇮" },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Download Movie & TV Show Subtitles Free – CinemaHub",
    description: "Download free SRT subtitles for movies and TV shows in 50+ languages. Search any movie or TV show and get subtitles instantly on CinemaHub.",
    url: "https://cinemahub.space/subtitles",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://cinemahub.space/" },
      { "@type": "ListItem", position: 2, name: "Subtitles", item: "https://cinemahub.space/subtitles" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I download subtitles on CinemaHub?",
        acceptedAnswer: { "@type": "Answer", text: "Search for any movie or TV show on CinemaHub, navigate to its detail page, and scroll to the subtitles section. Select your language and click download to get the SRT file." },
      },
      {
        "@type": "Question",
        name: "What subtitle formats does CinemaHub support?",
        acceptedAnswer: { "@type": "Answer", text: "CinemaHub provides subtitles in SRT format, which is compatible with all major media players including VLC, MPC-HC, PotPlayer, and Kodi." },
      },
      {
        "@type": "Question",
        name: "Are subtitles on CinemaHub free?",
        acceptedAnswer: { "@type": "Answer", text: "Yes, all subtitles on CinemaHub are completely free to download. No registration or payment required." },
      },
      {
        "@type": "Question",
        name: "How many languages are available for subtitles?",
        acceptedAnswer: { "@type": "Answer", text: "CinemaHub offers subtitles in over 50 languages including English, Spanish, French, German, Japanese, Korean, Arabic, Hindi, and many more." },
      },
    ],
  },
];

const SubtitlesPage = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { data: trending = [] } = useQuery({
    queryKey: ["trending"],
    queryFn: getTrending,
  });

  const { data: results = [], isFetching } = useQuery({
    queryKey: ["subtitle-search", query],
    queryFn: () => searchMovies(query),
    enabled: query.trim().length >= 2,
  });

  const showResults = query.trim().length >= 2;
  const moviesToShow = showResults ? results : trending.slice(0, 10);

  const handleMovieClick = (movie: Movie) => {
    const slug = movie.title
      ? `/movie/${movie.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${movie.id}`
      : `/movie/${movie.id}`;
    navigate(slug);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Download Movie Subtitles Free – SRT in 50+ Languages | CinemaHub"
        description="Download free SRT subtitles for movies and TV shows in 50+ languages. English, Spanish, French, Arabic, Korean, Japanese subtitles and more. Compatible with VLC, MPC, PotPlayer."
        canonicalPath="/subtitles"
        jsonLd={jsonLd}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full mb-5">
            <SubtitlesIcon className="h-3.5 w-3.5" />
            Free Subtitle Downloads
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
            Download Movie Subtitles
            <span className="block text-primary">in 50+ Languages</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Search any movie or TV show and download free SRT subtitles instantly. Compatible with VLC, MPC-HC, PotPlayer, Kodi, and all major media players.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movie or TV show for subtitles..."
              className="w-full h-14 pl-12 pr-4 rounded-2xl bg-card text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ring-1 ring-border/50 transition-all shadow-lg shadow-black/10"
            />
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 pb-12 space-y-16">
        <div>
          <Breadcrumbs items={[{ label: "Subtitles" }]} />
        </div>

        {/* Search results / trending */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
            {showResults ? (
              <><Search className="h-5 w-5 text-primary" /> Subtitle results for "{query}"</>
            ) : (
              <><Film className="h-5 w-5 text-primary" /> Popular Movies – Download Subtitles</>
            )}
          </h2>
          {isFetching ? (
            <p className="text-muted-foreground">Searching...</p>
          ) : moviesToShow.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {moviesToShow.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No results found. Try a different search term.</p>
          )}
        </section>

        {/* Language grid */}
        <section>
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-2">Browse by Language</span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Subtitles in 50+ Languages
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Download SRT subtitles in your preferred language. From English and Spanish to Japanese and Arabic — we've got you covered.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
            {popularLanguages.map((lang) => (
              <div
                key={lang.code}
                className="bg-card/60 backdrop-blur-sm rounded-xl p-4 ring-1 ring-border/20 hover:ring-primary/30 hover:bg-card transition-all duration-300 text-center group cursor-default"
              >
                <span className="text-2xl block mb-1.5">{lang.flag}</span>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{lang.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section>
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-2">Simple & Fast</span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">How to Download Subtitles</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Search, step: "1", title: "Search", desc: "Type the name of any movie or TV show in the search bar above." },
              { icon: Languages, step: "2", title: "Choose Language", desc: "Navigate to the movie page and pick your preferred subtitle language from 50+ options." },
              { icon: Download, step: "3", title: "Download SRT", desc: "Click download to get the SRT file. Open it with VLC, MPC-HC, PotPlayer, or any media player." },
            ].map((item) => (
              <div key={item.step} className="relative bg-card/60 backdrop-blur-sm rounded-xl p-6 ring-1 ring-border/20 text-center group hover:ring-primary/30 transition-all duration-300">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {item.step}
                </div>
                <item.icon className="h-8 w-8 text-primary mx-auto mb-3 mt-2" />
                <h3 className="font-semibold text-foreground mb-1.5">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-2">Got Questions?</span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Subtitle FAQs</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: "How do I download subtitles on CinemaHub?", a: "Search for any movie or TV show on CinemaHub, navigate to its detail page, and scroll to the subtitles section. Select your language and click download to get the SRT file." },
              { q: "What subtitle formats does CinemaHub support?", a: "CinemaHub provides subtitles in SRT format, which is compatible with all major media players including VLC, MPC-HC, PotPlayer, and Kodi." },
              { q: "Are subtitles on CinemaHub free?", a: "Yes, all subtitles on CinemaHub are completely free to download. No registration or payment required." },
              { q: "How many languages are available?", a: "CinemaHub offers subtitles in over 50 languages including English, Spanish, French, German, Japanese, Korean, Arabic, Hindi, and many more." },
              { q: "Can I download TV show episode subtitles?", a: "Yes! Navigate to any TV show, select a season and episode, and you'll find subtitles available for individual episodes in multiple languages." },
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
      </main>

      <SEOContentBlock
        title="Download Free Movie Subtitles on CinemaHub"
        paragraphs={[
          "CinemaHub is your go-to platform for downloading free SRT subtitles for movies and TV shows. Whether you're watching the latest blockbuster or a classic film, find subtitles in over 50 languages including English, Spanish, French, German, Japanese, Korean, Arabic, Hindi, Portuguese, and many more.",
          "Our subtitle library covers thousands of movies and TV show episodes, with SRT files that are compatible with all popular media players like VLC Media Player, MPC-HC, PotPlayer, Kodi, Plex, and more. Simply search for your movie, choose your language, and download — no registration required.",
          "Looking for hearing-impaired subtitles (SDH)? CinemaHub also provides accessibility-focused subtitles to ensure everyone can enjoy movies and TV shows without language barriers. Download subtitles for free and enhance your viewing experience today.",
        ]}
      />
      <Footer />
    </div>
  );
};

export default Subtitles;
