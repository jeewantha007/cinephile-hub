import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Film, SlidersHorizontal, ArrowUpDown, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getGenres, getMoviesByGenre, type Genre } from "@/lib/tmdb";

type SortOption = "rating" | "date" | "title";
type RatingFilter = "all" | "high" | "medium" | "low";

const GenreCard = ({ genre, isSelected, onClick }: { genre: Genre & { backdrop?: string }; isSelected: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`group relative overflow-hidden rounded-xl aspect-[4/3] transition-all duration-300 ${
      isSelected ? "ring-2 ring-primary shadow-lg shadow-primary/25 scale-[1.02]" : "ring-1 ring-border/30 hover:ring-border/60 hover:scale-105"
    }`}
  >
    {genre.backdrop ? (
      <img src={genre.backdrop} alt={genre.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
    ) : (
      <div className="w-full h-full bg-card" />
    )}
    <div className={`absolute inset-0 transition-colors duration-300 ${isSelected ? "bg-primary/40" : "bg-background/50 group-hover:bg-background/30"}`} />
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-foreground font-bold text-lg drop-shadow-lg">{genre.name}</span>
    </div>
    {isSelected && (
      <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
        <span className="text-primary-foreground text-xs">✓</span>
      </div>
    )}
  </button>
);

const Genres = () => {
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const [showFilters, setShowFilters] = useState(false);

  const { data: genreList = [] } = useQuery({ queryKey: ["genres"], queryFn: getGenres });

  // Fetch a backdrop image for each genre from top movie in that genre
  const { data: genreBackdrops = {} } = useQuery({
    queryKey: ["genreBackdrops", genreList.map((g) => g.id).join(",")],
    queryFn: async () => {
      const results: Record<number, string> = {};
      const fetches = genreList.map(async (genre) => {
        try {
          const movies = await getMoviesByGenre(genre.id);
          const movieWithBackdrop = movies.find((m) => m.backdrop_path && !m.backdrop_path.includes("placeholder"));
          if (movieWithBackdrop) {
            results[genre.id] = movieWithBackdrop.backdrop_path!;
          }
        } catch { /* ignore */ }
      });
      await Promise.all(fetches);
      return results;
    },
    enabled: genreList.length > 0,
    staleTime: 1000 * 60 * 30, // cache 30 min
  });

  const primaryGenre = selectedGenres[0] ?? null;
  const { data: rawMovies = [], isLoading } = useQuery({
    queryKey: ["genreMovies", primaryGenre],
    queryFn: () => getMoviesByGenre(primaryGenre!),
    enabled: primaryGenre !== null,
  });

  const toggleGenre = (id: number) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  let movies = rawMovies.filter((m) => {
    if (selectedGenres.length > 1) {
      return selectedGenres.every((gid) => m.genre_ids.includes(gid));
    }
    return true;
  });

  if (ratingFilter === "high") movies = movies.filter((m) => m.vote_average >= 8);
  else if (ratingFilter === "medium") movies = movies.filter((m) => m.vote_average >= 6 && m.vote_average < 8);
  else if (ratingFilter === "low") movies = movies.filter((m) => m.vote_average < 6);

  movies = [...movies].sort((a, b) => {
    if (sortBy === "rating") return b.vote_average - a.vote_average;
    if (sortBy === "date") return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
    return a.title.localeCompare(b.title);
  });

  const selectedNames = genreList.filter((g) => selectedGenres.includes(g.id)).map((g) => g.name).join(", ");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Browse by Genre</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {genreList.map((genre) => (
            <GenreCard
              key={genre.id}
              genre={{ ...genre, backdrop: genreBackdrops[genre.id] }}
              isSelected={selectedGenres.includes(genre.id)}
              onClick={() => toggleGenre(genre.id)}
            />
          ))}
        </div>

        {selectedGenres.length > 0 && (
          <div className="animate-fade-in space-y-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap gap-2 flex-1">
                {genreList.filter((g) => selectedGenres.includes(g.id)).map((g) => (
                  <Badge key={g.id} className="bg-primary/20 text-primary border-primary/30 cursor-pointer hover:bg-primary/30"
                    onClick={() => toggleGenre(g.id)}>{g.name} ✕</Badge>
                ))}
                <button onClick={() => setSelectedGenres([])} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Clear all</button>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-2 bg-card border-border/50">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </Button>
            </div>

            {showFilters && (
              <div className="flex flex-wrap gap-4 p-4 bg-card rounded-xl ring-1 ring-border/30 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1"><ArrowUpDown className="h-3 w-3" /> Sort by</label>
                  <div className="flex gap-1.5">
                    {([{ value: "rating", label: "Rating" }, { value: "date", label: "Date" }, { value: "title", label: "Title" }] as const).map((opt) => (
                      <button key={opt.value} onClick={() => setSortBy(opt.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sortBy === opt.value ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:text-foreground"}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Star className="h-3 w-3" /> Rating</label>
                  <div className="flex gap-1.5">
                    {([{ value: "all", label: "All" }, { value: "high", label: "8+" }, { value: "medium", label: "6-8" }, { value: "low", label: "<6" }] as const).map((opt) => (
                      <button key={opt.value} onClick={() => setRatingFilter(opt.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${ratingFilter === opt.value ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:text-foreground"}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Film className="h-5 w-5 text-primary" /> {selectedNames} ({movies.length})
              </h2>
              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2"><Skeleton className="aspect-[2/3] rounded-xl" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /></div>
                  ))}
                </div>
              ) : movies.length === 0 ? (
                <p className="text-muted-foreground py-8">No movies match your filters.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                  {movies.map((movie) => (<MovieCard key={movie.id} movie={movie} />))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Genres;
