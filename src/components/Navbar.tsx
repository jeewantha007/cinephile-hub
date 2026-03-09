import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Menu, X, ChevronDown, Film, Tv, Sparkles, BookOpen, Globe, Users, Flame, Star, Clock, Radio, MonitorPlay } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { searchMulti, posterUrl, profileUrl } from "@/lib/tmdb";
import { slugify } from "@/lib/slugs";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: suggestions = [], isFetching } = useQuery({
    queryKey: ["search-suggestions", debouncedQuery],
    queryFn: () => searchMulti(debouncedQuery),
    enabled: debouncedQuery.length > 2,
  });

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setMenuOpen(false);
      setSearchFocused(false);
    }
  };

  const openDropdown = (key: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(key);
  };

  const closeDropdown = () => {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  const movieLinks = [
    { to: "/movies", label: "All Movies", icon: Film },
    { to: "/trending", label: "Trending", icon: Flame },
    { to: "/popular", label: "Popular", icon: Sparkles },
    { to: "/top-rated", label: "Top Rated", icon: Star },
    { to: "/upcoming", label: "Upcoming", icon: Clock },
  ];

  const tvLinks = [
    { to: "/tv-shows", label: "All TV Shows", icon: Tv },
    { to: "/tv-shows/trending", label: "Trending", icon: Flame },
    { to: "/tv-shows/popular", label: "Popular", icon: Sparkles },
    { to: "/tv-shows/top-rated", label: "Top Rated", icon: Star },
    { to: "/tv-shows/on-air", label: "On Air", icon: Radio },
    { to: "/tv-shows/airing-today", label: "Airing Today", icon: MonitorPlay },
  ];

  const navLinks = [
    { to: "/animation", label: "Animation", icon: Sparkles },
    { to: "/documentaries", label: "Docs", icon: BookOpen },
    { to: "/genres", label: "Genres", icon: Film },
    { to: "/languages", label: "Languages", icon: Globe },
    { to: "/people", label: "People", icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/40">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link to="/" className="shrink-0 flex items-center gap-0.5 group">
          <span className="text-2xl font-extrabold tracking-tight text-primary">Cinema</span>
          <span className="text-2xl font-light tracking-tight text-foreground">Hub</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
          <Link
            to="/"
            className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
              isActive("/") ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            Home
          </Link>

          {/* Movies Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => openDropdown("movies")}
            onMouseLeave={closeDropdown}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === "movies" ? null : "movies")}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 flex items-center gap-1 ${
                activeDropdown === "movies" || location.pathname.startsWith("/movie") || location.pathname === "/trending" || location.pathname === "/popular" || location.pathname === "/top-rated" || location.pathname === "/upcoming"
                  ? "text-foreground bg-muted"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              Movies
              <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${activeDropdown === "movies" ? "rotate-180" : ""}`} />
            </button>
            {activeDropdown === "movies" && (
              <div className="absolute top-full left-0 mt-1.5 bg-card border border-border/60 rounded-xl shadow-2xl shadow-black/40 py-1.5 min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                {movieLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-2.5 px-3.5 py-2 text-sm transition-colors rounded-lg mx-1.5 ${
                        isActive(link.to) ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 text-primary/70" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* TV Shows Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => openDropdown("tv")}
            onMouseLeave={closeDropdown}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === "tv" ? null : "tv")}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 flex items-center gap-1 ${
                activeDropdown === "tv" || location.pathname.startsWith("/tv")
                  ? "text-foreground bg-muted"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              TV Shows
              <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${activeDropdown === "tv" ? "rotate-180" : ""}`} />
            </button>
            {activeDropdown === "tv" && (
              <div className="absolute top-full left-0 mt-1.5 bg-card border border-border/60 rounded-xl shadow-2xl shadow-black/40 py-1.5 min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                {tvLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-2.5 px-3.5 py-2 text-sm transition-colors rounded-lg mx-1.5 ${
                        isActive(link.to) ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 text-primary/70" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                isActive(link.to) ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center shrink-0">
          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              className={`h-8 pl-8 pr-3 rounded-lg bg-muted/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:bg-muted transition-all duration-200 ${
                searchFocused ? "w-64" : "w-40"
              }`}
            />
            {/* Suggestions Dropdown */}
            {searchFocused && debouncedQuery.length > 2 && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-card border border-border/60 rounded-xl shadow-2xl shadow-black/40 py-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50 overflow-hidden">
                {isFetching ? (
                  <div className="px-4 py-3 text-sm text-muted-foreground text-center">Searching...</div>
                ) : suggestions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-muted-foreground text-center">No results found.</div>
                ) : (
                  <div className="flex flex-col max-h-[60vh] overflow-y-auto">
                    {suggestions.map((item) => {
                      const link = item.media_type === "movie" 
                        ? `/movie/${slugify(item.title, item.id)}` 
                        : item.media_type === "tv"
                        ? `/tv/${slugify(item.title, item.id)}`
                        : `/person/${slugify(item.title, item.id)}`;
                        
                      const image = item.media_type === "person" 
                        ? profileUrl(item.profile_path, "w45") 
                        : posterUrl(item.poster_path, "w92");

                      return (
                        <Link
                          key={`${item.media_type}-${item.id}`}
                          to={link}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-muted/50 transition-colors"
                          onClick={() => {
                            setSearchFocused(false);
                            setQuery("");
                          }}
                        >
                          <div className="w-8 h-12 rounded bg-muted overflow-hidden shrink-0">
                            {image && image !== "/placeholder.svg" ? (
                              <img src={image} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-muted">
                                {item.media_type === "person" ? <Users className="h-4 w-4 text-muted-foreground" /> : <Film className="h-4 w-4 text-muted-foreground" />}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium truncate text-foreground">{item.title}</span>
                            <span className="text-xs text-muted-foreground capitalize">
                              {item.media_type === "movie" && item.release_date?.substring(0, 4)}
                              {item.media_type === "tv" && `TV Show ${item.release_date ? `(${item.release_date.substring(0, 4)})` : ""}`}
                              {item.media_type === "person" && `Person ${item.known_for_department ? `(${item.known_for_department})` : ""}`}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
                <div className="border-t border-border/40 mt-1">
                  <button 
                    type="submit" 
                    className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-muted/50 transition-colors font-medium"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSearch(e as any);
                    }}
                  >
                    View all results for "{query}"
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-foreground p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-background border-t border-border/40 animate-in slide-in-from-top-2 duration-200">
          <div className="container mx-auto px-4 py-3 space-y-1 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative mb-3 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search movies, shows, people..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              
              {/* Mobile Suggestions */}
              {searchFocused && debouncedQuery.length > 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/60 rounded-xl shadow-xl py-2 z-50 max-h-[50vh] overflow-y-auto">
                  {isFetching ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground text-center">Searching...</div>
                  ) : suggestions.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground text-center">No results found.</div>
                  ) : (
                    <div className="flex flex-col">
                      {suggestions.map((item) => {
                        const link = item.media_type === "movie" 
                          ? `/movie/${slugify(item.title, item.id)}` 
                          : item.media_type === "tv"
                          ? `/tv/${slugify(item.title, item.id)}`
                          : `/person/${slugify(item.title, item.id)}`;
                          
                        const image = item.media_type === "person" 
                          ? profileUrl(item.profile_path, "w45") 
                          : posterUrl(item.poster_path, "w92");

                        return (
                          <Link
                            key={`m-${item.media_type}-${item.id}`}
                            to={link}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-muted/50 transition-colors"
                            onClick={() => {
                              setSearchFocused(false);
                              setMenuOpen(false);
                              setQuery("");
                            }}
                          >
                            <div className="w-10 h-14 rounded bg-muted overflow-hidden shrink-0">
                              {image && image !== "/placeholder.svg" ? (
                                <img src={image} alt={item.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-muted">
                                  {item.media_type === "person" ? <Users className="h-5 w-5 text-muted-foreground" /> : <Film className="h-5 w-5 text-muted-foreground" />}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span className="text-sm font-medium truncate text-foreground">{item.title}</span>
                              <span className="text-xs text-muted-foreground capitalize">
                                {item.media_type === "movie" && item.release_date?.substring(0, 4)}
                                {item.media_type === "tv" && `TV Show ${item.release_date ? `(${item.release_date.substring(0, 4)})` : ""}`}
                                {item.media_type === "person" && `Person ${item.known_for_department ? `(${item.known_for_department})` : ""}`}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                      <button 
                        type="submit" 
                        className="w-full text-left px-4 py-3 mt-1 text-sm text-primary border-t border-border/40 hover:bg-muted/50 transition-colors font-medium"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSearch(e as any);
                        }}
                      >
                        View all results for "{query}"
                      </button>
                    </div>
                  )}
                </div>
              )}
            </form>

            <Link to="/" className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${isActive("/") ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
              Home
            </Link>

            {/* Movies Accordion */}
            <div>
              <button
                onClick={() => setActiveDropdown(activeDropdown === "m-movies" ? null : "m-movies")}
                className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Film className="h-4 w-4 text-primary/70" />
                  Movies
                </span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === "m-movies" ? "rotate-180" : ""}`} />
              </button>
              {activeDropdown === "m-movies" && (
                <div className="ml-4 pl-3 border-l border-border/40 space-y-0.5 py-1 animate-in slide-in-from-top-1 duration-150">
                  {movieLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive(link.to) ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5 text-primary/70" />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* TV Shows Accordion */}
            <div>
              <button
                onClick={() => setActiveDropdown(activeDropdown === "m-tv" ? null : "m-tv")}
                className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Tv className="h-4 w-4 text-primary/70" />
                  TV Shows
                </span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === "m-tv" ? "rotate-180" : ""}`} />
              </button>
              {activeDropdown === "m-tv" && (
                <div className="ml-4 pl-3 border-l border-border/40 space-y-0.5 py-1 animate-in slide-in-from-top-1 duration-150">
                  {tvLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive(link.to) ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5 text-primary/70" />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-border/40 pt-1.5 mt-1.5 space-y-0.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      isActive(link.to) ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon className="h-4 w-4 text-primary/70" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
