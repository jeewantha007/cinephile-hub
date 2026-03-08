import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Search from "./pages/Search";
import Genres from "./pages/Genres";
import CategoryPage from "./pages/CategoryPage";
import TVShows from "./pages/TVShows";
import TVCategoryPage from "./pages/TVCategoryPage";
import TVDetails from "./pages/TVDetails";
import Animation from "./pages/Animation";
import Documentaries from "./pages/Documentaries";
import Languages from "./pages/Languages";
import People from "./pages/People";
import CollectionPage from "./pages/CollectionPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/search" element={<Search />} />
          <Route path="/genres" element={<Genres />} />
          <Route path="/trending" element={<CategoryPage category="trending" />} />
          <Route path="/popular" element={<CategoryPage category="popular" />} />
          <Route path="/top-rated" element={<CategoryPage category="top-rated" />} />
          <Route path="/upcoming" element={<CategoryPage category="upcoming" />} />
          <Route path="/tv-shows" element={<TVShows />} />
          <Route path="/tv-shows/trending" element={<TVCategoryPage category="trending" />} />
          <Route path="/tv-shows/popular" element={<TVCategoryPage category="popular" />} />
          <Route path="/tv-shows/top-rated" element={<TVCategoryPage category="top-rated" />} />
          <Route path="/tv-shows/on-air" element={<TVCategoryPage category="on-air" />} />
          <Route path="/tv-shows/airing-today" element={<TVCategoryPage category="airing-today" />} />
          <Route path="/tv/:id" element={<TVDetails />} />
          <Route path="/animation" element={<Animation />} />
          <Route path="/documentaries" element={<Documentaries />} />
          <Route path="/languages" element={<Languages />} />
          <Route path="/people" element={<People />} />
          <Route path="/collection/:id" element={<CollectionPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
