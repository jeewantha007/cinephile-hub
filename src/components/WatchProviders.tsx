import { Tv } from "lucide-react";
import type { WatchProviderData, WatchProvider } from "@/lib/tmdb";
import { providerLogoUrl } from "@/lib/tmdb";

interface WatchProvidersProps {
  data: WatchProviderData;
}

const ProviderRow = ({ label, providers }: { label: string; providers: WatchProvider[] }) => (
  <div className="space-y-2">
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
    <div className="flex flex-wrap gap-2">
      {providers.map((p) => (
        <div
          key={p.provider_id}
          className="group/provider relative flex items-center gap-2 bg-card rounded-lg px-3 py-2 ring-1 ring-border/30 hover:ring-primary/50 transition-all"
        >
          <img
            src={providerLogoUrl(p.logo_path)}
            alt={p.provider_name}
            className="h-7 w-7 rounded-md object-contain"
            loading="lazy"
          />
          <span className="text-xs font-medium text-foreground">{p.provider_name}</span>
        </div>
      ))}
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
            className="inline-block text-xs text-primary hover:underline mt-1"
          >
            View all options on TMDB →
          </a>
        )}
        <p className="text-[10px] text-muted-foreground/60">Powered by JustWatch</p>
      </div>
    </div>
  );
};

export default WatchProviders;
