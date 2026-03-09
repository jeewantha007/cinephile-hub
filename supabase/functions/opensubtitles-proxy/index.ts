import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const API_KEY = Deno.env.get("OPENSUBTITLES_API_KEY") || "";
const BASE_URL = "https://api.opensubtitles.com/api/v1";

const headers = {
  "Api-Key": API_KEY,
  "Content-Type": "application/json",
  "User-Agent": "CinemaHub v1.0",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const action = url.searchParams.get("action") || "search";

  try {
    if (!API_KEY) {
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Action: search subtitles
    if (action === "search") {
      const imdbId = url.searchParams.get("imdb_id");
      if (!imdbId) {
        return new Response(
          JSON.stringify({ error: "imdb_id parameter is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const numericId = imdbId.replace(/^tt/, "");
      const languages = url.searchParams.get("languages") || "";
      
      let searchUrl = `${BASE_URL}/subtitles?imdb_id=${numericId}`;
      if (languages) {
        searchUrl += `&languages=${languages}`;
      }

      const response = await fetch(searchUrl, { headers });
      const data = await response.json();

      // Filter: only keep entries with valid files
      if (data.data && Array.isArray(data.data)) {
        data.data = data.data.filter((item: any) => {
          const files = item.attributes?.files;
          return files && Array.isArray(files) && files.length > 0 && files[0].file_id;
        });
      }

      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Action: get download link
    if (action === "download") {
      const body = await req.json();
      const fileId = body.file_id;

      if (!fileId) {
        return new Response(
          JSON.stringify({ error: "file_id is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const response = await fetch(`${BASE_URL}/download`, {
        method: "POST",
        headers,
        body: JSON.stringify({ file_id: fileId }),
      });

      const data = await response.json();

      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use 'search' or 'download'" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
