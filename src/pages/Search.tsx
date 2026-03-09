import { useState, useEffect } from "react";
import { slugify } from "@/lib/slugs";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, Film, Tv, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import MovieCard from "@/components/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import { searchMovies, searchTV, searchPeople, profileUrl } from "@/lib/tmdb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const tab = searchParams.get("tab") || "movies";
  const [query, setQuery] = useState(initialQuery);

  const { data: movieResults = [], isLoading: moviesLoading } = useQuery({
    queryKey: ["search-movies", initialQuery],
    queryFn: () => searchMovies(initialQuery),
    enabled: initialQuery.length > 0,
  });

  const { data: tvResults = [], isLoading: tvLoading } = useQuery({
    queryKey: ["search-tv", initialQuery],
    queryFn: () => searchTV(initialQuery),
    enabled: initialQuery.length > 0,
  });

  const { data: peopleResults = [], isLoading: peopleLoading } = useQuery({
    queryKey: ["search-people", initialQuery],
    queryFn: () => searchPeople(initialQuery),
    enabled: initialQuery.length > 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim(), tab });
    }
  };

  const handleTabChange = (value: string) => {
    setSearchParams({ q: initialQuery, tab: value });
  };

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const isLoading = moviesLoading || tvLoading || peopleLoading;

  const seoTitle = initialQuery
    ? `Search results for "${initialQuery}" – CinemaHub`
    : "Search Movies, TV Shows & Actors – CinemaHub";
  const seoDesc = initialQuery
    ? `Find movies, TV shows, and actors matching "${initialQuery}" on CinemaHub.`
    : "Search thousands of movies, TV shows, and actors on CinemaHub. Find trailers, ratings, subtitles, and more.";

  const GridSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-[2/3] rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={seoTitle} description={seoDesc} canonicalPath="/search" />
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <Breadcrumbs items={[{ label: "Search" }]} />
        <h1 className="text-3xl font-bold text-foreground mb-6">Search Movies, TV Shows & Actors</h1>
        <form onSubmit={handleSearch} className="relative max-w-xl mb-8">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search movies, TV shows, people..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-base ring-1 ring-border/50 transition-all"
          />
        </form>

        {initialQuery && (
          <Tabs value={tab} onValueChange={handleTabChange}>
            <TabsList className="mb-6">
              <TabsTrigger value="movies" className="gap-2">
                <Film className="h-4 w-4" /> Movies {movieResults.length > 0 && `(${movieResults.length})`}
              </TabsTrigger>
              <TabsTrigger value="tv" className="gap-2">
                <Tv className="h-4 w-4" /> TV Shows {tvResults.length > 0 && `(${tvResults.length})`}
              </TabsTrigger>
              <TabsTrigger value="people" className="gap-2">
                <Users className="h-4 w-4" /> People {peopleResults.length > 0 && `(${peopleResults.length})`}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="movies">
              {moviesLoading && <GridSkeleton />}
              {!moviesLoading && movieResults.length === 0 && (
                <p className="text-muted-foreground text-center py-12">No movies found for "{initialQuery}"</p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {movieResults.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tv">
              {tvLoading && <GridSkeleton />}
              {!tvLoading && tvResults.length === 0 && (
                <p className="text-muted-foreground text-center py-12">No TV shows found for "{initialQuery}"</p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {tvResults.map((show) => (
                  <MovieCard key={show.id} movie={show} linkPrefix="/tv" />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="people">
              {peopleLoading && <GridSkeleton />}
              {!peopleLoading && peopleResults.length === 0 && (
                <p className="text-muted-foreground text-center py-12">No people found for "{initialQuery}"</p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {peopleResults.map((person) => (
                  <Link
                    key={person.id}
                    to={`/person/${slugify(person.name, person.id)}`}
                    className="group space-y-2"
                  >
                    <div className="aspect-[2/3] rounded-xl overflow-hidden bg-muted">
                      {person.profile_path ? (
                        <img
                          src={person.profile_path}
                          alt={person.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors truncate">
                      {person.name}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {person.known_for_department}
                    </p>
                  </Link>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Search;
