import { Film } from "lucide-react";

interface SEOContentBlockProps {
  title: string;
  paragraphs: string[];
}

const SEOContentBlock = ({ title, paragraphs }: SEOContentBlockProps) => (
  <section className="my-16 container mx-auto px-4">
    <div className="relative max-w-4xl mx-auto bg-card/60 backdrop-blur-sm rounded-2xl ring-1 ring-border/20 p-8 md:p-12 overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <Film className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
        </div>
        <div className="space-y-4">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default SEOContentBlock;
