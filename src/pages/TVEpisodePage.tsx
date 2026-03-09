import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Star, Calendar, Clock, Play, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import MovieRow from "@/components/MovieRow";
import SubtitlesSection from "@/components/SubtitlesSection";
import { getTVDetails, getTVEpisodeDetails, getSimilarTV, type TVShowFull } from "@/lib/tmdb";
import { extractIdFromSlug, slugify } from "@/lib/slugs";

const pad = (n: number) => String(n).padStart(2, "0");

const TVEpisodePage = () => {
  const { id, seasonNumber, episodeNumber } = useParams<{
    id: string;
    seasonNumber: string;
    episodeNumber: string;
  }>();
  const showId = extractIdFromSlug(id);
  const sNum = Number(seasonNumber);
  const eNum = Number(episodeNumber);

  const { data: show } = useQuery<TVShowFull>({
    queryKey: ["tv-detail", showId],
    queryFn: () => getTVDetails(showId),
    enabled: !!showId,
  });

  const { data: episode, isLoading } = useQuery({
    queryKey: ["tv-episode", showId, sNum, eNum],
    queryFn: () => getTVEpisodeDetails(showId, sNum, eNum),
    enabled: !!showId && !isNaN(sNum) && !isNaN(eNum),
  });

  const { data: similar = [] } = useQuery({
    queryKey: ["tv-similar", showId],
    queryFn: () => getSimilarTV(showId),
    enabled: !!showId,
  });

  const showSlug = show ? slugify(show.title, showId) : id || "";
  const episodeLabel = `S${pad(sNum)}E${pad(eNum)}`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 space-y-4">
          <Skeleton className="h-10 w-96" />
          <Skeleton className="aspect-video max-w-3xl rounded-xl" />
          <Skeleton className="h-24 max-w-2xl" />
        </div>
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <p className="text-muted-foreground">Episode not found.</p>
      </div>
    );
  }

  const trailer = episode.videos?.results.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  ) || episode.videos?.results.find((v) => v.site === "YouTube");

  const allCast = [
    ...(episode.credits?.cast || []),
    ...(episode.credits?.guest_stars || []),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TVEpisode",
    name: episode.name,
    episodeNumber: episode.episode_number,
    partOfSeason: {
      "@type": "TVSeason",
      seasonNumber: sNum,
      partOfSeries: {
        "@type": "TVSeries",
        name: show?.title,
      },
    },
    datePublished: episode.air_date || undefined,
    description: episode.overview,
    image: episode.still_path || undefined,
    aggregateRating: episode.vote_average > 0 ? {
      "@type": "AggregateRating",
      ratingValue: episode.vote_average.toFixed(1),
      bestRating: "10",
      ratingCount: episode.vote_count || 1,
    } : undefined,
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${show?.title || "TV Show"} ${episodeLabel} – ${episode.name} | CinemaHub`}
        description={`Watch ${show?.title || "TV Show"} ${episodeLabel} "${episode.name}". Episode details, cast, trailer, and subtitles on CinemaHub.`}
        canonicalPath={`/tv/${showSlug}/season-${sNum}/episode-${eNum}`}
        ogImage={episode.still_path || show?.backdrop_path || undefined}
        jsonLd={[jsonLd]}
      />
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12 space-y-8">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link to="/tv-shows" className="hover:text-foreground transition-colors">TV Shows</Link>
          <span>/</span>
          <Link to={`/tv/${showSlug}`} className="hover:text-foreground transition-colors">{show?.title || "Show"}</Link>
          <span>/</span>
          <Link to={`/tv/${showSlug}/season-${sNum}`} className="hover:text-foreground transition-colors">Season {sNum}</Link>
          <span>/</span>
          <span className="text-foreground">{episodeLabel}</span>
        </div>

        {/* Still Image */}
        {episode.still_path && (
          <div className="max-w-4xl rounded-xl overflow-hidden ring-1 ring-border/30">
            <img
              src={episode.still_path}
              alt={`${episodeLabel} – ${episode.name}`}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Episode Info */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge className="font-mono text-sm">{episodeLabel}</Badge>
            {episode.vote_average > 0 && (
              <span className="flex items-center gap-1.5 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-foreground">{episode.vote_average.toFixed(1)}</span>
                <span className="text-muted-foreground">/ 10</span>
              </span>
            )}
            {episode.air_date && (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {new Date(episode.air_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              </span>
            )}
            {episode.runtime && (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {episode.runtime} min
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{episode.name}</h1>
          <p className="text-lg text-muted-foreground font-medium">
            {show?.title} – Season {sNum}
          </p>
          <p className="text-muted-foreground leading-relaxed">{episode.overview}</p>

          {trailer && (
            <a href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noopener noreferrer">
              <Button className="gap-2 mt-2">
                <Play className="h-4 w-4" /> Watch Trailer
              </Button>
            </a>
          )}
        </div>

        {/* Trailer embed */}
        {trailer && (
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-foreground mb-4">Trailer</h2>
            <div className="aspect-video rounded-xl overflow-hidden ring-1 ring-border/30">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={`${episodeLabel} Trailer`}
                className="w-full h-full"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Cast */}
        {allCast.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Cast</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {allCast.map((member) => (
                <Link
                  key={member.id}
                  to={`/person/${slugify(member.name, member.id)}`}
                  className="flex-shrink-0 w-[100px] text-center space-y-2 group"
                >
                  {member.profile_path ? (
                    <img
                      src={member.profile_path}
                      alt={member.name}
                      className="w-16 h-16 rounded-full mx-auto object-cover ring-2 ring-transparent group-hover:ring-primary/50 transition-all"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full mx-auto bg-muted flex items-center justify-center ring-2 ring-transparent group-hover:ring-primary/50 transition-all">
                      <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">{member.name}</p>
                  <p className="text-[10px] text-muted-foreground line-clamp-1">{member.character}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Subtitles */}
        {show?.imdb_id && <SubtitlesSection imdbId={show.imdb_id} />}

        {/* Similar Shows */}
        {similar.length > 0 && (
          <div className="pt-4">
            <MovieRow title="Similar TV Shows" movies={similar} linkPrefix="/tv" />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TVEpisodePage;
