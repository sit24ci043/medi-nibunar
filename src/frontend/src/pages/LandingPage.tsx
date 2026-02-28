import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  AlarmClock,
  AlertCircle,
  ArrowRight,
  Brain,
  CheckCircle2,
  Globe,
  Heart,
  MessageSquare,
  Shield,
  Stethoscope,
  Video,
} from "lucide-react";
import { Loader2 } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Symptom Checker",
    description:
      "Get instant guidance on your symptoms with our AI-powered tool — with clear medical disclaimers.",
  },
  {
    icon: Stethoscope,
    title: "Doctor Discovery",
    description:
      "Find and book verified specialists across multiple medical disciplines instantly.",
  },
  {
    icon: Video,
    title: "Video Consultations",
    description:
      "Connect face-to-face with doctors from the comfort of your home, securely.",
  },
  {
    icon: MessageSquare,
    title: "Secure Messaging",
    description:
      "Private, end-to-end encrypted chat between patients and their doctors.",
  },
  {
    icon: Shield,
    title: "HIPAA-Grade Security",
    description:
      "Your medical data is encrypted at rest and in transit with consent-based sharing.",
  },
  {
    icon: AlarmClock,
    title: "Medicine Reminders",
    description:
      "Never miss a dose with smart medicine reminders and dosage tracking.",
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description:
      "Available in English, Hindi, Bengali, Tamil, Telugu, and more regional languages.",
  },
  {
    icon: AlertCircle,
    title: "Emergency Access",
    description:
      "Instant SOS button with nearby hospital locations and emergency contacts.",
  },
];

const stats = [
  { value: "50K+", label: "Patients Served" },
  { value: "2K+", label: "Verified Doctors" },
  { value: "15+", label: "Specialties" },
  { value: "10", label: "Languages" },
];

export default function LandingPage() {
  const { login, isLoggingIn, identity } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/medi-nibunar-logo-transparent.dim_200x200.png"
              alt="Medi-Nibunar"
              className="h-9 w-9 rounded-xl object-contain"
            />
            <div>
              <p className="font-bold text-base leading-none text-foreground">
                Medi-Nibunar
              </p>
              <p className="text-[11px] text-muted-foreground">
                Telemedicine Platform
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!identity ? (
              <Button
                onClick={login}
                disabled={isLoggingIn}
                size="sm"
                className="gap-2"
              >
                {isLoggingIn ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                {isLoggingIn ? "Connecting..." : "Login / Register"}
              </Button>
            ) : (
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-700"
              >
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Connected
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="hero-gradient absolute inset-0 opacity-5" />
        <div className="container py-12 md:py-20 relative">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
                🏥 India's Trusted Telemedicine Platform
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                Healthcare,
                <span className="text-primary block">Delivered with Care</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed">
                Connect with verified doctors, get AI-powered symptom guidance,
                manage prescriptions, and access emergency services — all in one
                secure platform designed for every Indian.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="gap-2 text-base"
                >
                  {isLoggingIn ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <ArrowRight className="h-5 w-5" />
                  )}
                  Get Started Free
                </Button>
                <Button size="lg" variant="outline" className="gap-2 text-base">
                  <Heart className="h-5 w-5 text-destructive" />
                  For Doctors
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Secure login with Internet Identity · No personal data stored
                without consent
              </p>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-card-hover">
                <img
                  src="/assets/generated/hero-illustration.dim_800x500.png"
                  alt="Telemedicine illustration"
                  className="w-full h-auto object-cover"
                  loading="eager"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card rounded-xl p-3 shadow-card border border-border">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-xs">
                      HIPAA Compliant
                    </p>
                    <p className="text-muted-foreground text-[11px]">
                      Data always secured
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-card rounded-xl p-3 shadow-card border border-border">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-xs">
                      End-to-End Encrypted
                    </p>
                    <p className="text-muted-foreground text-[11px]">
                      All communications
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-primary/5">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Everything You Need for Better Health
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            A complete healthcare platform designed for patients, doctors, and
            administrators.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border bg-card p-5 shadow-card card-hover"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/5 border-t border-border">
        <div className="container py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Your Health Journey Starts Here
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            Join thousands of patients and doctors already using Medi-Nibunar
            for better healthcare outcomes.
          </p>
          <Button
            size="lg"
            onClick={login}
            disabled={isLoggingIn}
            className="gap-2"
          >
            {isLoggingIn ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-5 w-5" />
            )}
            Start Your Health Journey
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <img
                src="/assets/generated/medi-nibunar-logo-transparent.dim_200x200.png"
                alt="Medi-Nibunar"
                className="h-6 w-6 rounded object-contain"
              />
              <span className="text-sm font-semibold text-foreground">
                Medi-Nibunar
              </span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              © {new Date().getFullYear()}. Built with{" "}
              <Heart
                className="inline h-3 w-3 text-destructive"
                aria-hidden="true"
              />{" "}
              using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
            <p className="text-[11px] text-muted-foreground">
              This platform does not provide medical diagnoses.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
