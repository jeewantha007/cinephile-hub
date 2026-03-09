import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Star, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { getTVDetails, getTVSeasonDetails, type TVShowFull } from "@/lib/tmdb";
import { extractIdFromSlug, slugify } from "@/lib/slugs";

const pad = (n: number) => String(n).padStart(2, "0");

const TVSeasonPage = () => {
  const { id, seasonNumber } = useParams<{ id: string; seasonNumber: string }>();
  const showId = extractIdFromSlug(id);
  const sNum = Number(seasonNumber);

  const { data: show } = useQuery<TVShowFull>({
    queryKey: ["tv-detail", showId],
    queryFn: () => getTVDetails(showId),
    enabled: !!showId,
  });

  const { data: season, isLoading } = useQuery({
    queryKey: ["tv-season", showId, sNum],
    queryFn: () => getTVSeasonDetails(showId, sNum),
    enabled: !!showId && !isNaN(sNum),
  });

  const showSlug = show ? slugify(show.title, showId) : id || "";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 space-y-4">
          <Skeleton className="h-10 w-72" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!season) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <p className="text-muted-foreground">Season not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${show?.title || "TV Show"} – ${season.name} | CinemaHub`}
        description={`Browse all ${season.episodes.length} episodes of ${show?.title || "TV Show"} ${season.name}. Air dates, ratings, and episode guides on CinemaHub.`}
        canonicalPath={`/tv/${showSlug}/season/${sNum}`}
      />
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12 space-y-8">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link to="/tv-shows" className="hover:text-foreground transition-colors">TV Shows</Link>
          <span>/</span>
          <Link to={`/tv/${showSlug}`} className="hover:text-foreground transition-colors">{show?.title || "Show"}</Link>
          <span>/</span>
          <span className="text-foreground">{season.name}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-6">
          {season.poster_path && (
            <img
              src={season.poster_path}
              alt={season.name}
              className="w-[160px] rounded-xl shadow-lg flex-shrink-0"
            />
          )}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {show?.title} – {season.name}
            </h1>
            {season.air_date && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(season.air_date).getFullYear()}</span>
              </div>
            )}
            <Badge variant="secondary">{season.episodes.length} Episodes</Badge>
            {season.overview && (
              <p className="text-muted-foreground max-w-2xl leading-relaxed">{season.overview}</p>
            )}
          </div>
        </div>

        {/* Episodes Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Episodes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {season.episodes.map((ep) => (
              <Link
                key={ep.id}
                to={`/tv/${showSlug}/season/${sNum}/episode/${ep.episode_number}`}
                className="group bg-card rounded-xl ring-1 ring-border/30 hover:ring-primary/50 overflow-hidden transition-all flex flex-col sm:flex-row"
              >
                <div className="sm:w-[220px] flex-shrink-0 aspect-video sm:aspect-auto overflow-hidden bg-muted">
                  {ep.still_path ? (
                    <img
                      src={ep.still_path}
                      alt={ep.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full min-h-[120px] flex items-center justify-center text-muted-foreground text-sm">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4 flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-mono">
                      S{pad(sNum)}E{pad(ep.episode_number)}
                    </Badge>
                    {ep.vote_average > 0 && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {ep.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {ep.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{ep.overview}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {ep.air_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(ep.air_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    )}
                    {ep.runtime && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {ep.runtime}m
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TVSeasonPage;
