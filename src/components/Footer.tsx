import { Link } from "react-router-dom";
import { Film } from "lucide-react";

const Footer = () => (
  <footer className="bg-card/50 border-t border-border/50 mt-12 sm:mt-16">
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        <div className="col-span-2 sm:col-span-1">
          <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
            <span className="text-primary">Cinema</span>
            <span className="text-foreground">Hub</span>
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            CinemaHub helps users discover trending movies, explore detailed movie information, and watch trailers using data from TMDB.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-2 sm:mb-3 text-xs sm:text-sm">Navigate</h4>
          <div className="space-y-1.5 sm:space-y-2">
            <Link to="/" className="block text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link to="/genres" className="block text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Genres</Link>
            <Link to="/search" className="block text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Search</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-2 sm:mb-3 text-xs sm:text-sm">Company</h4>
          <div className="space-y-1.5 sm:space-y-2">
            <Link to="/about" className="block text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <Link to="/contact" className="block text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            <Link to="/privacy-policy" className="block text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="block text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <h4 className="font-semibold text-foreground mb-2 sm:mb-3 text-xs sm:text-sm">Attribution</h4>
          <div className="flex items-start gap-2">
            <Film className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-border/50 mt-6 sm:mt-8 pt-4 sm:pt-6 text-center">
        <p className="text-[10px] sm:text-xs text-muted-foreground">&copy; {new Date().getFullYear()} CinemaHub. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
