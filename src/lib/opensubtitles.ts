const API_KEY = "YX6lmgeT4kK150YZGEFvFDv9cPdCkjsF";
const BASE_URL = "https://api.opensubtitles.com/api/v1";

export interface Subtitle {
  id: string;
  language: string;
  fileName: string;
  downloadUrl: string;
  releaseName: string;
  format: string;
}

interface OpenSubtitlesResult {
  id: string;
  attributes: {
    language: string;
    release: string;
    files: Array<{
      file_id: number;
      file_name: string;
    }>;
    subtitle_id: string;
  };
}

export async function fetchSubtitlesByImdbId(imdbId: string): Promise<Subtitle[]> {
  const res = await fetch(`${BASE_URL}/subtitles?imdb_id=${imdbId}`, {
    headers: {
      "Api-Key": API_KEY,
      "Content-Type": "application/json",
      "User-Agent": "CinemaHub v1.0",
    },
  });

  if (!res.ok) {
    throw new Error(`OpenSubtitles API error: ${res.status}`);
  }

  const json = await res.json();
  const results: OpenSubtitlesResult[] = json.data || [];

  return results.map((item) => ({
    id: item.attributes.subtitle_id || item.id,
    language: item.attributes.language,
    fileName: item.attributes.files?.[0]?.file_name || "subtitle.srt",
    downloadUrl: `https://www.opensubtitles.com/en/subtitles/${item.attributes.subtitle_id}`,
    releaseName: item.attributes.release || "",
    format: item.attributes.files?.[0]?.file_name?.split(".").pop() || "srt",
  }));
}
