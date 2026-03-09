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
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  const res = await fetch(
    `${supabaseUrl}/functions/v1/opensubtitles-proxy?imdb_id=${encodeURIComponent(imdbId)}`,
    {
      headers: {
        "Authorization": `Bearer ${anonKey}`,
        "apikey": anonKey,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Subtitle proxy error: ${res.status}`);
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
