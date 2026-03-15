import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Calendar, Clock, ArrowRight } from "lucide-react";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
}

const blogPosts: BlogPost[] = [
  {
    slug: "best-action-movies-2025",
    title: "25 Best Action Movies of 2025 You Can't Miss",
    excerpt: "From explosive blockbusters to edge-of-your-seat thrillers, these are the must-watch action movies of 2025 that dominated the box office and critics' lists alike.",
    date: "2025-12-15",
    readTime: "8 min read",
    category: "Action",
  },
  {
    slug: "top-tv-shows-to-binge-watch",
    title: "Top 20 TV Shows to Binge-Watch This Weekend",
    excerpt: "Looking for your next binge? We've curated the best TV shows across drama, comedy, sci-fi, and thriller genres that are perfect for a weekend marathon.",
    date: "2025-11-28",
    readTime: "10 min read",
    category: "TV Shows",
  },
  {
    slug: "how-to-download-subtitles",
    title: "How to Download Subtitles for Any Movie or TV Show",
    excerpt: "A complete guide to downloading subtitles in 50+ languages for movies and TV episodes. Learn about SRT files, subtitle formats, and the best sources.",
    date: "2025-11-10",
    readTime: "6 min read",
    category: "Guide",
  },
  {
    slug: "best-horror-movies-all-time",
    title: "50 Best Horror Movies of All Time – Ultimate Ranking",
    excerpt: "From classic slashers to modern psychological horror, this definitive ranking covers the scariest movies ever made. Perfect for horror enthusiasts and newcomers alike.",
    date: "2025-10-31",
    readTime: "15 min read",
    category: "Horror",
  },
  {
    slug: "upcoming-movies-2026",
    title: "Most Anticipated Movies Coming in 2026",
    excerpt: "A preview of the biggest upcoming movies in 2026 including sequels, reboots, and original films from Marvel, DC, Disney, and more major studios.",
    date: "2025-12-20",
    readTime: "12 min read",
    category: "Preview",
  },
  {
    slug: "best-sci-fi-movies-2025",
    title: "Best Sci-Fi Movies of 2025 – Must-Watch Space & Futuristic Films",
    excerpt: "From mind-bending time travel to epic space operas, these are the best science fiction movies of 2025 that pushed the boundaries of imagination and technology.",
    date: "2025-12-10",
    readTime: "9 min read",
    category: "Sci-Fi",
  },
  {
    slug: "top-korean-dramas-to-watch",
    title: "Top 15 Korean Dramas to Watch in 2025 – K-Drama Guide",
    excerpt: "Discover the most addictive Korean dramas of 2025. From romance and thriller to historical epics, these K-dramas captivated millions of viewers worldwide.",
    date: "2025-11-20",
    readTime: "11 min read",
    category: "K-Drama",
  },
  {
    slug: "best-thriller-movies-netflix",
    title: "20 Best Thriller Movies on Streaming Platforms Right Now",
    excerpt: "Looking for edge-of-your-seat suspense? These are the best thriller movies available on streaming platforms in 2025, from psychological thrillers to crime dramas.",
    date: "2025-10-15",
    readTime: "8 min read",
    category: "Thriller",
  },
  {
    slug: "best-romance-movies-all-time",
    title: "30 Best Romance Movies of All Time – Love Stories That Define Cinema",
    excerpt: "From classic Hollywood love stories to modern rom-coms and international romance films, these are the greatest love stories ever told on screen.",
    date: "2025-09-28",
    readTime: "12 min read",
    category: "Romance",
  },
  {
    slug: "best-anime-movies-beginners",
    title: "Best Anime Movies for Beginners – Where to Start Watching Anime",
    excerpt: "New to anime? Start with these acclaimed anime movies that are perfect entry points. From Studio Ghibli classics to modern masterpieces that will make you a fan.",
    date: "2025-08-20",
    readTime: "9 min read",
    category: "Anime",
  },
  {
    slug: "best-movies-with-subtitles",
    title: "Best Foreign Language Movies to Watch with Subtitles in 2025",
    excerpt: "Explore the best international cinema from Korea, Japan, France, Spain, India, and more. These subtitle-worthy films prove great storytelling has no language barrier.",
    date: "2025-07-15",
    readTime: "10 min read",
    category: "International",
  },
];

const Blog = () => {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "CinemaHub Blog",
      description: "Movie reviews, TV show guides, subtitle tips, and entertainment news from CinemaHub.",
      url: "https://cinemahub.space/blog",
      publisher: {
        "@type": "Organization",
        name: "CinemaHub",
        url: "https://cinemahub.space",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://cinemahub.space/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "https://cinemahub.space/blog" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Blog – Movie Reviews, TV Guides & Entertainment News | CinemaHub"
        description="Read the latest movie reviews, TV show recommendations, subtitle guides, and entertainment news on the CinemaHub blog. Updated regularly with fresh content."
        canonicalPath="/blog"
        jsonLd={jsonLd}
      />
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <Breadcrumbs items={[{ label: "Blog" }]} />

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-3">CinemaHub Blog</h1>
          <p className="text-lg text-muted-foreground mb-10">
            Movie reviews, TV show guides, subtitle tips, and entertainment news.
          </p>

          <div className="space-y-8">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group block bg-card rounded-2xl p-6 ring-1 ring-border/20 hover:ring-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {post.excerpt}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                  Read more <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
