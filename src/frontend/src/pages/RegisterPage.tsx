import { LanguageSelector } from "@/components/shared/LanguageSelector";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LANGUAGES, MEDICAL_SPECIALTIES } from "@/data/mockData";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useSaveProfile } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Shield, Stethoscope, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UserRole, VerificationStatus } from "../../src/backend.d";

const roleOptions = [
  {
    value: UserRole.patient,
    label: "Patient",
    icon: User,
    description: "I am seeking medical care",
  },
  {
    value: UserRole.doctor,
    label: "Doctor",
    icon: Stethoscope,
    description: "I am a healthcare professional",
  },
  {
    value: UserRole.admin,
    label: "Admin",
    icon: Shield,
    description: "Platform administrator",
  },
];

export default function RegisterPage() {
  const { identity } = useInternetIdentity();
  const saveProfile = useSaveProfile();
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>(UserRole.patient);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [specialty, setSpecialty] = useState("General Physician");
  const [language, setLanguage] = useState("en");
  const [consent, setConsent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      toast.error("Please login first");
      return;
    }
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!consent) {
      toast.error("Please accept the consent terms to continue");
      return;
    }

    try {
      await saveProfile.mutateAsync({
        id: identity.getPrincipal(),
        name: name.trim(),
        bio: bio.trim(),
        role,
        specialty: role === UserRole.doctor ? specialty : undefined,
        languagePreference: language,
        largeTextMode: false,
        consentDataSharing: consent,
        rating: 0,
        reviewCount: BigInt(0),
        verificationStatus:
          role === UserRole.doctor
            ? VerificationStatus.pending
            : VerificationStatus.approved,
      });

      toast.success("Profile created successfully! Welcome to Medi-Nibunar.");

      if (role === UserRole.patient) {
        navigate({ to: "/patient/dashboard" });
      } else if (role === UserRole.doctor) {
        navigate({ to: "/doctor/dashboard" });
      } else {
        navigate({ to: "/admin/dashboard" });
      }
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-3 mb-6">
          <img
            src="/assets/generated/medi-nibunar-logo-transparent.dim_200x200.png"
            alt="Medi-Nibunar"
            className="h-12 w-12 rounded-2xl object-contain"
          />
          <div>
            <h1 className="text-xl font-bold text-foreground">Medi-Nibunar</h1>
            <p className="text-sm text-muted-foreground">
              Complete Your Profile
            </p>
          </div>
        </div>

        <Card className="shadow-card-hover border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Create Your Account</CardTitle>
            <CardDescription>
              Tell us about yourself to get started. You're connected as:{" "}
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                {identity?.getPrincipal().toString().substring(0, 20)}...
              </code>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">I am a...</Label>
                <div className="grid grid-cols-3 gap-2">
                  {roleOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setRole(opt.value)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-colors ${
                        role === opt.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      <opt.icon className="h-5 w-5" />
                      <span className="text-xs font-semibold">{opt.label}</span>
                      <span className="text-[10px] leading-tight opacity-70">
                        {opt.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={
                    role === UserRole.doctor
                      ? "Dr. Full Name"
                      : "Your full name"
                  }
                  required
                  autoComplete="name"
                />
              </div>

              {/* Specialty (Doctor only) */}
              {role === UserRole.doctor && (
                <div className="space-y-1.5">
                  <Label htmlFor="specialty">Medical Specialty *</Label>
                  <Select value={specialty} onValueChange={setSpecialty}>
                    <SelectTrigger id="specialty">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {MEDICAL_SPECIALTIES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Bio */}
              <div className="space-y-1.5">
                <Label htmlFor="bio">Bio (optional)</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={
                    role === UserRole.doctor
                      ? "Your qualifications, experience, areas of expertise..."
                      : "A brief description about yourself..."
                  }
                  rows={3}
                  className="resize-none"
                />
              </div>

              {/* Language */}
              <div className="space-y-1.5">
                <Label>Preferred Language</Label>
                <LanguageSelector value={language} onChange={setLanguage} />
              </div>

              {/* Consent */}
              <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(v) => setConsent(v === true)}
                  className="mt-0.5"
                />
                <Label
                  htmlFor="consent"
                  className="text-sm leading-relaxed cursor-pointer text-muted-foreground"
                >
                  I consent to the storage and processing of my health data on
                  this platform, strictly for providing healthcare services. I
                  understand I can revoke this at any time.
                </Label>
              </div>

              {role === UserRole.doctor && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                  📋 Doctor accounts require admin verification before you can
                  see patients. You'll be notified once approved.
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={saveProfile.isPending}
              >
                {saveProfile.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {saveProfile.isPending
                  ? "Creating Profile..."
                  : "Complete Registration"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
