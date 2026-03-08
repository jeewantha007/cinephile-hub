import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import MovieRow from "@/components/MovieRow";
import { getTrending, getPopular, getTopRated, getUpcoming } from "@/lib/tmdb";

const Index = () => {
  const { data: trending = [] } = useQuery({ queryKey: ["trending"], queryFn: getTrending });
  const { data: popular = [] } = useQuery({ queryKey: ["popular"], queryFn: getPopular });
  const { data: topRated = [] } = useQuery({ queryKey: ["topRated"], queryFn: getTopRated });
  const { data: upcoming = [] } = useQuery({ queryKey: ["upcoming"], queryFn: getUpcoming });

  const heroMovie = trending[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {heroMovie && <HeroSection movie={heroMovie} />}
      <main className="container mx-auto px-0 md:px-4 space-y-10 py-8">
        <MovieRow title="🔥 Trending Now" movies={trending} />
        <MovieRow title="🎬 Popular" movies={popular} />
        <MovieRow title="⭐ Top Rated" movies={topRated} />
        <MovieRow title="🎞️ Upcoming" movies={upcoming} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
