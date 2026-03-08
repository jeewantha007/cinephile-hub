export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
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

export const genres: Genre[] = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Sci-Fi" },
  { id: 18, name: "Drama" },
  { id: 16, name: "Animation" },
  { id: 10749, name: "Romance" },
  { id: 53, name: "Thriller" },
  { id: 12, name: "Adventure" },
  { id: 14, name: "Fantasy" },
];

const posterBase = "https://image.tmdb.org/t/p/w500";
const backdropBase = "https://image.tmdb.org/t/p/original";

export const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Galactic Horizons",
    overview: "A team of astronauts embarks on a dangerous mission to the edge of the galaxy, where they discover a mysterious signal that could change humanity's understanding of the universe forever.",
    poster_path: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&h=750&fit=crop",
    backdrop_path: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&h=1080&fit=crop",
    release_date: "2025-03-15",
    vote_average: 8.5,
    genre_ids: [878, 12],
    runtime: 148,
    genres: [{ id: 878, name: "Sci-Fi" }, { id: 12, name: "Adventure" }],
    videos: { results: [{ key: "dQw4w9WgXcQ", name: "Official Trailer", type: "Trailer", site: "YouTube" }] },
    credits: {
      cast: [
        { id: 1, name: "Alex Rivera", character: "Captain Kane", profile_path: null },
        { id: 2, name: "Sarah Chen", character: "Dr. Elara", profile_path: null },
        { id: 3, name: "Marcus Webb", character: "Navigator Zed", profile_path: null },
      ],
    },
  },
  {
    id: 2,
    title: "Shadow Protocol",
    overview: "An elite spy must go rogue to uncover a global conspiracy that threatens to plunge the world into chaos. Trust no one.",
    poster_path: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500&h=750&fit=crop",
    backdrop_path: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1920&h=1080&fit=crop",
    release_date: "2025-06-20",
    vote_average: 7.8,
    genre_ids: [28, 53],
    runtime: 132,
    genres: [{ id: 28, name: "Action" }, { id: 53, name: "Thriller" }],
    videos: { results: [{ key: "dQw4w9WgXcQ", name: "Official Trailer", type: "Trailer", site: "YouTube" }] },
    credits: {
      cast: [
        { id: 4, name: "David Kim", character: "Agent Cross", profile_path: null },
        { id: 5, name: "Emily Stone", character: "Director Vale", profile_path: null },
      ],
    },
  },
  {
    id: 3,
    title: "The Last Garden",
    overview: "In a world ravaged by climate change, one woman discovers the last surviving garden and must protect it from those who would exploit its secrets.",
    poster_path: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=500&h=750&fit=crop",
    backdrop_path: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=1920&h=1080&fit=crop",
    release_date: "2025-04-10",
    vote_average: 9.1,
    genre_ids: [18, 878],
    runtime: 156,
    genres: [{ id: 18, name: "Drama" }, { id: 878, name: "Sci-Fi" }],
    videos: { results: [{ key: "dQw4w9WgXcQ", name: "Official Trailer", type: "Trailer", site: "YouTube" }] },
    credits: {
      cast: [
        { id: 6, name: "Maya Johnson", character: "Dr. Iris Vane", profile_path: null },
        { id: 7, name: "Thomas Grant", character: "Councilman Oren", profile_path: null },
      ],
    },
  },
  {
    id: 4,
    title: "Neon Nights",
    overview: "A cyberpunk thriller set in a rain-soaked metropolis where a hacker uncovers a digital underworld threatening to consume reality itself.",
    poster_path: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&h=750&fit=crop",
    backdrop_path: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&h=1080&fit=crop",
    release_date: "2025-07-04",
    vote_average: 8.2,
    genre_ids: [878, 53, 28],
    runtime: 124,
    genres: [{ id: 878, name: "Sci-Fi" }, { id: 53, name: "Thriller" }],
    videos: { results: [{ key: "dQw4w9WgXcQ", name: "Official Trailer", type: "Trailer", site: "YouTube" }] },
    credits: {
      cast: [
        { id: 8, name: "Zara Lee", character: "Pixel", profile_path: null },
        { id: 9, name: "James Ortiz", character: "Detective Noir", profile_path: null },
      ],
    },
  },
  {
    id: 5,
    title: "Echoes of Tomorrow",
    overview: "A time-traveler from the future arrives in present-day Tokyo with a warning: humanity has 48 hours to change its fate.",
    poster_path: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&h=750&fit=crop",
    backdrop_path: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=1080&fit=crop",
    release_date: "2025-09-12",
    vote_average: 7.6,
    genre_ids: [878, 18],
    runtime: 140,
    genres: [{ id: 878, name: "Sci-Fi" }, { id: 18, name: "Drama" }],
    videos: { results: [{ key: "dQw4w9WgXcQ", name: "Official Trailer", type: "Trailer", site: "YouTube" }] },
    credits: {
      cast: [
        { id: 10, name: "Yuki Tanaka", character: "Rei Nakamura", profile_path: null },
        { id: 11, name: "Chris Evans Jr.", character: "Commander Blake", profile_path: null },
      ],
    },
  },
  {
    id: 6,
    title: "Crimson Tide Rising",
    overview: "When a submarine crew discovers a sunken city beneath the ocean, they unleash an ancient force that threatens all life on Earth.",
    poster_path: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=500&h=750&fit=crop",
    backdrop_path: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=1920&h=1080&fit=crop",
    release_date: "2025-11-22",
    vote_average: 7.3,
    genre_ids: [28, 12, 27],
    runtime: 138,
    genres: [{ id: 28, name: "Action" }, { id: 12, name: "Adventure" }],
    videos: { results: [{ key: "dQw4w9WgXcQ", name: "Official Trailer", type: "Trailer", site: "YouTube" }] },
    credits: {
      cast: [
        { id: 12, name: "Ryan Mitchell", character: "Captain Drake", profile_path: null },
        { id: 13, name: "Lena Park", character: "Dr. Marina Solis", profile_path: null },
      ],
    },
  },
  {
    id: 7,
    title: "Laughing Matter",
    overview: "A struggling comedian discovers they can literally make people die of laughter — and a shadowy organization wants to weaponize the gift.",
    poster_path: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&h=750&fit=crop",
    backdrop_path: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&h=1080&fit=crop",
    release_date: "2025-02-14",
    vote_average: 7.9,
    genre_ids: [35, 53],
    runtime: 112,
    genres: [{ id: 35, name: "Comedy" }, { id: 53, name: "Thriller" }],
    videos: { results: [{ key: "dQw4w9WgXcQ", name: "Official Trailer", type: "Trailer", site: "YouTube" }] },
    credits: {
      cast: [
        { id: 14, name: "Jordan Blake", character: "Max Funny", profile_path: null },
        { id: 15, name: "Priya Sharma", character: "Agent Smile", profile_path: null },
      ],
    },
  },
  {
    id: 8,
    title: "Whispers in the Dark",
    overview: "A family moves into a centuries-old mansion only to discover that the house has been waiting for them — and it remembers everything.",
    poster_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&h=750&fit=crop",
    backdrop_path: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&h=1080&fit=crop",
    release_date: "2025-10-31",
    vote_average: 8.0,
    genre_ids: [27, 53],
    runtime: 118,
    genres: [{ id: 27, name: "Horror" }, { id: 53, name: "Thriller" }],
    videos: { results: [{ key: "dQw4w9WgXcQ", name: "Official Trailer", type: "Trailer", site: "YouTube" }] },
    credits: {
      cast: [
        { id: 16, name: "Claire Dunne", character: "Sarah Miller", profile_path: null },
        { id: 17, name: "Oscar Reyes", character: "The Keeper", profile_path: null },
      ],
    },
  },
  {
    id: 9,
    title: "Robot Dreams",
    overview: "In a world where robots have gained sentience, a young robot and a human child form an unlikely friendship that challenges both their worlds.",
    poster_path: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=750&fit=crop",
    backdrop_path: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920&h=1080&fit=crop",
    release_date: "2025-12-25",
    vote_average: 8.8,
    genre_ids: [16, 878, 18],
    runtime: 105,
    genres: [{ id: 16, name: "Animation" }, { id: 878, name: "Sci-Fi" }],
    videos: { results: [{ key: "dQw4w9WgXcQ", name: "Official Trailer", type: "Trailer", site: "YouTube" }] },
    credits: {
      cast: [
        { id: 18, name: "Ava Williams", character: "Bolt (voice)", profile_path: null },
        { id: 19, name: "Sam Taylor", character: "Lily", profile_path: null },
      ],
    },
  },
  {
    id: 10,
    title: "Eternal Flame",
    overview: "Two lovers separated by centuries find each other through a mysterious painting that bridges time itself.",
    poster_path: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=500&h=750&fit=crop",
    backdrop_path: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1920&h=1080&fit=crop",
    release_date: "2025-08-15",
    vote_average: 7.4,
    genre_ids: [10749, 14, 18],
    runtime: 130,
    genres: [{ id: 10749, name: "Romance" }, { id: 14, name: "Fantasy" }],
    videos: { results: [{ key: "dQw4w9WgXcQ", name: "Official Trailer", type: "Trailer", site: "YouTube" }] },
    credits: {
      cast: [
        { id: 20, name: "Isabella Cruz", character: "Elara", profile_path: null },
        { id: 21, name: "Liam Foster", character: "Julian", profile_path: null },
      ],
    },
  },
];

export const trendingMovies = mockMovies.slice(0, 5);
export const popularMovies = mockMovies.slice(2, 8);
export const topRatedMovies = [...mockMovies].sort((a, b) => b.vote_average - a.vote_average).slice(0, 6);
export const upcomingMovies = mockMovies.slice(4, 10);
