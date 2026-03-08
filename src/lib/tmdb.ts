const TMDB_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMmY2ZTg0Nzg5NDViNzQ5YTdjYTUyYzMzNmM5NjZmZiIsIm5iZiI6MTc3Mjk0NjYxNC4wMzQsInN1YiI6IjY5YWQwNGI2ZmQxNGMxZWFkM2MxYzIwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.h9scsVziPaXqnDnmm2POuc0DrP3_Mn33IxCnYM2kDnw";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p";

const headers = {
  Authorization: `Bearer ${TMDB_TOKEN}`,
  "Content-Type": "application/json",
};

async function tmdbFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { headers });
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}

// ---------- Types ----------

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  runtime?: number;
  genres?: Genre[];
  videos?: { results: Video[] };
  credits?: { cast: CastMember[] };
}

export interface Genre {
  id: number;
  name: string;
}

export interface Video {
  key: string;
  name: string;
  type: string;
  site: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

// ---------- Image helpers ----------

export const posterUrl = (path: string | null, size = "w500") =>
  path ? `${IMG_BASE}/${size}${path}` : "/placeholder.svg";

export const backdropUrl = (path: string | null, size = "original") =>
  path ? `${IMG_BASE}/${size}${path}` : "/placeholder.svg";

export const profileUrl = (path: string | null, size = "w185") =>
  path ? `${IMG_BASE}/${size}${path}` : null;

// ---------- List endpoints ----------

interface TmdbListResponse {
  results: Array<{
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    genre_ids: number[];
  }>;
}

const mapMovies = (data: TmdbListResponse): Movie[] =>
  data.results.map((m) => ({
    ...m,
    poster_path: posterUrl(m.poster_path),
    backdrop_path: backdropUrl(m.backdrop_path),
  }));

export const getTrending = async (): Promise<Movie[]> =>
  mapMovies(await tmdbFetch<TmdbListResponse>("/trending/movie/week"));

export const getPopular = async (): Promise<Movie[]> =>
  mapMovies(await tmdbFetch<TmdbListResponse>("/movie/popular"));

export const getTopRated = async (): Promise<Movie[]> =>
  mapMovies(await tmdbFetch<TmdbListResponse>("/movie/top_rated"));

export const getUpcoming = async (): Promise<Movie[]> =>
  mapMovies(await tmdbFetch<TmdbListResponse>("/movie/upcoming"));

export const searchMovies = async (query: string): Promise<Movie[]> =>
  mapMovies(
    await tmdbFetch<TmdbListResponse>(
      `/search/movie?query=${encodeURIComponent(query)}`
    )
  );

export const getMoviesByGenre = async (genreId: number): Promise<Movie[]> =>
  mapMovies(
    await tmdbFetch<TmdbListResponse>(
      `/discover/movie?with_genres=${genreId}&sort_by=popularity.desc`
    )
  );

// ---------- Detail endpoints ----------

interface TmdbMovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  runtime: number;
  genres: Genre[];
}

interface TmdbCreditsResponse {
  cast: Array<{
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }>;
}

interface TmdbVideosResponse {
  results: Video[];
}

export const getMovieDetails = async (id: number): Promise<Movie> => {
  const [detail, credits, videos] = await Promise.all([
    tmdbFetch<TmdbMovieDetail>(`/movie/${id}`),
    tmdbFetch<TmdbCreditsResponse>(`/movie/${id}/credits`),
    tmdbFetch<TmdbVideosResponse>(`/movie/${id}/videos`),
  ]);

  return {
    ...detail,
    genre_ids: detail.genres.map((g) => g.id),
    poster_path: posterUrl(detail.poster_path),
    backdrop_path: backdropUrl(detail.backdrop_path),
    credits: {
      cast: credits.cast.slice(0, 10).map((c) => ({
        ...c,
        profile_path: profileUrl(c.profile_path),
      })),
    },
    videos: { results: videos.results },
  };
};

export const getSimilarMovies = async (id: number): Promise<Movie[]> =>
  mapMovies(
    await tmdbFetch<TmdbListResponse>(`/movie/${id}/recommendations`)
  );

// ---------- Genres ----------

interface TmdbGenreResponse {
  genres: Genre[];
}

export const getGenres = async (): Promise<Genre[]> =>
  (await tmdbFetch<TmdbGenreResponse>("/genre/movie/list")).genres;
