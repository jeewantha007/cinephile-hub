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
  reviews?: Review[];
  images?: MovieImage[];
  keywords?: Keyword[];
  belongs_to_collection?: CollectionInfo | null;
  watchProviders?: WatchProviderData | null;
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

export interface Review {
  id: string;
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
  url: string;
}

export interface MovieImage {
  file_path: string;
  width: number;
  height: number;
  aspect_ratio: number;
  vote_average: number;
}

export interface Keyword {
  id: number;
  name: string;
}

export interface CollectionInfo {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface WatchProviderData {
  link?: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
  free?: WatchProvider[];
  ads?: WatchProvider[];
}

export const providerLogoUrl = (path: string, size = "w92") =>
  `${IMG_BASE}/${size}${path}`;

export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  known_for: Array<{
    id: number;
    title?: string;
    name?: string;
    media_type: string;
    poster_path: string | null;
  }>;
}

// ---------- Image helpers ----------

export const posterUrl = (path: string | null, size = "w500") =>
  path ? `${IMG_BASE}/${size}${path}` : "/placeholder.svg";

export const backdropUrl = (path: string | null, size = "original") =>
  path ? `${IMG_BASE}/${size}${path}` : "/placeholder.svg";

export const profileUrl = (path: string | null, size = "w185") =>
  path ? `${IMG_BASE}/${size}${path}` : null;

export const imageUrl = (path: string, size = "w780") =>
  `${IMG_BASE}/${size}${path}`;

// ---------- List endpoints ----------

interface TmdbListResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: Array<{
    id: number;
    title?: string;
    name?: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date?: string;
    first_air_date?: string;
    vote_average: number;
    genre_ids: number[];
  }>;
}

const mapMovies = (data: TmdbListResponse): Movie[] =>
  data.results.map((m) => ({
    id: m.id,
    title: m.title || m.name || "",
    overview: m.overview,
    poster_path: posterUrl(m.poster_path),
    backdrop_path: backdropUrl(m.backdrop_path),
    release_date: m.release_date || m.first_air_date || "",
    vote_average: m.vote_average,
    genre_ids: m.genre_ids,
  }));

export const getTrending = async (): Promise<Movie[]> =>
  mapMovies(await tmdbFetch<TmdbListResponse>("/trending/movie/week"));

export const getPopular = async (): Promise<Movie[]> =>
  mapMovies(await tmdbFetch<TmdbListResponse>("/movie/popular"));

export const getTopRated = async (): Promise<Movie[]> =>
  mapMovies(await tmdbFetch<TmdbListResponse>("/movie/top_rated"));

export const getUpcoming = async (): Promise<Movie[]> =>
  mapMovies(await tmdbFetch<TmdbListResponse>("/movie/upcoming"));

// Paginated versions
export interface PaginatedResult {
  movies: Movie[];
  page: number;
  totalPages: number;
  totalResults: number;
}

const paginateEndpoint = async (path: string, page: number): Promise<PaginatedResult> => {
  const separator = path.includes("?") ? "&" : "?";
  const data = await tmdbFetch<TmdbListResponse>(`${path}${separator}page=${page}`);
  return {
    movies: mapMovies(data),
    page: data.page,
    totalPages: Math.min(data.total_pages, 500),
    totalResults: data.total_results,
  };
};

export const getTrendingPaginated = (page = 1) => paginateEndpoint("/trending/movie/week", page);
export const getPopularPaginated = (page = 1) => paginateEndpoint("/movie/popular", page);
export const getTopRatedPaginated = (page = 1) => paginateEndpoint("/movie/top_rated", page);
export const getUpcomingPaginated = (page = 1) => paginateEndpoint("/movie/upcoming", page);

export const searchMovies = async (query: string): Promise<Movie[]> =>
  mapMovies(
    await tmdbFetch<TmdbListResponse>(
      `/search/movie?query=${encodeURIComponent(query)}`
    )
  );

export const getMoviesByGenrePaginated = async (
  genreId: number,
  page = 1,
  sortBy = "popularity.desc"
): Promise<PaginatedResult> => {
  const data = await tmdbFetch<TmdbListResponse>(
    `/discover/movie?with_genres=${genreId}&sort_by=${sortBy}&page=${page}`
  );
  return {
    movies: mapMovies(data),
    page: data.page,
    totalPages: Math.min(data.total_pages, 500),
    totalResults: data.total_results,
  };
};

export const getMoviesByGenre = async (genreId: number): Promise<Movie[]> =>
  (await getMoviesByGenrePaginated(genreId)).movies;

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
  belongs_to_collection: CollectionInfo | null;
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

interface TmdbReviewsResponse {
  results: Review[];
}

interface TmdbImagesResponse {
  backdrops: MovieImage[];
  posters: MovieImage[];
}

interface TmdbKeywordsResponse {
  keywords?: Keyword[];
  results?: Keyword[];
}

interface TmdbWatchProvidersResponse {
  results: Record<string, WatchProviderData>;
}

const extractWatchProviders = (data: TmdbWatchProvidersResponse): WatchProviderData | null => {
  // Try US first, then fallback to first available region
  const region = data.results?.US || data.results?.GB || Object.values(data.results || {})[0];
  return region || null;
};

export const getMovieDetails = async (id: number): Promise<Movie> => {
  const [detail, credits, videos, reviews, images, keywords, watchProviders] = await Promise.all([
    tmdbFetch<TmdbMovieDetail>(`/movie/${id}`),
    tmdbFetch<TmdbCreditsResponse>(`/movie/${id}/credits`),
    tmdbFetch<TmdbVideosResponse>(`/movie/${id}/videos`),
    tmdbFetch<TmdbReviewsResponse>(`/movie/${id}/reviews`),
    tmdbFetch<TmdbImagesResponse>(`/movie/${id}/images`),
    tmdbFetch<TmdbKeywordsResponse>(`/movie/${id}/keywords`),
    tmdbFetch<TmdbWatchProvidersResponse>(`/movie/${id}/watch/providers`),
  ]);

  return {
    ...detail,
    genre_ids: detail.genres.map((g) => g.id),
    poster_path: posterUrl(detail.poster_path),
    backdrop_path: backdropUrl(detail.backdrop_path),
    belongs_to_collection: detail.belongs_to_collection
      ? {
          ...detail.belongs_to_collection,
          poster_path: posterUrl(detail.belongs_to_collection.poster_path),
          backdrop_path: backdropUrl(detail.belongs_to_collection.backdrop_path),
        }
      : null,
    credits: {
      cast: credits.cast.slice(0, 10).map((c) => ({
        ...c,
        profile_path: profileUrl(c.profile_path),
      })),
    },
    videos: { results: videos.results },
    reviews: reviews.results.slice(0, 5),
    images: [...images.backdrops.slice(0, 12)],
    keywords: keywords.keywords || keywords.results || [],
    watchProviders: extractWatchProviders(watchProviders),
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

// ---------- TV Shows ----------

export const getTrendingTV = async (): Promise<Movie[]> =>
  mapMovies(await tmdbFetch<TmdbListResponse>("/trending/tv/week"));

export const getPopularTV = async (): Promise<Movie[]> =>
  mapMovies(await tmdbFetch<TmdbListResponse>("/tv/popular"));

export const getTopRatedTV = async (): Promise<Movie[]> =>
  mapMovies(await tmdbFetch<TmdbListResponse>("/tv/top_rated"));

export const getOnAirTV = async (): Promise<Movie[]> =>
  mapMovies(await tmdbFetch<TmdbListResponse>("/tv/on_the_air"));

export const getAiringTodayTV = async (): Promise<Movie[]> =>
  mapMovies(await tmdbFetch<TmdbListResponse>("/tv/airing_today"));

export const getTrendingTVPaginated = (page = 1) => paginateEndpoint("/trending/tv/week", page);
export const getPopularTVPaginated = (page = 1) => paginateEndpoint("/tv/popular", page);
export const getTopRatedTVPaginated = (page = 1) => paginateEndpoint("/tv/top_rated", page);
export const getOnAirTVPaginated = (page = 1) => paginateEndpoint("/tv/on_the_air", page);
export const getAiringTodayTVPaginated = (page = 1) => paginateEndpoint("/tv/airing_today", page);

export const getTVDetails = async (id: number): Promise<Movie> => {
  const [detail, credits, videos, reviews, images, keywords, watchProviders] = await Promise.all([
    tmdbFetch<any>(`/tv/${id}`),
    tmdbFetch<TmdbCreditsResponse>(`/tv/${id}/credits`),
    tmdbFetch<TmdbVideosResponse>(`/tv/${id}/videos`),
    tmdbFetch<TmdbReviewsResponse>(`/tv/${id}/reviews`),
    tmdbFetch<TmdbImagesResponse>(`/tv/${id}/images`),
    tmdbFetch<TmdbKeywordsResponse>(`/tv/${id}/keywords`),
    tmdbFetch<TmdbWatchProvidersResponse>(`/tv/${id}/watch/providers`),
  ]);

  return {
    id: detail.id,
    title: detail.name || "",
    overview: detail.overview,
    poster_path: posterUrl(detail.poster_path),
    backdrop_path: backdropUrl(detail.backdrop_path),
    release_date: detail.first_air_date || "",
    vote_average: detail.vote_average,
    genre_ids: (detail.genres || []).map((g: Genre) => g.id),
    runtime: detail.episode_run_time?.[0] || 0,
    genres: detail.genres,
    credits: {
      cast: credits.cast.slice(0, 10).map((c) => ({
        ...c,
        profile_path: profileUrl(c.profile_path),
      })),
    },
    videos: { results: videos.results },
    reviews: reviews.results.slice(0, 5),
    images: [...(images.backdrops || []).slice(0, 12)],
    keywords: keywords.results || keywords.keywords || [],
    watchProviders: extractWatchProviders(watchProviders),
  };
};

export const getSimilarTV = async (id: number): Promise<Movie[]> =>
  mapMovies(await tmdbFetch<TmdbListResponse>(`/tv/${id}/recommendations`));

// ---------- Animation & Documentaries ----------

export const getAnimationMovies = async (): Promise<Movie[]> =>
  mapMovies(await tmdbFetch<TmdbListResponse>("/discover/movie?with_genres=16&sort_by=popularity.desc"));

export const getAnimationTV = async (): Promise<Movie[]> =>
  mapMovies(await tmdbFetch<TmdbListResponse>("/discover/tv?with_genres=16&sort_by=popularity.desc"));

export const getAnimationMoviesPaginated = (page = 1) =>
  paginateEndpoint("/discover/movie?with_genres=16&sort_by=popularity.desc", page);

export const getAnimationTVPaginated = (page = 1) =>
  paginateEndpoint("/discover/tv?with_genres=16&sort_by=popularity.desc", page);

export const getDocumentaryMovies = async (): Promise<Movie[]> =>
  mapMovies(await tmdbFetch<TmdbListResponse>("/discover/movie?with_genres=99&sort_by=popularity.desc"));

export const getDocumentaryTV = async (): Promise<Movie[]> =>
  mapMovies(await tmdbFetch<TmdbListResponse>("/discover/tv?with_genres=99&sort_by=popularity.desc"));

export const getDocumentaryMoviesPaginated = (page = 1) =>
  paginateEndpoint("/discover/movie?with_genres=99&sort_by=popularity.desc", page);

export const getDocumentaryTVPaginated = (page = 1) =>
  paginateEndpoint("/discover/tv?with_genres=99&sort_by=popularity.desc", page);

// ---------- Language-based discovery ----------

export const getMoviesByLanguage = async (lang: string): Promise<Movie[]> =>
  mapMovies(await tmdbFetch<TmdbListResponse>(`/discover/movie?with_original_language=${lang}&sort_by=popularity.desc`));

export const getMoviesByLanguagePaginated = (lang: string, page = 1) =>
  paginateEndpoint(`/discover/movie?with_original_language=${lang}&sort_by=popularity.desc`, page);

// ---------- People / Actors ----------

interface TmdbPersonListResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: Person[];
}

export interface PaginatedPersonResult {
  people: Person[];
  page: number;
  totalPages: number;
  totalResults: number;
}

const mapPeople = (data: TmdbPersonListResponse): Person[] =>
  data.results.map((p) => ({
    ...p,
    profile_path: p.profile_path ? `${IMG_BASE}/w185${p.profile_path}` : null,
    known_for: (p.known_for || []).map((kf) => ({
      ...kf,
      poster_path: kf.poster_path ? posterUrl(kf.poster_path) : null,
    })),
  }));

export const getPopularPeople = async (): Promise<Person[]> =>
  mapPeople(await tmdbFetch<TmdbPersonListResponse>("/person/popular"));

export const getTrendingPeople = async (): Promise<Person[]> =>
  mapPeople(await tmdbFetch<TmdbPersonListResponse>("/trending/person/week"));

export const getPopularPeoplePaginated = async (page = 1): Promise<PaginatedPersonResult> => {
  const data = await tmdbFetch<TmdbPersonListResponse>(`/person/popular?page=${page}`);
  return {
    people: mapPeople(data),
    page: data.page,
    totalPages: Math.min(data.total_pages, 500),
    totalResults: data.total_results,
  };
};

export const getTrendingPeoplePaginated = async (page = 1): Promise<PaginatedPersonResult> => {
  const data = await tmdbFetch<TmdbPersonListResponse>(`/trending/person/week?page=${page}`);
  return {
    people: mapPeople(data),
    page: data.page,
    totalPages: Math.min(data.total_pages, 500),
    totalResults: data.total_results,
  };
};

// ---------- Collections ----------

interface TmdbCollectionDetail {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: Array<{
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

export interface CollectionDetail {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: Movie[];
}

export const getCollectionDetails = async (id: number): Promise<CollectionDetail> => {
  const data = await tmdbFetch<TmdbCollectionDetail>(`/collection/${id}`);
  return {
    id: data.id,
    name: data.name,
    overview: data.overview,
    poster_path: posterUrl(data.poster_path),
    backdrop_path: backdropUrl(data.backdrop_path),
    parts: data.parts.map((m) => ({
      id: m.id,
      title: m.title,
      overview: m.overview,
      poster_path: posterUrl(m.poster_path),
      backdrop_path: backdropUrl(m.backdrop_path),
      release_date: m.release_date || "",
      vote_average: m.vote_average,
      genre_ids: m.genre_ids,
    })),
  };
};
