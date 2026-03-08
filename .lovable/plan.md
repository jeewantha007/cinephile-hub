

# Movie Discovery Website — Implementation Plan

## API Key Decision Needed

Before implementation, I need to know how you want to handle TMDB data. Since storing API keys requires Supabase or Cloud connection:

**Option A:** Use mock/sample movie data initially (build the full UI now, swap in real API later)
**Option B:** Connect to Supabase/Cloud first, then store your TMDB API key as a secret

I'll proceed with **mock data** that mirrors the TMDB API response shape, making it trivial to swap in real data later.

---

## What Gets Built

### Design System Updates (`index.css`, `tailwind.config.ts`)
- Dark theme: bg `#0f172a`, cards `#1e293b`, accent `#ef4444`
- Custom animations: hover zoom, fade-in, slide transitions

### Shared Components
- **Navbar** — sticky, logo, search input, language dropdown
- **Footer** — links + TMDB attribution
- **MovieCard** — poster, title, rating badge, year, hover zoom + overlay
- **MovieRow** — horizontal scroll container with title and arrow navigation
- **HeroSection** — full-width backdrop, title, description, "Watch Trailer" button

### Pages & Routes
| Route | Page |
|-------|------|
| `/` | Home — Hero + 4 movie rows (Trending, Popular, Top Rated, Upcoming) |
| `/movie/:id` | Details — backdrop, poster, info, trailer embed, cast, similar movies |
| `/search` | Search — search bar + results grid |
| `/genres` | Genre grid; `/genres/:id` shows filtered movies |

### Data Layer
- `src/data/mockMovies.ts` — sample movie objects matching TMDB shape
- `src/lib/tmdb.ts` — API helper functions (mock now, real API later)
- React Query hooks for fetching with caching and loading states

### File Structure
```
src/
  components/
    Navbar.tsx
    Footer.tsx
    MovieCard.tsx
    MovieRow.tsx
    HeroSection.tsx
  data/
    mockMovies.ts
  lib/
    tmdb.ts
  pages/
    Index.tsx (Home)
    MovieDetails.tsx
    Search.tsx
    Genres.tsx
```

### Responsive Behavior
- Mobile: stacked layout, 2-column grid, hamburger menu
- Tablet: 3-column grid
- Desktop: full horizontal scroll rows, large hero

Total: ~12 files created/modified.

