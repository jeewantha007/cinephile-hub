import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    console.log("Contact form submitted:", form);
    setTimeout(() => {
      toast({ title: "Message sent!", description: "Thank you for reaching out. We'll get back to you soon." });
      setForm({ name: "", email: "", message: "" });
      setSending(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Contact CinemaHub – Get in Touch" description="Have questions about CinemaHub? Send us your feedback, suggestions, or report issues. We'd love to hear from you." canonicalPath="/contact" />
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Contact Us</h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          If you have any questions, suggestions, or feedback, please contact us using the form below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 bg-card rounded-xl p-6 ring-1 ring-border/30">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Name</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full h-10 px-4 rounded-lg bg-muted/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ring-1 ring-border/50 transition-all"
              placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full h-10 px-4 rounded-lg bg-muted/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ring-1 ring-border/50 transition-all"
              placeholder="your@email.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Message</label>
            <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-muted/50 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ring-1 ring-border/50 transition-all resize-none"
              placeholder="Your message..." />
          </div>
          <Button type="submit" disabled={sending} className="gap-2">
            <Send className="h-4 w-4" />
            {sending ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
