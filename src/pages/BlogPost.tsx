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
  image: string;
}

const IMG_BASE = "https://image.tmdb.org/t/p/w1280";

const posts: Record<string, BlogPostData> = {
  "best-action-movies-2025": {
    slug: "best-action-movies-2025",
    title: "25 Best Action Movies of 2025 You Can't Miss",
    date: "2025-12-15",
    readTime: "8 min read",
    category: "Action",
    image: `${IMG_BASE}/628Dep6AxENDKy7N5NHfa5fOE5l.jpg`,
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
    image: `${IMG_BASE}/etj8E2o0Bud0HkONVQPjyCkIvpv.jpg`,
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
    image: `${IMG_BASE}/tmU7GeKVybMWFButWEGl2M4GeiP.jpg`,
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
    image: `${IMG_BASE}/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg`,
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
    image: `${IMG_BASE}/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg`,
    content: [
      "2026 is shaping up to be one of the biggest years in cinema history. With major franchises delivering new installments and exciting original projects from top filmmakers, there's plenty to look forward to.",
      "The superhero genre continues to dominate the box office, but 2026 also promises a strong slate of original films, animated features, and prestige dramas. Studios are betting big on both established IP and fresh storytelling.",
      "Keep track of release dates and upcoming trailers on CinemaHub's upcoming movies section. We update our database regularly to ensure you have the latest information on every major release, including cast details, plot summaries, and official trailers.",
      "Some of the most anticipated releases include highly-anticipated sequels, reboots of beloved franchises, and ambitious sci-fi epics. International cinema is also having a moment, with several non-English language films generating massive buzz among global audiences.",
      "Bookmark CinemaHub to stay updated on all 2026 movie releases. Our trending and upcoming sections provide accurate, real-time information about what's coming next to theaters and streaming platforms.",
    ],
  },
  "best-sci-fi-movies-2025": {
    slug: "best-sci-fi-movies-2025",
    title: "Best Sci-Fi Movies of 2025 – Must-Watch Space & Futuristic Films",
    date: "2025-12-10",
    readTime: "9 min read",
    category: "Sci-Fi",
    image: `${IMG_BASE}/wWba3TaojhK7NdB0PiSfEzEhtOK.jpg`,
    content: [
      "Science fiction continues to be one of cinema's most exciting and thought-provoking genres. In 2025, filmmakers delivered an extraordinary lineup of sci-fi movies that ranged from intimate character studies set in futuristic worlds to grand-scale space operas with groundbreaking visual effects.",
      "The best sci-fi movies of 2025 explored themes of artificial intelligence, space exploration, time travel, and dystopian futures with remarkable depth. Directors drew inspiration from classic sci-fi literature while infusing their films with contemporary anxieties about technology and society.",
      "Hard sci-fi had a particularly strong year, with several films grounding their futuristic premises in real scientific concepts. From realistic depictions of Mars colonization to thoughtful explorations of quantum mechanics, these films satisfied both casual viewers and science enthusiasts alike.",
      "International sci-fi cinema also made waves in 2025, with stunning entries from South Korea, China, and India proving that imaginative science fiction storytelling knows no borders. Many of these films are available on CinemaHub with subtitles in 50+ languages.",
      "Whether you're a lifelong sci-fi fan or new to the genre, these films represent the pinnacle of imaginative cinema in 2025. Explore detailed information, trailers, cast details, and ratings for each film on CinemaHub, and download subtitles to enjoy international sci-fi gems in your preferred language.",
    ],
  },
  "top-korean-dramas-to-watch": {
    slug: "top-korean-dramas-to-watch",
    title: "Top 15 Korean Dramas to Watch in 2025 – K-Drama Guide",
    date: "2025-11-20",
    readTime: "11 min read",
    category: "K-Drama",
    image: `${IMG_BASE}/9faGSFi0jg6oezERJGFNta1oVAO.jpg`,
    content: [
      "Korean dramas have taken the global entertainment industry by storm, captivating audiences with their unique blend of romance, drama, comedy, and suspense. In 2025, K-dramas continued to set new standards for storytelling excellence and production quality.",
      "What makes Korean dramas so addictive? It's the combination of compelling characters, intricate plot twists, stunning cinematography, and unforgettable soundtracks. Whether you prefer historical sagas, modern romances, or gripping thrillers, there's a K-drama perfectly suited to your taste.",
      "The global popularity of K-dramas has exploded since Squid Game and Crash Landing on You introduced millions of new viewers to Korean entertainment. In 2025, the quality and variety of Korean dramas reached new heights, with ambitious productions rivaling Hollywood blockbusters in scope and budget.",
      "Subtitles play a crucial role in the K-drama experience for international viewers. CinemaHub provides Korean drama subtitles in over 50 languages, ensuring you never miss a moment of dialogue. Download SRT subtitles for any K-drama episode directly from the show's page.",
      "From heart-fluttering romance series to dark psychological thrillers, these 15 Korean dramas represent the very best of 2025. Browse full season guides, episode summaries, ratings, and cast information on CinemaHub. With new K-dramas releasing every week, there's always something fresh to discover.",
    ],
  },
  "best-thriller-movies-netflix": {
    slug: "best-thriller-movies-netflix",
    title: "20 Best Thriller Movies on Streaming Platforms Right Now",
    date: "2025-10-15",
    readTime: "8 min read",
    category: "Thriller",
    image: `${IMG_BASE}/iB3GbJbDMfuoOSoEJGNHGcLxIJl.jpg`,
    content: [
      "Nothing beats a good thriller — the kind that keeps you guessing until the very last scene. Whether you're into psychological mind games, crime mysteries, or action-packed suspense, streaming platforms are loaded with exceptional thriller movies right now.",
      "The thriller genre has evolved significantly, blending elements of horror, drama, and even sci-fi to create hybrid films that defy easy categorization. Directors like David Fincher, Denis Villeneuve, and Park Chan-wook have elevated the genre into an art form.",
      "What separates a great thriller from a good one? It's all about tension, pacing, and payoff. The best thrillers build suspense methodically, dropping clues and red herrings that keep audiences engaged from start to finish. A truly great twist ending feels both surprising and inevitable.",
      "International thrillers have gained massive popularity on streaming platforms, with films from South Korea, France, Spain, and Scandinavia consistently delivering some of the genre's most innovative entries. CinemaHub makes it easy to discover these films with subtitles in 50+ languages.",
      "Use CinemaHub to explore each thriller's ratings, reviews, trailers, and cast details before you commit to a movie night pick. Our platform helps you find the perfect thriller based on your mood — whether you want a slow-burn psychological drama or a fast-paced action thriller.",
    ],
  },
  "best-romance-movies-all-time": {
    slug: "best-romance-movies-all-time",
    title: "30 Best Romance Movies of All Time – Love Stories That Define Cinema",
    date: "2025-09-28",
    readTime: "12 min read",
    category: "Romance",
    image: `${IMG_BASE}/qom1SZSENdmHFNZBXbtJAU0WTlC.jpg`,
    content: [
      "Romance movies have been a cornerstone of cinema since the very beginning. From sweeping epics to intimate character studies, love stories have the power to move us, inspire us, and remind us of what matters most.",
      "This definitive list of the 30 best romance movies of all time spans every era of filmmaking, from classic Hollywood golden age romances to contemporary love stories that reflect modern relationships. Each film was selected for its emotional impact, performances, and lasting cultural influence.",
      "The romance genre is incredibly diverse, encompassing everything from lighthearted romantic comedies to devastating dramas about love and loss. Some of the greatest films ever made are, at their core, love stories — proving that romance is one of cinema's most powerful storytelling tools.",
      "International romance cinema deserves special attention. Films from France, South Korea, Japan, and India have produced some of the most beautiful and emotionally resonant love stories in cinema history. Many of these films are available on CinemaHub with subtitles in your preferred language.",
      "Whether you're planning a date night or simply in the mood for a heartwarming film, these 30 romance movies are guaranteed to deliver. Browse trailers, ratings, and detailed cast information on CinemaHub, and download subtitles in 50+ languages to enjoy international romance films without language barriers.",
    ],
  },
  "best-anime-movies-beginners": {
    slug: "best-anime-movies-beginners",
    title: "Best Anime Movies for Beginners – Where to Start Watching Anime",
    date: "2025-08-20",
    readTime: "9 min read",
    category: "Anime",
    image: `${IMG_BASE}/359sGBpGKjmnDBVGfTwBickjmoC.jpg`,
    content: [
      "Anime is one of the most vibrant and diverse forms of entertainment in the world, but getting started can feel overwhelming with thousands of titles to choose from. This guide curates the best anime movies that serve as perfect entry points for newcomers.",
      "Studio Ghibli films are widely considered the best starting point for anime beginners. Directed by the legendary Hayao Miyazaki and others, films like Spirited Away, My Neighbor Totoro, and Princess Mononoke showcase the artistic excellence and emotional storytelling that defines the best of anime.",
      "Beyond Studio Ghibli, modern anime movies have achieved mainstream global success. Your Name, Suzume, and Jujutsu Kaisen 0 proved that anime can compete with Hollywood's biggest blockbusters while offering uniquely Japanese storytelling perspectives.",
      "One of the biggest advantages of anime movies over anime series is their self-contained storytelling. You don't need to watch hundreds of episodes — a single 2-hour film can deliver a complete, satisfying story. This makes anime movies the ideal introduction to the medium.",
      "CinemaHub's animation section features detailed information on hundreds of anime films, complete with ratings, trailers, and subtitles in 50+ languages. Whether you prefer dubbed versions or original Japanese audio with subtitles, CinemaHub helps you find and enjoy the best anime movies available.",
    ],
  },
  "best-movies-with-subtitles": {
    slug: "best-movies-with-subtitles",
    title: "Best Foreign Language Movies to Watch with Subtitles in 2025",
    date: "2025-07-15",
    readTime: "10 min read",
    category: "International",
    image: `${IMG_BASE}/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg`,
    content: [
      "The world of cinema extends far beyond Hollywood, and some of the most extraordinary films ever made require subtitles for English-speaking audiences. From Parasite's Oscar-winning triumph to the global sensation of international streaming content, subtitled cinema has never been more popular.",
      "Watching movies with subtitles opens up an entire world of storytelling. Korean cinema delivers gripping thrillers and tender romances. Japanese films offer everything from contemplative dramas to wild action spectacles. French cinema excels in sophisticated character studies, while Indian cinema produces some of the most colorful and emotionally rich films on the planet.",
      "The 'one-inch barrier of subtitles,' as Bong Joon-ho famously described it, is disappearing. Audiences worldwide are increasingly comfortable with subtitled content, driven by the quality of international films and the convenience of modern subtitle technology.",
      "CinemaHub is the perfect platform for discovering international cinema. Every movie page includes a dedicated subtitles section where you can download SRT files in 50+ languages. Whether you're watching a Spanish drama, a Thai horror film, or a Bollywood musical, CinemaHub has the subtitles you need.",
      "Ready to explore beyond your comfort zone? Start with acclaimed international films that consistently appear on 'best of' lists, then branch out into genres and national cinemas that interest you. CinemaHub's language-based browsing makes it easy to discover films from any country, and our free subtitle downloads ensure you'll never miss a word.",
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
