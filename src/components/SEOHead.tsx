import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
  canonicalPath?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  hreflang?: { lang: string; href: string }[];
}

const SITE_NAME = "CinemaHub";
const DOMAIN = "https://cinemahub.space";
const DEFAULT_TITLE = "CinemaHub – Discover Movies, Trailers & Ratings";
const DEFAULT_DESC = "CinemaHub is a movie discovery platform where users can explore trending movies, watch trailers, download subtitles in 50+ languages, and browse detailed movie information powered by the TMDB API.";

const SEOHead = ({
  title,
  description,
  ogImage,
  ogType = "website",
  canonicalPath = "/",
  jsonLd,
  hreflang,
}: SEOHeadProps) => {
  const fullTitle = title || DEFAULT_TITLE;
  const fullDesc = description || DEFAULT_DESC;
  const fullUrl = `${DOMAIN}${canonicalPath}`;
  const fullImage = ogImage || `${DOMAIN}/og-image.png`;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("name", "description", fullDesc);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", fullDesc);
    setMeta("property", "og:image", fullImage);
    setMeta("property", "og:url", fullUrl);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", fullDesc);
    setMeta("name", "twitter:image", fullImage);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", fullUrl);

    // Hreflang
    document.querySelectorAll('link[data-hreflang]').forEach((el) => el.remove());
    if (hreflang) {
      hreflang.forEach(({ lang, href }) => {
        const link = document.createElement("link");
        link.setAttribute("rel", "alternate");
        link.setAttribute("hreflang", lang);
        link.setAttribute("href", href);
        link.setAttribute("data-hreflang", "true");
        document.head.appendChild(link);
      });
    }
    // Default x-default
    const xDefault = document.createElement("link");
    xDefault.setAttribute("rel", "alternate");
    xDefault.setAttribute("hreflang", "x-default");
    xDefault.setAttribute("href", fullUrl);
    xDefault.setAttribute("data-hreflang", "true");
    document.head.appendChild(xDefault);

    // JSON-LD (supports single object or array of objects)
    const existingLd = document.getElementById("seo-jsonld");
    if (existingLd) existingLd.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.id = "seo-jsonld";
      script.type = "application/ld+json";
      if (Array.isArray(jsonLd)) {
        script.textContent = JSON.stringify(jsonLd);
      } else {
        script.textContent = JSON.stringify(jsonLd);
      }
      document.head.appendChild(script);
    }

    return () => {
      const ld = document.getElementById("seo-jsonld");
      if (ld) ld.remove();
      document.querySelectorAll('link[data-hreflang]').forEach((el) => el.remove());
    };
  }, [fullTitle, fullDesc, fullImage, fullUrl, ogType, jsonLd, hreflang]);

  return null;
};

export default SEOHead;