import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-16">
        <h1 className="text-3xl font-bold font-heading mb-2">Contact Us</h1>
        <p className="text-muted-foreground mb-10">Have a question, partnership inquiry, or feedback? We'd love to hear from you.</p>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Email</p>
                <p className="text-sm text-muted-foreground">contact@hireqimah.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Headquarters</p>
                <p className="text-sm text-muted-foreground">Riyadh, Saudi Arabia</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Phone</p>
                <p className="text-sm text-muted-foreground">+966-11-XXX-XXXX</p>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-5 mt-6">
              <h3 className="font-semibold font-heading text-sm mb-2">Partnership Inquiries</h3>
              <p className="text-sm text-muted-foreground">For university or corporate partnership requests, email <strong>partnerships@hireqimah.com</strong></p>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            {submitted ? (
              <div className="text-center py-8">
                <Mail className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold font-heading mb-2">Message Sent!</h3>
                <p className="text-sm text-muted-foreground">We'll get back to you within 1-2 business days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label>Name *</Label><Input placeholder="Your full name" required maxLength={100} /></div>
                <div><Label>Email *</Label><Input type="email" placeholder="you@example.com" required maxLength={255} /></div>
                <div><Label>Subject *</Label><Input placeholder="How can we help?" required maxLength={150} /></div>
                <div><Label>Message *</Label><Textarea placeholder="Your message..." required maxLength={1000} rows={5} /></div>
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
