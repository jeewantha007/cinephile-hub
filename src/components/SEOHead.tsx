import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
  canonicalPath?: string;
  jsonLd?: Record<string, unknown>;
}

const SITE_NAME = "CinemaHub";
const DOMAIN = "https://cinemahub.space";
const DEFAULT_TITLE = "CinemaHub – Discover Movies, Trailers & Ratings";
const DEFAULT_DESC = "CinemaHub is a movie discovery platform where users can explore trending movies, watch trailers, and browse detailed movie information powered by the TMDB API.";

const SEOHead = ({
  title,
  description,
  ogImage,
  ogType = "website",
  canonicalPath = "/",
  jsonLd,
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

    // JSON-LD
    const existingLd = document.getElementById("seo-jsonld");
    if (existingLd) existingLd.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.id = "seo-jsonld";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const ld = document.getElementById("seo-jsonld");
      if (ld) ld.remove();
    };
  }, [fullTitle, fullDesc, fullImage, fullUrl, ogType, jsonLd]);

  return null;
};

export default SEOHead;
