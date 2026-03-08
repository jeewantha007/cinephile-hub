import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-secondary/50 border-t border-border mt-16">
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-bold text-primary mb-3">CineVault</h3>
          <p className="text-sm text-muted-foreground">Your ultimate movie discovery destination.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm">Navigate</h4>
          <div className="space-y-2">
            <Link to="/" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link to="/genres" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Genres</Link>
            <Link to="/search" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Search</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm">Legal</h4>
          <div className="space-y-2">
            <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
            <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3 text-sm">Attribution</h4>
          <p className="text-xs text-muted-foreground">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
      </div>
      <div className="border-t border-border mt-8 pt-6 text-center">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} CineVault. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
