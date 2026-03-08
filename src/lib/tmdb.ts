import {
  mockMovies,
  trendingMovies,
  popularMovies,
  topRatedMovies,
  upcomingMovies,
  genres,
  type Movie,
  type Genre,
} from "@/data/mockMovies";

// Mock API functions — swap with real TMDB API calls later
export const getTrending = async (): Promise<Movie[]> => trendingMovies;
export const getPopular = async (): Promise<Movie[]> => popularMovies;
export const getTopRated = async (): Promise<Movie[]> => topRatedMovies;
export const getUpcoming = async (): Promise<Movie[]> => upcomingMovies;

export const getMovieDetails = async (id: number): Promise<Movie | undefined> =>
  mockMovies.find((m) => m.id === id);

export const searchMovies = async (query: string): Promise<Movie[]> =>
  mockMovies.filter((m) => m.title.toLowerCase().includes(query.toLowerCase()));

export const getGenres = async (): Promise<Genre[]> => genres;

export const getMoviesByGenre = async (genreId: number): Promise<Movie[]> =>
  mockMovies.filter((m) => m.genre_ids.includes(genreId));

export const getSimilarMovies = async (id: number): Promise<Movie[]> => {
  const movie = mockMovies.find((m) => m.id === id);
  if (!movie) return [];
  return mockMovies
    .filter((m) => m.id !== id && m.genre_ids.some((g) => movie.genre_ids.includes(g)))
    .slice(0, 6);
};
