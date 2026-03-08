import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, MapPin, ExternalLink, Image, User, Film, Tv } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieRow from "@/components/MovieRow";
import SEOHead from "@/components/SEOHead";
import { getPersonDetails, imageUrl } from "@/lib/tmdb";
import { useState } from "react";

const PersonDetails = () => {
  const { id } = useParams<{ id: string }>();
  const personId = Number(id);
  const [bioExpanded, setBioExpanded] = useState(false);

  const { data: person, isLoading } = useQuery({
    queryKey: ["person", personId],
    queryFn: () => getPersonDetails(personId),
    enabled: !!personId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <Skeleton className="w-[250px] h-[375px] rounded-xl" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-32 w-full max-w-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 text-center">
          <p className="text-muted-foreground">Person not found.</p>
          <Link to="/people" className="text-primary hover:underline mt-2 inline-block">Browse People</Link>
        </div>
      </div>
    );
  }

  const age = person.birthday
    ? Math.floor((Date.now() - new Date(person.birthday).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  const bioTruncated = person.biography.length > 500 && !bioExpanded;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${person.name} – Actor Profile, Movies & Photos | CinemaHub`}
        description={`Discover ${person.name}'s biography, filmography, photos and more on CinemaHub.`}
        canonicalPath={`/person/${person.id}`}
        ogImage={person.profile_path || undefined}
      />
      <Navbar />

      <div className="pt-24 pb-8 container mx-auto px-4">
        <Link to="/people" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to People
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Image */}
          <div className="shrink-0 w-full md:w-[280px]">
            {person.profile_path ? (
              <img
                src={person.profile_path}
                alt={person.name}
                className="w-full rounded-xl shadow-2xl shadow-primary/10"
              />
            ) : (
              <div className="w-full aspect-[2/3] rounded-xl bg-muted flex items-center justify-center">
                <User className="h-20 w-20 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-5">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{person.name}</h1>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{person.known_for_department}</Badge>
              {person.birthday && (
                <Badge variant="outline" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(person.birthday).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  {age !== null && !person.deathday && ` (${age} years)`}
                </Badge>
              )}
              {person.deathday && (
                <Badge variant="outline" className="gap-1 text-muted-foreground">
                  † {new Date(person.deathday).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </Badge>
              )}
              {person.place_of_birth && (
                <Badge variant="outline" className="gap-1">
                  <MapPin className="h-3 w-3" />
                  {person.place_of_birth}
                </Badge>
              )}
            </div>

            {/* External Links */}
            <div className="flex flex-wrap gap-3">
              {person.imdb_id && (
                <a
                  href={`https://www.imdb.com/name/${person.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-card rounded-xl px-4 py-3 ring-1 ring-border/30 hover:ring-yellow-500/50 hover:bg-yellow-500/5 transition-all flex items-center gap-2 group"
                >
                  <span className="text-sm font-bold text-yellow-400">IMDb</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-yellow-400 transition-colors" />
                </a>
              )}
              <a
                href={`https://en.wikipedia.org/wiki/${encodeURIComponent(person.name.replace(/ /g, "_"))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-card rounded-xl px-4 py-3 ring-1 ring-border/30 hover:ring-primary/50 hover:bg-primary/5 transition-all flex items-center gap-2 group"
              >
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Wikipedia</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            </div>

            {/* Biography */}
            {person.biography && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Biography</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {bioTruncated ? person.biography.slice(0, 500) + "..." : person.biography}
                </p>
                {person.biography.length > 500 && (
                  <button
                    onClick={() => setBioExpanded(!bioExpanded)}
                    className="text-primary text-sm mt-1 hover:underline"
                  >
                    {bioExpanded ? "Show less" : "Read more"}
                  </button>
                )}
              </div>
            )}

            {/* Also Known As */}
            {person.also_known_as.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground mb-1">Also Known As</h2>
                <p className="text-sm text-muted-foreground">{person.also_known_as.slice(0, 5).join(", ")}</p>
              </div>
            )}
          </div>
        </div>

        {/* Photo Gallery */}
        {person.images.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Image className="h-5 w-5 text-primary" /> Photos
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {person.images.map((img, idx) => (
                <a
                  key={idx}
                  href={imageUrl(img.file_path, "original")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl overflow-hidden bg-card ring-1 ring-border/30 hover:ring-primary/50 transition-all group"
                >
                  <img
                    src={imageUrl(img.file_path, "w185")}
                    alt={`${person.name} photo ${idx + 1}`}
                    className="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Movie Credits */}
        {person.movie_credits.length > 0 && (
          <div className="mt-12">
            <MovieRow title={`${person.name}'s Movies`} movies={person.movie_credits} />
          </div>
        )}

        {/* TV Credits */}
        {person.tv_credits.length > 0 && (
          <div className="mt-12">
            <MovieRow title={`${person.name}'s TV Shows`} movies={person.tv_credits} linkPrefix="/tv" />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PersonDetails;
