// Google Analytics event tracking utility

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const trackEvent = (
  eventName: string,
  params?: Record<string, string | number | boolean>
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
};

// Predefined events
export const trackTrailerPlay = (title: string, id: number) =>
  trackEvent("trailer_play", { content_title: title, content_id: id, content_type: "trailer" });

export const trackSubtitleDownload = (title: string, language: string) =>
  trackEvent("subtitle_download", { content_title: title, language, content_type: "subtitle" });

export const trackSearch = (query: string, resultsCount: number) =>
  trackEvent("search", { search_term: query, results_count: resultsCount });

export const trackMovieView = (title: string, id: number) =>
  trackEvent("movie_view", { content_title: title, content_id: id, content_type: "movie" });

export const trackTVView = (title: string, id: number) =>
  trackEvent("tv_view", { content_title: title, content_id: id, content_type: "tv_show" });

export const trackGenreClick = (genre: string) =>
  trackEvent("genre_click", { genre_name: genre });
