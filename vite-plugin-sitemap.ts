import type { Plugin } from "vite";

const DOMAIN = "https://cinemahub.space";
const TMDB_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMmY2ZTg0Nzg5NDViNzQ5YTdjYTUyYzMzNmM5NjZmZiIsIm5iZiI6MTc3Mjk0NjYxNC4wMzQsInN1YiI6IjY5YWQwNGI2ZmQxNGMxZWFkM2MxYzIwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.h9scsVziPaXqnDnmm2POuc0DrP3_Mn33IxCnYM2kDnw";
const BASE = "https://api.themoviedb.org/3";
const headers = {
  Authorization: `Bearer ${TMDB_TOKEN}`,
  "Content-Type": "application/json",
};

const today = new Date().toISOString().split("T")[0];

function slugify(title: string, id: number): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug}-${id}`;
}

async function tmdbFetch(path: string): Promise<any> {
  const res = await fetch(`${BASE}${path}`, { headers });
  if (!res.ok) return { results: [] };
  return res.json();
}

async function fetchPages(endpoint: string, maxPages: number) {
  const items: Array<{ id: number; title?: string; name?: string }> = [];
  for (let p = 1; p <= maxPages; p++) {
    const sep = endpoint.includes("?") ? "&" : "?";
    const data: any = await tmdbFetch(`${endpoint}${sep}page=${p}`);
    if (!data.results?.length) break;
    items.push(...data.results);
  }
  return items;
}

function buildUrlEntries(
  urls: Array<{ loc: string; changefreq: string; priority: string }>
): string {
  return urls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join("\n");
}

function wrapUrlset(entries: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}

function buildSitemapIndex(sitemaps: string[]): string {
  const entries = sitemaps
    .map(
      (s) => `  <sitemap>
    <loc>${DOMAIN}/${s}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;
}

const STATIC_ROUTES = [
  { loc: `${DOMAIN}/`, changefreq: "daily", priority: "1.0" },
  { loc: `${DOMAIN}/movies`, changefreq: "daily", priority: "0.9" },
  { loc: `${DOMAIN}/tv-shows`, changefreq: "daily", priority: "0.9" },
  { loc: `${DOMAIN}/genres`, changefreq: "weekly", priority: "0.8" },
  { loc: `${DOMAIN}/trending`, changefreq: "daily", priority: "0.8" },
  { loc: `${DOMAIN}/popular`, changefreq: "daily", priority: "0.8" },
  { loc: `${DOMAIN}/top-rated`, changefreq: "weekly", priority: "0.8" },
  { loc: `${DOMAIN}/upcoming`, changefreq: "daily", priority: "0.8" },
  { loc: `${DOMAIN}/tv-shows/trending`, changefreq: "daily", priority: "0.7" },
  { loc: `${DOMAIN}/tv-shows/popular`, changefreq: "daily", priority: "0.7" },
  { loc: `${DOMAIN}/tv-shows/top-rated`, changefreq: "weekly", priority: "0.7" },
  { loc: `${DOMAIN}/tv-shows/on-air`, changefreq: "daily", priority: "0.7" },
  { loc: `${DOMAIN}/tv-shows/airing-today`, changefreq: "daily", priority: "0.7" },
  { loc: `${DOMAIN}/animation`, changefreq: "weekly", priority: "0.7" },
  { loc: `${DOMAIN}/documentaries`, changefreq: "weekly", priority: "0.7" },
  { loc: `${DOMAIN}/languages`, changefreq: "weekly", priority: "0.7" },
  { loc: `${DOMAIN}/people`, changefreq: "weekly", priority: "0.7" },
  { loc: `${DOMAIN}/search`, changefreq: "weekly", priority: "0.6" },
  { loc: `${DOMAIN}/about`, changefreq: "monthly", priority: "0.5" },
  { loc: `${DOMAIN}/contact`, changefreq: "monthly", priority: "0.5" },
  { loc: `${DOMAIN}/privacy-policy`, changefreq: "monthly", priority: "0.3" },
  { loc: `${DOMAIN}/terms`, changefreq: "monthly", priority: "0.3" },
];

const LANGUAGES = [
  { code: "en", name: "english" },
  { code: "ko", name: "korean" },
  { code: "ja", name: "japanese" },
  { code: "hi", name: "hindi" },
  { code: "es", name: "spanish" },
  { code: "fr", name: "french" },
  { code: "de", name: "german" },
  { code: "zh", name: "chinese" },
  { code: "pt", name: "portuguese" },
  { code: "it", name: "italian" },
  { code: "tr", name: "turkish" },
  { code: "th", name: "thai" },
];

export function sitemapPlugin(): Plugin {
  return {
    name: "vite-plugin-sitemap",
    apply: "build",
    async closeBundle() {
      const fs = await import("fs");
      const path = await import("path");
      const outDir = path.resolve("dist");

      console.log("[sitemap] Generating sitemaps from TMDB...");

      try {
        // --- Fetch movies (250 pages each from 4 endpoints = ~5000+ unique movies) ---
        const movieEndpoints = [
          "/movie/popular",
          "/movie/top_rated",
          "/movie/upcoming",
          "/trending/movie/week",
        ];
        const movieMap = new Map<number, string>();
        for (const ep of movieEndpoints) {
          const items = await fetchPages(ep, 250);
          items.forEach((m) => {
            if (!movieMap.has(m.id)) movieMap.set(m.id, m.title || "movie");
          });
        }
        const movieUrls = Array.from(movieMap.entries())
          .slice(0, 5000)
          .map(([id, title]) => ({
            loc: `${DOMAIN}/movie/${slugify(title, id)}`,
            changefreq: "weekly",
            priority: "0.8",
          }));

        // --- Fetch TV shows ---
        const tvEndpoints = [
          "/tv/popular",
          "/tv/top_rated",
          "/trending/tv/week",
          "/tv/on_the_air",
        ];
        const tvMap = new Map<number, string>();
        for (const ep of tvEndpoints) {
          const items = await fetchPages(ep, 250);
          items.forEach((m) => {
            if (!tvMap.has(m.id)) tvMap.set(m.id, m.name || m.title || "show");
          });
        }
        const tvUrls = Array.from(tvMap.entries())
          .slice(0, 5000)
          .map(([id, title]) => ({
            loc: `${DOMAIN}/tv/${slugify(title, id)}`,
            changefreq: "weekly",
            priority: "0.8",
          }));

        // --- Fetch actors ---
        const actorItems = await fetchPages("/person/popular", 250);
        const actorUrls = actorItems.slice(0, 5000).map((p) => ({
          loc: `${DOMAIN}/person/${slugify(p.name || "actor", p.id)}`,
          changefreq: "monthly",
          priority: "0.6",
        }));

        // --- Genres ---
        const genreData = await tmdbFetch("/genre/movie/list");
        const genreUrls = (genreData.genres || []).map(
          (g: { id: number; name: string }) => ({
            loc: `${DOMAIN}/genres/${g.name.toLowerCase().replace(/\s+/g, "-")}`,
            changefreq: "monthly",
            priority: "0.7",
          })
        );

        // --- Languages ---
        const langUrls = LANGUAGES.map((l) => ({
          loc: `${DOMAIN}/languages/${l.name}`,
          changefreq: "monthly",
          priority: "0.6",
        }));

        // --- Write sitemaps ---
        const sitemapStatic = wrapUrlset(buildUrlEntries(STATIC_ROUTES));
        const sitemapMovies = wrapUrlset(buildUrlEntries(movieUrls));
        const sitemapTV = wrapUrlset(buildUrlEntries(tvUrls));
        const sitemapActors = wrapUrlset(buildUrlEntries(actorUrls));
        const sitemapGenres = wrapUrlset(
          buildUrlEntries([...genreUrls, ...langUrls])
        );

        const files: Record<string, string> = {
          "sitemap-static.xml": sitemapStatic,
          "sitemap-movies.xml": sitemapMovies,
          "sitemap-tv.xml": sitemapTV,
          "sitemap-actors.xml": sitemapActors,
          "sitemap-genres.xml": sitemapGenres,
        };

        const sitemapIndex = buildSitemapIndex(Object.keys(files));

        fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemapIndex);
        for (const [name, content] of Object.entries(files)) {
          fs.writeFileSync(path.join(outDir, name), content);
        }

        // --- Write robots.txt ---
        const robots = `User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Allow: /

Sitemap: ${DOMAIN}/sitemap.xml`;
        fs.writeFileSync(path.join(outDir, "robots.txt"), robots);

        console.log(
          `[sitemap] Generated: sitemap.xml index + ${Object.keys(files).length} sub-sitemaps (${movieUrls.length} movies, ${tvUrls.length} TV, ${actorUrls.length} actors, ${genreUrls.length} genres, ${langUrls.length} languages)`
        );
      } catch (err) {
        console.error("[sitemap] Error generating sitemaps:", err);
        // Fallback: write static-only sitemap
        const fs2 = await import("fs");
        const path2 = await import("path");
        fs2.writeFileSync(
          path2.join(outDir, "sitemap.xml"),
          wrapUrlset(buildUrlEntries(STATIC_ROUTES))
        );
        console.log("[sitemap] Wrote fallback static sitemap.");
      }
    },
  };
}
