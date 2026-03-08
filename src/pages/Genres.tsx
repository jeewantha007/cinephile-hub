import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Film, SlidersHorizontal, ArrowUpDown, Star, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getGenres, getMoviesByGenre, getMoviesByGenrePaginated, type Genre } from "@/lib/tmdb";

type SortOption = "popularity.desc" | "vote_average.desc" | "release_date.desc" | "title.asc";
type RatingFilter = "all" | "high" | "medium" | "low";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popularity.desc", label: "Popular" },
  { value: "vote_average.desc", label: "Top Rated" },
  { value: "release_date.desc", label: "Newest" },
  { value: "title.asc", label: "A-Z" },
];

const ratingOptions: { value: RatingFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "high", label: "8+" },
  { value: "medium", label: "6-8" },
  { value: "low", label: "<6" },
];

const GenreCard = ({ genre, isSelected, onClick }: { genre: Genre & { backdrop?: string }; isSelected: boolean; onClick: () => void }) => (
  <button onClick={onClick}
    className={`group relative overflow-hidden rounded-xl aspect-[4/3] transition-all duration-300 ${
      isSelected ? "ring-2 ring-primary shadow-lg shadow-primary/25 scale-[1.02]" : "ring-1 ring-border/30 hover:ring-border/60 hover:scale-105"
    }`}>
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
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("popularity.desc");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const [showFilters, setShowFilters] = useState(false);

  const { data: genreList = [] } = useQuery({ queryKey: ["genres"], queryFn: getGenres });

  const { data: genreBackdrops = {} } = useQuery({
    queryKey: ["genreBackdrops", genreList.map((g) => g.id).join(",")],
    queryFn: async () => {
      const results: Record<number, string> = {};
      await Promise.all(
        genreList.map(async (genre) => {
          try {
            const movies = await getMoviesByGenre(genre.id);
            const m = movies.find((m) => m.backdrop_path && !m.backdrop_path.includes("placeholder"));
            if (m) results[genre.id] = m.backdrop_path!;
          } catch { /* ignore */ }
        })
      );
      return results;
    },
    enabled: genreList.length > 0,
    staleTime: 1000 * 60 * 30,
  });

  const { data: paginatedData, isLoading, isFetching } = useQuery({
    queryKey: ["genreMoviesPaged", selectedGenre, page, sortBy],
    queryFn: () => getMoviesByGenrePaginated(selectedGenre!, page, sortBy),
    enabled: selectedGenre !== null,
    keepPreviousData: true,
  });

  const totalPages = paginatedData?.totalPages ?? 0;
  const totalResults = paginatedData?.totalResults ?? 0;
  let movies = paginatedData?.movies ?? [];

  // Client-side rating filter
  if (ratingFilter === "high") movies = movies.filter((m) => m.vote_average >= 8);
  else if (ratingFilter === "medium") movies = movies.filter((m) => m.vote_average >= 6 && m.vote_average < 8);
  else if (ratingFilter === "low") movies = movies.filter((m) => m.vote_average < 6);

  const selectGenre = (id: number) => {
    if (selectedGenre === id) {
      setSelectedGenre(null);
    } else {
      setSelectedGenre(id);
      setPage(1);
    }
  };

  const selectedName = genreList.find((g) => g.id === selectedGenre)?.name;

  // Pagination helpers
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

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
              isSelected={selectedGenre === genre.id}
              onClick={() => selectGenre(genre.id)}
            />
          ))}
        </div>

        {selectedGenre && (
          <div className="animate-fade-in space-y-4 mb-6">
            {/* Header + filters */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Film className="h-5 w-5 text-primary" />
                {selectedName}
                <span className="text-sm font-normal text-muted-foreground">
                  ({totalResults.toLocaleString()} movies)
                </span>
              </h2>
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-2 bg-card border-border/50">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </Button>
            </div>

            {showFilters && (
              <div className="flex flex-wrap gap-4 p-4 bg-card rounded-xl ring-1 ring-border/30 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <ArrowUpDown className="h-3 w-3" /> Sort by
                  </label>
                  <div className="flex gap-1.5">
                    {sortOptions.map((opt) => (
                      <button key={opt.value} onClick={() => { setSortBy(opt.value); setPage(1); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          sortBy === opt.value ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:text-foreground"
                        }`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Star className="h-3 w-3" /> Rating
                  </label>
                  <div className="flex gap-1.5">
                    {ratingOptions.map((opt) => (
                      <button key={opt.value} onClick={() => setRatingFilter(opt.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          ratingFilter === opt.value ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:text-foreground"
                        }`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Movie grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="aspect-[2/3] rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            ) : movies.length === 0 ? (
              <p className="text-muted-foreground py-8">No movies match your filters on this page.</p>
            ) : (
              <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 transition-opacity duration-200 ${isFetching ? "opacity-50" : ""}`}>
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 pt-6 flex-wrap">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="h-9 w-9 rounded-lg bg-card ring-1 ring-border/30 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-9 w-9 rounded-lg bg-card ring-1 ring-border/30 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {getPageNumbers().map((p, i) =>
                  p === "..." ? (
                    <span key={`ellipsis-${i}`} className="h-9 w-9 flex items-center justify-center text-muted-foreground text-sm">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`h-9 min-w-[2.25rem] px-2 rounded-lg text-sm font-medium transition-all ${
                        page === p
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                          : "bg-card ring-1 ring-border/30 text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="h-9 w-9 rounded-lg bg-card ring-1 ring-border/30 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="h-9 w-9 rounded-lg bg-card ring-1 ring-border/30 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronsRight className="h-4 w-4" />
                </button>

                <span className="text-xs text-muted-foreground ml-3">
                  Page {page} of {totalPages.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Genres;
