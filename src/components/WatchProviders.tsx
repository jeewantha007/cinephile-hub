import { Tv, ExternalLink } from "lucide-react";
import type { WatchProviderData, WatchProvider } from "@/lib/tmdb";
import { providerLogoUrl } from "@/lib/tmdb";

interface WatchProvidersProps {
  data: WatchProviderData;
}

// Map common provider names to their URLs
const providerUrls: Record<string, string> = {
  "Netflix": "https://www.netflix.com",
  "Amazon Prime Video": "https://www.primevideo.com",
  "Disney Plus": "https://www.disneyplus.com",
  "Apple TV Plus": "https://tv.apple.com",
  "Apple TV": "https://tv.apple.com",
  "Hulu": "https://www.hulu.com",
  "HBO Max": "https://www.max.com",
  "Max": "https://www.max.com",
  "Peacock": "https://www.peacocktv.com",
  "Peacock Premium": "https://www.peacocktv.com",
  "Paramount Plus": "https://www.paramountplus.com",
  "Paramount+ Amazon Channel": "https://www.paramountplus.com",
  "Crunchyroll": "https://www.crunchyroll.com",
  "Funimation Now": "https://www.funimation.com",
  "YouTube": "https://www.youtube.com",
  "YouTube Premium": "https://www.youtube.com/premium",
  "Google Play Movies": "https://play.google.com/store/movies",
  "Vudu": "https://www.vudu.com",
  "Microsoft Store": "https://www.microsoft.com/en-us/store/movies-and-tv",
  "iTunes": "https://tv.apple.com",
  "Amazon Video": "https://www.amazon.com/gp/video",
  "Tubi TV": "https://tubitv.com",
  "Pluto TV": "https://pluto.tv",
  "Plex": "https://www.plex.tv",
  "Mubi": "https://mubi.com",
  "Starz": "https://www.starz.com",
  "Showtime": "https://www.sho.com",
  "BritBox": "https://www.britbox.com",
  "Curiosity Stream": "https://curiositystream.com",
  "AMC Plus": "https://www.amcplus.com",
  "Shudder": "https://www.shudder.com",
  "Kanopy": "https://www.kanopy.com",
  "Hoopla": "https://www.hoopladigital.com",
  "Criterion Channel": "https://www.criterionchannel.com",
  "fuboTV": "https://www.fubo.tv",
  "Sling TV": "https://www.sling.com",
  "Hotstar": "https://www.hotstar.com",
  "Disney Plus Hotstar": "https://www.hotstar.com",
  "JioCinema": "https://www.jiocinema.com",
  "ZEE5": "https://www.zee5.com",
  "SonyLIV": "https://www.sonyliv.com",
  "Viki": "https://www.viki.com",
  "Rakuten TV": "https://www.rakuten.tv",
  "Now TV": "https://www.nowtv.com",
  "Stan": "https://www.stan.com.au",
  "Crave": "https://www.crave.ca",
};

const getProviderUrl = (name: string): string | null => {
  // Exact match first
  if (providerUrls[name]) return providerUrls[name];
  // Partial match
  const key = Object.keys(providerUrls).find(
    (k) => name.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(name.toLowerCase())
  );
  return key ? providerUrls[key] : null;
};

const ProviderRow = ({ label, providers }: { label: string; providers: WatchProvider[] }) => (
  <div className="space-y-2">
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
    <div className="flex flex-wrap gap-2">
      {providers.map((p) => {
        const url = getProviderUrl(p.provider_name);
        const content = (
          <>
            <img
              src={providerLogoUrl(p.logo_path)}
              alt={p.provider_name}
              className="h-7 w-7 rounded-md object-contain"
              loading="lazy"
            />
            <span className="text-xs font-medium text-foreground">{p.provider_name}</span>
            {url && <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover/provider:opacity-100 transition-opacity" />}
          </>
        );

        return url ? (
          <a
            key={p.provider_id}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/provider relative flex items-center gap-2 bg-card rounded-lg px-3 py-2 ring-1 ring-border/30 hover:ring-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
          >
            {content}
          </a>
        ) : (
          <div
            key={p.provider_id}
            className="group/provider relative flex items-center gap-2 bg-card rounded-lg px-3 py-2 ring-1 ring-border/30 transition-all"
          >
            {content}
          </div>
        );
      })}
    </div>
  </div>
);

const WatchProviders = ({ data }: WatchProvidersProps) => {
  const hasAny = data.flatrate?.length || data.rent?.length || data.buy?.length || data.free?.length || data.ads?.length;

  if (!hasAny) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
        <Tv className="h-4 w-4 text-primary" /> Where to Watch
      </h2>
      <div className="space-y-4">
        {data.flatrate && data.flatrate.length > 0 && (
          <ProviderRow label="Stream" providers={data.flatrate} />
        )}
        {data.free && data.free.length > 0 && (
          <ProviderRow label="Free" providers={data.free} />
        )}
        {data.ads && data.ads.length > 0 && (
          <ProviderRow label="Free with Ads" providers={data.ads} />
        )}
        {data.rent && data.rent.length > 0 && (
          <ProviderRow label="Rent" providers={data.rent} />
        )}
        {data.buy && data.buy.length > 0 && (
          <ProviderRow label="Buy" providers={data.buy} />
        )}
        {data.link && (
          <a
            href={data.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-1"
          >
            View all watch options <ExternalLink className="h-3 w-3" />
          </a>
        )}
        <p className="text-[10px] text-muted-foreground/60">Powered by JustWatch</p>
      </div>
    </div>
  );
};

export default WatchProviders;
