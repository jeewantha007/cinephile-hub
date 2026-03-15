import { Link } from "react-router-dom";
import { Film } from "lucide-react";

const Footer = () => (
  <footer className="bg-card/50 border-t border-border/50 mt-16">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <h3 className="text-xl font-bold mb-3">
            <span className="text-primary">Cinema</span>
            <span className="text-foreground">Hub</span>
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your ultimate destination to discover trending movies, TV shows, trailers, ratings, and download subtitles in 50+ languages.
          </p>
        </div>

        {/* Movies */}
        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm">Movies</h4>
          <div className="space-y-2">
            <Link to="/trending" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Trending Movies</Link>
            <Link to="/popular" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Popular Movies</Link>
            <Link to="/top-rated" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Top Rated Movies</Link>
            <Link to="/upcoming" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Upcoming Movies</Link>
            <Link to="/genres" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Browse by Genre</Link>
          </div>
        </div>

        {/* TV Shows */}
        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm">TV Shows</h4>
          <div className="space-y-2">
            <Link to="/tv-shows" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">All TV Shows</Link>
            <Link to="/tv-shows/trending" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Trending TV Shows</Link>
            <Link to="/tv-shows/popular" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Popular TV Shows</Link>
            <Link to="/tv-shows/top-rated" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Top Rated TV Shows</Link>
            <Link to="/tv-shows/on-air" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Currently On Air</Link>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm">Explore</h4>
          <div className="space-y-2">
            <Link to="/animation" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Animation</Link>
            <Link to="/documentaries" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Documentaries</Link>
            <Link to="/languages" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">By Language</Link>
            <Link to="/people" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Popular People</Link>
            <Link to="/search" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Search</Link>
            <Link to="/subtitles" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Download Subtitles</Link>
            <Link to="/blog" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm">Company</h4>
          <div className="space-y-2">
            <Link to="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
            <Link to="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            <Link to="/privacy-policy" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
          <div className="flex items-start gap-2 mt-4">
            <Film className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-border/50 mt-8 pt-6 text-center">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} CinemaHub. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
