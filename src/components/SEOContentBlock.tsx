interface SEOContentBlockProps {
  title: string;
  paragraphs: string[];
}

const SEOContentBlock = ({ title, paragraphs }: SEOContentBlockProps) => (
  <section className="mt-16 mb-8 max-w-4xl mx-auto px-4">
    <h2 className="text-xl font-bold text-foreground mb-4">{title}</h2>
    {paragraphs.map((p, i) => (
      <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-3">
        {p}
      </p>
    ))}
  </section>
);

export default SEOContentBlock;
