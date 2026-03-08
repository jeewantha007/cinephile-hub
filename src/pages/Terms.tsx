import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-8">
    <h2 className="text-xl font-semibold text-foreground mb-3">{title}</h2>
    <div className="text-muted-foreground leading-relaxed space-y-3">{children}</div>
  </section>
);

const Terms = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container mx-auto px-4 pt-24 pb-12 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: March 2026</p>

      <Section title="Acceptance of Terms">
        <p>By accessing and using CineVault, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use the website.</p>
      </Section>

      <Section title="Use of the Website">
        <p>CineVault is a movie discovery platform intended for informational and entertainment purposes. You may browse movie information, view trailers, and explore content freely. You agree not to misuse the service, attempt to disrupt its operation, or use it for any unlawful purpose.</p>
      </Section>

      <Section title="Content Disclaimer">
        <p>All movie data, images, posters, and related information displayed on CineVault are sourced from The Movie Database (TMDB) API. We do not claim ownership of this content. The accuracy and availability of data depends on TMDB's database.</p>
        <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </Section>

      <Section title="Third-Party Content">
        <p>CineVault embeds content from third-party services including:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><span className="text-foreground font-medium">TMDB</span> — Movie data, posters, and metadata</li>
          <li><span className="text-foreground font-medium">YouTube</span> — Embedded movie trailers</li>
        </ul>
        <p>Use of these third-party services is subject to their respective terms of service and privacy policies.</p>
      </Section>

      <Section title="Important Notice">
        <div className="bg-card rounded-xl p-5 ring-1 ring-border/30">
          <p className="text-foreground font-medium mb-2">CineVault does not host or stream copyrighted movies.</p>
          <p>This website only provides movie information, ratings, trailers (via YouTube embeds), and discovery tools. We do not provide, host, or facilitate access to copyrighted movie files or streams in any way.</p>
        </div>
      </Section>

      <Section title="Limitation of Liability">
        <p>CineVault is provided "as is" without any warranties, express or implied. We are not liable for any damages arising from your use of the website, including but not limited to inaccurate movie data, broken links, or service interruptions.</p>
      </Section>

      <Section title="Changes to Terms">
        <p>We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated date. Continued use of the website after changes constitutes acceptance of the updated terms.</p>
      </Section>

      <Section title="Contact">
        <p>For questions about these terms, please visit our <a href="/contact" className="text-primary hover:underline">Contact page</a>.</p>
      </Section>
    </main>
    <Footer />
  </div>
);

export default Terms;
