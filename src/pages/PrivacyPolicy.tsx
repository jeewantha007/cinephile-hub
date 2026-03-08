import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-8">
    <h2 className="text-xl font-semibold text-foreground mb-3">{title}</h2>
    <div className="text-muted-foreground leading-relaxed space-y-3">{children}</div>
  </section>
);

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container mx-auto px-4 pt-24 pb-12 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: March 2026</p>

      <Section title="Information We Collect">
        <p>CineVault does not collect personal data unless you voluntarily provide it, such as when using our contact form. Any information provided through the contact form (name, email, message) is used solely to respond to your inquiry.</p>
      </Section>

      <Section title="Cookies & Analytics">
        <p>We may use cookies and similar tracking technologies to improve your browsing experience and analyze site usage. These cookies help us understand how visitors interact with the website, enabling us to make improvements.</p>
        <p>You can control cookie preferences through your browser settings. Disabling cookies may affect certain site features.</p>
      </Section>

      <Section title="Third-Party Services">
        <p>CineVault uses the following third-party services that may collect usage data:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><span className="text-foreground font-medium">TMDB API</span> — Provides movie data, images, and information. Subject to TMDB's own privacy policy.</li>
          <li><span className="text-foreground font-medium">YouTube</span> — Embedded trailers are loaded from YouTube and may set cookies. Subject to Google's privacy policy.</li>
        </ul>
      </Section>

      <Section title="Advertising">
        <p>CineVault may display advertisements in the future through third-party advertising networks. These networks may use cookies and similar technologies to serve relevant ads based on your browsing behavior. We will update this policy accordingly when advertising is implemented.</p>
      </Section>

      <Section title="Data Security">
        <p>We take reasonable measures to protect any information submitted through our website. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
      </Section>

      <Section title="Contact Us">
        <p>If you have any privacy-related questions or concerns, please reach out to us through our <a href="/contact" className="text-primary hover:underline">Contact page</a>.</p>
      </Section>
    </main>
    <Footer />
  </div>
);

export default PrivacyPolicy;
