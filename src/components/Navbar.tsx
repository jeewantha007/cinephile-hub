import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [moviesOpen, setMoviesOpen] = useState(false);
  const [tvOpen, setTvOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setMenuOpen(false);
    }
  };

  const movieLinks = [
    { to: "/movies", label: "All Movies" },
    { to: "/trending", label: "🔥 Trending" },
    { to: "/popular", label: "🎬 Popular" },
    { to: "/top-rated", label: "⭐ Top Rated" },
    { to: "/upcoming", label: "🎞️ Upcoming" },
  ];

  const tvLinks = [
    { to: "/tv-shows", label: "All TV Shows" },
    { to: "/tv-shows/trending", label: "🔥 Trending" },
    { to: "/tv-shows/popular", label: "🎬 Popular" },
    { to: "/tv-shows/top-rated", label: "⭐ Top Rated" },
    { to: "/tv-shows/on-air", label: "📡 On Air" },
    { to: "/tv-shows/airing-today", label: "📺 Airing Today" },
  ];

  const navLinks = [
    { to: "/animation", label: "Animation" },
    { to: "/documentaries", label: "Documentaries" },
    { to: "/genres", label: "Genres" },
    { to: "/languages", label: "Languages" },
  ];

  const DropdownMenu = ({
    label,
    links,
    open,
    onOpen,
    onClose,
  }: {
    label: string;
    links: { to: string; label: string }[];
    open: boolean;
    onOpen: () => void;
    onClose: () => void;
  }) => (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 transition-all duration-200 flex items-center gap-1">
        {label} <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-card border border-border/50 rounded-xl shadow-xl py-2 min-w-[180px] animate-fade-in z-50">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="text-2xl font-bold tracking-tight shrink-0">
          <span className="text-primary">Cinema</span>
          <span className="text-foreground">Hub</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5">
          <Link to="/" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 transition-all duration-200">
            Home
          </Link>
          <DropdownMenu
            label="Movies"
            links={movieLinks}
            open={moviesOpen}
            onOpen={() => setMoviesOpen(true)}
            onClose={() => setMoviesOpen(false)}
          />
          <DropdownMenu
            label="TV Shows"
            links={tvLinks}
            open={tvOpen}
            onOpen={() => setTvOpen(true)}
            onClose={() => setTvOpen(false)}
          />
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-xs justify-end">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search movies & shows..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-9 pl-10 pr-4 rounded-lg bg-muted/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-muted transition-all duration-200"
            />
          </form>
        </div>

        {/* Mobile menu toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-foreground p-1">
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-lg border-t border-border/50 px-4 py-4 space-y-1 animate-fade-in max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSearch} className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search movies & shows..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-muted/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </form>
          <Link to="/" onClick={() => setMenuOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-md hover:bg-muted/50 transition-colors">
            Home
          </Link>
          <div className="border-t border-border/50 pt-2 mt-2">
            <p className="text-xs text-muted-foreground px-3 py-1 uppercase tracking-wider">Movies</p>
            {movieLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-md hover:bg-muted/50 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-border/50 pt-2 mt-2">
            <p className="text-xs text-muted-foreground px-3 py-1 uppercase tracking-wider">TV Shows</p>
            {tvLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-md hover:bg-muted/50 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-border/50 pt-2 mt-2">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-md hover:bg-muted/50 transition-colors">
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
