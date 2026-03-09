import { useParams, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Calendar, Clock } from "lucide-react";

interface BlogPostData {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
  content: string[];
}

const posts: Record<string, BlogPostData> = {
  "best-action-movies-2025": {
    slug: "best-action-movies-2025",
    title: "25 Best Action Movies of 2025 You Can't Miss",
    date: "2025-12-15",
    readTime: "8 min read",
    category: "Action",
    content: [
      "2025 was a phenomenal year for action cinema, delivering a mix of high-octane blockbusters, inventive indie films, and franchise sequels that pushed the genre forward. Whether you're a fan of martial arts, car chases, or superhero spectacles, this year had something for everyone.",
      "The action genre continues to evolve, blending stunning practical effects with cutting-edge CGI to create immersive experiences. Directors are finding new ways to choreograph fight sequences, design elaborate set pieces, and tell compelling stories within the framework of explosive entertainment.",
      "From Mission: Impossible's latest death-defying stunts to fresh original properties that took audiences by surprise, these 25 films represent the very best the action genre offered in 2025. Each movie was selected based on critical reception, audience scores, box office performance, and overall cultural impact.",
      "What makes a great action movie? It's not just about explosions and fight scenes — it's about stakes, character development, and pacing. The best action films keep you on the edge of your seat while making you care about the characters involved. That's what separates a forgettable popcorn flick from a genuine classic.",
      "Whether you're browsing CinemaHub for your next movie night or building a watchlist for the weekend, these action films are guaranteed to deliver thrills. Check their trailers, ratings, and detailed information right here on CinemaHub to find your perfect pick.",
    ],
  },
  "top-tv-shows-to-binge-watch": {
    slug: "top-tv-shows-to-binge-watch",
    title: "Top 20 TV Shows to Binge-Watch This Weekend",
    date: "2025-11-28",
    readTime: "10 min read",
    category: "TV Shows",
    content: [
      "Finding the perfect TV show to binge-watch can be overwhelming with so many options across streaming platforms. We've done the hard work for you — here are 20 shows that are absolutely worth your time, spanning drama, comedy, sci-fi, thriller, and more.",
      "The golden age of television continues to deliver incredible content. From prestige dramas with movie-quality production values to addictive limited series you can finish in a single sitting, there's never been a better time to be a TV fan.",
      "Each show on this list was chosen for its compelling storytelling, strong performances, and high audience ratings. We've included a mix of recent releases and hidden gems that you might have missed. Use CinemaHub's TV show section to explore full season and episode guides for each recommendation.",
      "Binge-watching has become a cultural phenomenon, and these shows are designed to keep you hooked episode after episode. With CinemaHub, you can browse season details, read episode summaries, check ratings, and even download subtitles in 50+ languages for each episode.",
      "Whether you prefer gripping crime dramas, heartwarming comedies, or mind-bending sci-fi, this list has you covered. Start exploring these shows on CinemaHub today and discover your next obsession.",
    ],
  },
  "how-to-download-subtitles": {
    slug: "how-to-download-subtitles",
    title: "How to Download Subtitles for Any Movie or TV Show",
    date: "2025-11-10",
    readTime: "6 min read",
    category: "Guide",
    content: [
      "Subtitles are essential for millions of viewers worldwide — whether you're watching a foreign film, need accessibility support, or simply prefer reading along. CinemaHub makes downloading subtitles incredibly easy with support for 50+ languages.",
      "On CinemaHub, every movie and TV episode page includes a dedicated Subtitles section. Simply navigate to the movie or episode you want, scroll down to find available subtitles, and click the download button. The subtitle files are provided in SRT format, which is compatible with virtually all media players.",
      "SRT (SubRip Subtitle) is the most widely used subtitle format. It's a simple text file that contains the subtitle text along with timing information. Most video players like VLC, MPC-HC, and even smart TV apps can load SRT files automatically when placed in the same folder as the video file.",
      "For TV shows, CinemaHub provides episode-specific subtitles. Navigate to the specific season and episode page to find subtitles that are precisely timed for that episode. The subtitle download filename even includes the show name, season, and episode number (e.g., Breaking_Bad_S01E01_English.srt) for easy organization.",
      "Tips for using subtitles: Make sure the subtitle file matches your video version, use a media player that supports subtitle rendering, and try CinemaHub's search feature to filter subtitles by language. With over 50 languages available, you'll find subtitles for virtually any movie or TV show.",
    ],
  },
  "best-horror-movies-all-time": {
    slug: "best-horror-movies-all-time",
    title: "50 Best Horror Movies of All Time – Ultimate Ranking",
    date: "2025-10-31",
    readTime: "15 min read",
    category: "Horror",
    content: [
      "Horror is one of cinema's most enduring and versatile genres. From the silent era's expressionist nightmares to today's elevated horror movement, scary movies continue to captivate audiences and push creative boundaries.",
      "This definitive ranking covers 50 of the greatest horror films ever made, spanning decades of filmmaking innovation. We've included classic slashers, psychological thrillers, supernatural chillers, body horror masterpieces, and everything in between.",
      "What makes a horror movie truly great? The best horror films tap into universal fears — the unknown, loss of control, isolation, and mortality. They use atmosphere, sound design, and visual storytelling to create experiences that linger long after the credits roll.",
      "Modern horror has experienced a remarkable renaissance, with filmmakers like Jordan Peele, Ari Aster, and Robert Eggers bringing prestige sensibilities to the genre. Films that would have been dismissed as 'just horror' a decade ago are now competing for major awards.",
      "Browse the full details, trailers, and ratings for all these horror classics on CinemaHub. Whether you're a lifelong horror fan or just getting started, this list will guide you through the genre's greatest achievements. Don't forget to download subtitles if you're watching international horror gems!",
    ],
  },
  "upcoming-movies-2026": {
    slug: "upcoming-movies-2026",
    title: "Most Anticipated Movies Coming in 2026",
    date: "2025-12-20",
    readTime: "12 min read",
    category: "Preview",
    content: [
      "2026 is shaping up to be one of the biggest years in cinema history. With major franchises delivering new installments and exciting original projects from top filmmakers, there's plenty to look forward to.",
      "The superhero genre continues to dominate the box office, but 2026 also promises a strong slate of original films, animated features, and prestige dramas. Studios are betting big on both established IP and fresh storytelling.",
      "Keep track of release dates and upcoming trailers on CinemaHub's upcoming movies section. We update our database regularly to ensure you have the latest information on every major release, including cast details, plot summaries, and official trailers.",
      "Some of the most anticipated releases include highly-anticipated sequels, reboots of beloved franchises, and ambitious sci-fi epics. International cinema is also having a moment, with several non-English language films generating massive buzz among global audiences.",
      "Bookmark CinemaHub to stay updated on all 2026 movie releases. Our trending and upcoming sections provide accurate, real-time information about what's coming next to theaters and streaming platforms.",
    ],
  },
  "best-animated-movies-families": {
    slug: "best-animated-movies-families",
    title: "Best Animated Movies for the Whole Family",
    date: "2025-09-15",
    readTime: "7 min read",
    category: "Animation",
    content: [
      "Animated movies have the unique ability to enchant viewers of all ages. From Pixar's emotionally rich storytelling to Studio Ghibli's breathtaking artistry, animation offers some of cinema's most memorable experiences.",
      "Finding the perfect animated movie for family movie night is easy with CinemaHub. Our animation section curates the best animated films based on ratings, popularity, and critical acclaim. Whether you're looking for a laugh-out-loud comedy or a touching drama, we've got you covered.",
      "The art of animation has evolved dramatically over the decades. While hand-drawn animation remains beloved, CGI has opened up new possibilities for visual storytelling. Both styles continue to thrive, giving audiences a wonderful variety of animated films to enjoy.",
      "Some of the highest-rated animated films of all time include timeless classics that have been cherished for generations alongside modern masterpieces that continue to push the medium forward. These films prove that animation is not just for kids — it's a sophisticated art form.",
      "Explore our curated animation collection on CinemaHub, complete with trailers, ratings, and subtitle downloads in 50+ languages. Perfect for international families who want to enjoy animated films together regardless of language barriers.",
    ],
  },
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? posts[slug] : undefined;

  if (!post) return <Navigate to="/blog" replace />;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      datePublished: post.date,
      author: { "@type": "Organization", name: "CinemaHub" },
      publisher: { "@type": "Organization", name: "CinemaHub", url: "https://cinemahub.space" },
      url: `https://cinemahub.space/blog/${post.slug}`,
      mainEntityOfPage: `https://cinemahub.space/blog/${post.slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://cinemahub.space/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "https://cinemahub.space/blog" },
        { "@type": "ListItem", position: 3, name: post.title, item: `https://cinemahub.space/blog/${post.slug}` },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${post.title} | CinemaHub Blog`}
        description={post.content[0].slice(0, 155) + "..."}
        canonicalPath={`/blog/${post.slug}`}
        jsonLd={jsonLd}
      />
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />

        <article className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
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

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="prose prose-invert max-w-none">
            {post.content.map((paragraph, i) => (
              <p key={i} className="text-base text-muted-foreground leading-relaxed mb-5">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
