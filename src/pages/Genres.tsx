import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Film } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import { getGenres, getMoviesByGenre } from "@/lib/tmdb";

const genreIcons: Record<string, string> = {
  Action: "💥",
  Comedy: "😂",
  Horror: "👻",
  "Sci-Fi": "🚀",
  Drama: "🎭",
  Animation: "🎨",
  Romance: "❤️",
  Thriller: "🔪",
  Adventure: "🗺️",
  Fantasy: "🧙",
};

const Genres = () => {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const { data: genreList = [] } = useQuery({ queryKey: ["genres"], queryFn: getGenres });
  const { data: movies = [], isLoading } = useQuery({
    queryKey: ["genreMovies", selectedGenre],
    queryFn: () => getMoviesByGenre(selectedGenre!),
    enabled: selectedGenre !== null,
  });

  const selectedName = genreList.find((g) => g.id === selectedGenre)?.name;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Browse by Genre</h1>

        {/* Genre grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10">
          {genreList.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre.id === selectedGenre ? null : genre.id)}
              className={`flex items-center gap-3 p-4 rounded-lg transition-all duration-200 text-left ${
                selectedGenre === genre.id
                  ? "bg-primary text-primary-foreground ring-2 ring-primary"
                  : "bg-card text-foreground hover:bg-card/80 hover:scale-105"
              }`}
            >
              <span className="text-2xl">{genreIcons[genre.name] || "🎬"}</span>
              <span className="font-medium text-sm">{genre.name}</span>
            </button>
          ))}
        </div>

        {/* Movies for selected genre */}
        {selectedGenre && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Film className="h-5 w-5 text-primary" />
              {selectedName} Movies
            </h2>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : movies.length === 0 ? (
              <p className="text-muted-foreground py-8">No movies found for this genre.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
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
