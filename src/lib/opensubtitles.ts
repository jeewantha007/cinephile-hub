export interface Subtitle {
  id: string;
  fileId: number;
  language: string;
  languageName: string;
  fileName: string;
  releaseName: string;
  format: string;
  downloadCount: number;
  hearingImpaired: boolean;
}

interface OpenSubtitlesFile {
  file_id: number;
  file_name: string;
}

interface OpenSubtitlesResult {
  id: string;
  attributes: {
    language: string;
    release: string;
    download_count: number;
    hearing_impaired: boolean;
    files: OpenSubtitlesFile[];
    subtitle_id: string;
  };
}

const languageNames: Record<string, string> = {
  en: "English", es: "Spanish", fr: "French", de: "German", it: "Italian",
  pt: "Portuguese", ru: "Russian", ja: "Japanese", ko: "Korean", zh: "Chinese",
  ar: "Arabic", hi: "Hindi", tr: "Turkish", pl: "Polish", nl: "Dutch",
  sv: "Swedish", no: "Norwegian", da: "Danish", fi: "Finnish", cs: "Czech",
  el: "Greek", he: "Hebrew", th: "Thai", vi: "Vietnamese", id: "Indonesian",
  ms: "Malay", ro: "Romanian", hu: "Hungarian", uk: "Ukrainian", bg: "Bulgarian",
  hr: "Croatian", sk: "Slovak", sl: "Slovenian", sr: "Serbian", lt: "Lithuanian",
  lv: "Latvian", et: "Estonian", fa: "Persian", bn: "Bengali", ta: "Tamil",
  te: "Telugu", ml: "Malayalam", mr: "Marathi", gu: "Gujarati", kn: "Kannada",
  pa: "Punjabi", ur: "Urdu", sq: "Albanian", mk: "Macedonian", bs: "Bosnian",
  ka: "Georgian", hy: "Armenian", is: "Icelandic", mt: "Maltese", ga: "Irish",
  cy: "Welsh", eu: "Basque", gl: "Galician", ca: "Catalan", af: "Afrikaans",
  sw: "Swahili", tl: "Filipino", mn: "Mongolian", ne: "Nepali", si: "Sinhala",
  km: "Khmer", lo: "Lao", my: "Burmese", kk: "Kazakh", uz: "Uzbek",
  az: "Azerbaijani", tk: "Turkmen", ky: "Kyrgyz", tg: "Tajik", ps: "Pashto",
  sd: "Sindhi", am: "Amharic", ti: "Tigrinya", so: "Somali", ha: "Hausa",
  yo: "Yoruba", ig: "Igbo", zu: "Zulu", xh: "Xhosa", sn: "Shona",
  mg: "Malagasy", eo: "Esperanto", la: "Latin", jv: "Javanese", su: "Sundanese",
  ht: "Haitian Creole", mi: "Maori", sm: "Samoan", haw: "Hawaiian",
  ku: "Kurdish", lb: "Luxembourgish", fy: "Frisian", gd: "Scottish Gaelic",
  // OpenSubtitles sometimes uses full names or 3-letter codes
  por: "Portuguese", spa: "Spanish", fre: "French", ger: "German",
  ita: "Italian", dut: "Dutch", rum: "Romanian", tur: "Turkish",
  gre: "Greek", chi: "Chinese", kor: "Korean", jpn: "Japanese",
  ara: "Arabic", hin: "Hindi", per: "Persian", pol: "Polish",
  swe: "Swedish", nor: "Norwegian", dan: "Danish", fin: "Finnish",
  cze: "Czech", hun: "Hungarian", bul: "Bulgarian", ukr: "Ukrainian",
  heb: "Hebrew", tha: "Thai", vie: "Vietnamese", ind: "Indonesian",
  may: "Malay", cat: "Catalan", baq: "Basque", glg: "Galician",
  alb: "Albanian", mac: "Macedonian", bos: "Bosnian", srp: "Serbian",
  hrv: "Croatian", slv: "Slovenian", slo: "Slovak", lit: "Lithuanian",
  lav: "Latvian", est: "Estonian", geo: "Georgian", arm: "Armenian",
  ice: "Icelandic", gle: "Irish", wel: "Welsh", mlt: "Maltese",
  ben: "Bengali", tam: "Tamil", tel: "Telugu", mal: "Malayalam",
  mar: "Marathi", guj: "Gujarati", kan: "Kannada", pan: "Punjabi",
  urd: "Urdu", nep: "Nepali", sin: "Sinhala", khm: "Khmer",
  lao: "Lao", bur: "Burmese", mon: "Mongolian", amh: "Amharic",
  som: "Somali", hau: "Hausa", yor: "Yoruba", ibo: "Igbo",
  zul: "Zulu", xho: "Xhosa", afr: "Afrikaans", swa: "Swahili",
  fil: "Filipino", epo: "Esperanto", lat: "Latin",
};

const getLanguageName = (code: string): string => {
  return languageNames[code.toLowerCase()] || code.charAt(0).toUpperCase() + code.slice(1);
};

export async function fetchSubtitlesByImdbId(imdbId: string): Promise<Subtitle[]> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  const res = await fetch(
    `${supabaseUrl}/functions/v1/opensubtitles-proxy?action=search&imdb_id=${encodeURIComponent(imdbId)}`,
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

  // Map and filter valid entries
  const subtitles: Subtitle[] = results
    .filter((item) => item.attributes?.files?.length > 0 && item.attributes.files[0].file_id)
    .map((item) => ({
      id: item.attributes.subtitle_id || item.id,
      fileId: item.attributes.files[0].file_id,
      language: item.attributes.language,
      languageName: getLanguageName(item.attributes.language),
      fileName: item.attributes.files[0].file_name || "subtitle.srt",
      releaseName: item.attributes.release || "",
      format: item.attributes.files[0].file_name?.split(".").pop() || "srt",
      downloadCount: item.attributes.download_count || 0,
      hearingImpaired: item.attributes.hearing_impaired || false,
    }));

  // Deduplicate: keep highest download count per language
  const byLanguage = new Map<string, Subtitle>();
  for (const sub of subtitles) {
    const existing = byLanguage.get(sub.language);
    if (!existing || sub.downloadCount > existing.downloadCount) {
      byLanguage.set(sub.language, sub);
    }
  }

  return Array.from(byLanguage.values()).sort((a, b) =>
    a.languageName.localeCompare(b.languageName)
  );
}

export async function getSubtitleDownloadLink(fileId: number): Promise<string> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  const res = await fetch(
    `${supabaseUrl}/functions/v1/opensubtitles-proxy?action=download`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${anonKey}`,
        "apikey": anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ file_id: fileId }),
    }
  );

  if (!res.ok) {
    throw new Error(`Download link error: ${res.status}`);
  }

  const json = await res.json();
  
  if (json.link) {
    return json.link;
  }
  
  throw new Error(json.message || "Failed to get download link");
}
