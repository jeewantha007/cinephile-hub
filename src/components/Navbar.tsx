import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, Globe, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setMenuOpen(false);
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/genres", label: "Genres" },
    { to: "/tv-shows", label: "TV Shows" },
    { to: "/search", label: "Search" },
  ];

  const browseLinks = [
    { to: "/trending", label: "🔥 Trending" },
    { to: "/popular", label: "🎬 Popular" },
    { to: "/top-rated", label: "⭐ Top Rated" },
    { to: "/upcoming", label: "🎞️ Upcoming" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="text-2xl font-bold tracking-tight shrink-0">
          <span className="text-primary">Cinema</span>
          <span className="text-foreground">Hub</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
          {/* Browse dropdown */}
          <div className="relative" onMouseEnter={() => setBrowseOpen(true)} onMouseLeave={() => setBrowseOpen(false)}>
            <button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 transition-all duration-200 flex items-center gap-1">
              Browse <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {browseOpen && (
              <div className="absolute top-full left-0 mt-1 bg-card border border-border/50 rounded-xl shadow-xl py-2 min-w-[180px] animate-fade-in">
                {browseLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setBrowseOpen(false)}
                    className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search + actions */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-md justify-end">
          <form onSubmit={handleSearch} className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-9 pl-10 pr-4 rounded-lg bg-muted/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-muted transition-all duration-200"
            />
          </form>
          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted/50">
            <Globe className="h-4 w-4" />
            <span className="text-xs">EN</span>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-foreground p-1">
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-t border-border/50 px-4 py-4 space-y-3 animate-fade-in">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </form>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="block text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-border/50 pt-2">
            <p className="text-xs text-muted-foreground px-3 py-1 uppercase tracking-wider">Browse</p>
            {browseLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="block text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-md hover:bg-muted/50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
