import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { getPopularPeoplePaginated, getTrendingPeoplePaginated } from "@/lib/tmdb";
import type { Person } from "@/lib/tmdb";

const PersonCard = ({ person }: { person: Person }) => {
  const knownFor = person.known_for
    ?.map((kf) => kf.title || kf.name)
    .filter(Boolean)
    .slice(0, 2)
    .join(", ");

  return (
    <div className="group bg-card rounded-xl overflow-hidden ring-1 ring-border/30 hover:ring-border/60 transition-all hover:shadow-lg hover:shadow-primary/5">
      <div className="aspect-[2/3] bg-muted overflow-hidden">
        {person.profile_path ? (
          <img
            src={person.profile_path}
            alt={person.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="p-3 space-y-1">
        <h3 className="text-sm font-semibold text-foreground line-clamp-1">{person.name}</h3>
        <p className="text-xs text-muted-foreground">{person.known_for_department}</p>
        {knownFor && (
          <p className="text-xs text-muted-foreground line-clamp-1">Known for: {knownFor}</p>
        )}
      </div>
    </div>
  );
};

const People = () => {
  const [tab, setTab] = useState<"popular" | "trending">("popular");
  const [page, setPage] = useState(1);

  const { data: popularData, isLoading: popularLoading } = useQuery({
    queryKey: ["people-popular", page],
    queryFn: () => getPopularPeoplePaginated(page),
    enabled: tab === "popular",
  });

  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ["people-trending", page],
    queryFn: () => getTrendingPeoplePaginated(page),
    enabled: tab === "trending",
  });

  const currentData = tab === "popular" ? popularData : trendingData;
  const isLoading = tab === "popular" ? popularLoading : trendingLoading;

  const handleTabChange = (newTab: "popular" | "trending") => {
    setTab(newTab);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Popular & Trending Actors | CinemaHub"
        description="Discover popular and trending actors and actresses. Browse profiles and filmographies on CinemaHub."
        canonicalPath="/people"
      />
      <Navbar />

      <div className="pt-24 pb-8 container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">People</h1>

        <div className="flex gap-2 mb-8">
          <Button
            variant={tab === "popular" ? "default" : "outline"}
            onClick={() => handleTabChange("popular")}
            className="gap-2"
          >
            🎬 Popular Actors
          </Button>
          <Button
            variant={tab === "trending" ? "default" : "outline"}
            onClick={() => handleTabChange("trending")}
            className="gap-2"
          >
            🔥 Trending Actors
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-[2/3] rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {currentData?.people.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>

            {currentData && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentData.page} of {currentData.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={page >= currentData.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default People;
