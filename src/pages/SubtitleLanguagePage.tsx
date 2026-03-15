import { useParams, Navigate, Link } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Download, Film, ArrowLeft, Subtitles as SubtitlesIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import SEOContentBlock from "@/components/SEOContentBlock";
import Breadcrumbs from "@/components/Breadcrumbs";
import MovieCard from "@/components/MovieCard";
import { searchMovies, getTrending, type Movie } from "@/lib/tmdb";

const languageData: Record<string, { code: string; name: string; flag: string; native: string }> = {
  english:    { code: "en", name: "English",    flag: "🇬🇧", native: "English" },
  spanish:    { code: "es", name: "Spanish",    flag: "🇪🇸", native: "Español" },
  french:     { code: "fr", name: "French",     flag: "🇫🇷", native: "Français" },
  german:     { code: "de", name: "German",     flag: "🇩🇪", native: "Deutsch" },
  italian:    { code: "it", name: "Italian",    flag: "🇮🇹", native: "Italiano" },
  portuguese: { code: "pt", name: "Portuguese", flag: "🇵🇹", native: "Português" },
  russian:    { code: "ru", name: "Russian",    flag: "🇷🇺", native: "Русский" },
  japanese:   { code: "ja", name: "Japanese",   flag: "🇯🇵", native: "日本語" },
  korean:     { code: "ko", name: "Korean",     flag: "🇰🇷", native: "한국어" },
  chinese:    { code: "zh", name: "Chinese",    flag: "🇨🇳", native: "中文" },
  arabic:     { code: "ar", name: "Arabic",     flag: "🇸🇦", native: "العربية" },
  hindi:      { code: "hi", name: "Hindi",      flag: "🇮🇳", native: "हिन्दी" },
  turkish:    { code: "tr", name: "Turkish",    flag: "🇹🇷", native: "Türkçe" },
  polish:     { code: "pl", name: "Polish",     flag: "🇵🇱", native: "Polski" },
  dutch:      { code: "nl", name: "Dutch",      flag: "🇳🇱", native: "Nederlands" },
  swedish:    { code: "sv", name: "Swedish",    flag: "🇸🇪", native: "Svenska" },
  thai:       { code: "th", name: "Thai",       flag: "🇹🇭", native: "ไทย" },
  vietnamese: { code: "vi", name: "Vietnamese", flag: "🇻🇳", native: "Tiếng Việt" },
  indonesian: { code: "id", name: "Indonesian", flag: "🇮🇩", native: "Bahasa Indonesia" },
  romanian:   { code: "ro", name: "Romanian",   flag: "🇷🇴", native: "Română" },
  czech:      { code: "cs", name: "Czech",      flag: "🇨🇿", native: "Čeština" },
  hungarian:  { code: "hu", name: "Hungarian",  flag: "🇭🇺", native: "Magyar" },
  greek:      { code: "el", name: "Greek",      flag: "🇬🇷", native: "Ελληνικά" },
  finnish:    { code: "fi", name: "Finnish",    flag: "🇫🇮", native: "Suomi" },
};

export const supportedSubtitleLanguages = Object.keys(languageData);

const SubtitleLanguagePage = () => {
  const { language } = useParams<{ language: string }>();
  const [query, setQuery] = useState("");

  const lang = language ? languageData[language.toLowerCase()] : undefined;

  const { data: trending = [] } = useQuery({
    queryKey: ["trending"],
    queryFn: getTrending,
  });

  const { data: results = [], isFetching } = useQuery({
    queryKey: ["subtitle-lang-search", query],
    queryFn: () => searchMovies(query),
    enabled: query.trim().length >= 2,
  });

  if (!lang) return <Navigate to="/subtitles" replace />;

  const showResults = query.trim().length >= 2;
  const moviesToShow = showResults ? results : trending.slice(0, 10);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `Download ${lang.name} Subtitles Free – SRT Files | CinemaHub`,
      description: `Download free ${lang.name} subtitles (SRT) for any movie or TV show. Compatible with VLC, MPC-HC, PotPlayer, and all major media players.`,
      url: `https://cinemahub.space/subtitles/${language}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://cinemahub.space/" },
        { "@type": "ListItem", position: 2, name: "Subtitles", item: "https://cinemahub.space/subtitles" },
        { "@type": "ListItem", position: 3, name: `${lang.name} Subtitles`, item: `https://cinemahub.space/subtitles/${language}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `How do I download ${lang.name} subtitles?`,
          acceptedAnswer: { "@type": "Answer", text: `Search for any movie or TV show on CinemaHub, go to its detail page, and download ${lang.name} subtitles in SRT format from the subtitles section.` },
        },
        {
          "@type": "Question",
          name: `Are ${lang.name} subtitles free on CinemaHub?`,
          acceptedAnswer: { "@type": "Answer", text: `Yes, all ${lang.name} subtitles on CinemaHub are completely free. No registration required.` },
        },
        {
          "@type": "Question",
          name: `What format are ${lang.name} subtitles in?`,
          acceptedAnswer: { "@type": "Answer", text: `${lang.name} subtitles are provided in SRT format, compatible with VLC, MPC-HC, PotPlayer, Kodi, Plex, and all major media players.` },
        },
      ],
    },
  ];

  // Other languages for cross-linking
  const otherLanguages = Object.entries(languageData)
    .filter(([key]) => key !== language?.toLowerCase())
    .slice(0, 12);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`Download ${lang.name} Subtitles Free – SRT for Movies & TV | CinemaHub`}
        description={`Download free ${lang.name} (${lang.native}) subtitles in SRT format for movies and TV shows. Compatible with VLC, MPC, PotPlayer. Search any movie and get ${lang.name} subtitles instantly.`}
        canonicalPath={`/subtitles/${language}`}
        jsonLd={jsonLd}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-14 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/subtitles" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors">
            <ArrowLeft className="h-4 w-4" /> All Subtitles
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{lang.flag}</span>
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-2">
                <SubtitlesIcon className="h-3.5 w-3.5" />
                Free {lang.name} Subtitles
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Download {lang.name} Subtitles
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mb-8 leading-relaxed">
            Download free {lang.name} ({lang.native}) SRT subtitles for any movie or TV show. Compatible with VLC, MPC-HC, PotPlayer, and all media players.
          </p>

          {/* Search */}
          <div className="max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search for ${lang.name} subtitles...`}
              className="w-full h-13 pl-12 pr-4 rounded-2xl bg-card text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ring-1 ring-border/50 transition-all shadow-lg shadow-black/10"
            />
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 pb-12 space-y-14">
        <div>
          <Breadcrumbs items={[{ label: "Subtitles", href: "/subtitles" }, { label: `${lang.name} Subtitles` }]} />
        </div>

        {/* Movies grid */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
            {showResults ? (
              <><Search className="h-5 w-5 text-primary" /> {lang.name} subtitles for "{query}"</>
            ) : (
              <><Film className="h-5 w-5 text-primary" /> Popular Movies – Download {lang.name} Subtitles</>
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

        {/* How to download */}
        <section className="bg-card/60 backdrop-blur-sm rounded-2xl ring-1 ring-border/20 p-6 md:p-8">
          <h2 className="text-xl font-bold text-foreground mb-4">How to Download {lang.name} Subtitles</h2>
          <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside leading-relaxed">
            <li>Search for a movie or TV show above, or browse the popular titles listed on this page.</li>
            <li>Click on a movie to go to its detail page on CinemaHub.</li>
            <li>Scroll to the <strong className="text-foreground">Download Subtitles</strong> section and find <strong className="text-foreground">{lang.name}</strong> in the language list.</li>
            <li>Click the download button to get the SRT file. Open it with VLC, MPC-HC, PotPlayer, or any media player.</li>
          </ol>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-5">{lang.name} Subtitles FAQ</h2>
          <div className="space-y-3">
            {[
              { q: `How do I download ${lang.name} subtitles on CinemaHub?`, a: `Search for any movie or TV show, navigate to its detail page, and scroll to the subtitles section. Select ${lang.name} and click download to get the SRT file.` },
              { q: `Are ${lang.name} subtitles free?`, a: `Yes, all ${lang.name} subtitles on CinemaHub are completely free. No registration or payment required.` },
              { q: `What players support ${lang.name} SRT subtitles?`, a: `SRT files work with all major media players including VLC Media Player, MPC-HC, PotPlayer, Kodi, Plex, and most smart TV apps.` },
              { q: `Can I download ${lang.name} subtitles for TV show episodes?`, a: `Yes! Navigate to any TV show, select a season and episode, and download ${lang.name} subtitles for that specific episode.` },
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

        {/* Cross-links to other languages */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-5">Subtitles in Other Languages</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {otherLanguages.map(([key, l]) => (
              <Link
                key={key}
                to={`/subtitles/${key}`}
                className="bg-card/60 backdrop-blur-sm rounded-xl p-3 ring-1 ring-border/20 hover:ring-primary/30 hover:bg-card transition-all duration-300 text-center group"
              >
                <span className="text-xl block mb-1">{l.flag}</span>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{l.name}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SEOContentBlock
        title={`Free ${lang.name} Subtitles for Movies & TV Shows`}
        paragraphs={[
          `CinemaHub offers free ${lang.name} (${lang.native}) subtitle downloads for thousands of movies and TV show episodes. All subtitles are provided in SRT format, the most widely supported subtitle format compatible with VLC, MPC-HC, PotPlayer, Kodi, Plex, and virtually every media player.`,
          `Whether you're looking for ${lang.name} subtitles for the latest blockbuster, a classic film, or a TV series episode, CinemaHub makes it easy. Simply search for the title, navigate to its page, and download ${lang.name} subtitles with one click — no registration or payment required.`,
          `CinemaHub supports subtitles in over 50 languages. If you need subtitles in a different language, visit our main subtitles page to browse all available languages and find the perfect subtitle file for your movie or TV show.`,
        ]}
      />
      <Footer />
    </div>
  );
};

export default SubtitleLanguagePage;
