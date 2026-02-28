import { LanguageSelector } from "@/components/shared/LanguageSelector";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useCallerProfile, useSaveProfile } from "@/hooks/useQueries";
import { Loader2, Settings, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PatientSettings() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading } = useCallerProfile();
  const saveProfile = useSaveProfile();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [language, setLanguage] = useState("en");
  const [largeText, setLargeText] = useState(false);
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setBio(profile.bio ?? "");
      setLanguage(profile.languagePreference ?? "en");
      setLargeText(profile.largeTextMode ?? false);
      setConsent(profile.consentDataSharing ?? false);
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !identity) return;
    try {
      await saveProfile.mutateAsync({
        ...profile,
        name: name.trim(),
        bio: bio.trim(),
        languagePreference: language,
        largeTextMode: largeText,
        consentDataSharing: consent,
      });
      toast.success("Settings saved successfully");
    } catch {
      toast.error("Failed to save settings");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Card */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary/15 text-primary text-xl font-bold">
                {profile?.name?.charAt(0)?.toUpperCase() ?? "P"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-foreground">
                {profile?.name ?? "Patient"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Principal:{" "}
                {identity?.getPrincipal().toString().substring(0, 25)}...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Profile Settings */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Language</Label>
              <LanguageSelector value={language} onChange={setLanguage} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Large Text Mode
                </p>
                <p className="text-xs text-muted-foreground">
                  Increases font size for better readability
                </p>
              </div>
              <Switch
                checked={largeText}
                onCheckedChange={setLargeText}
                aria-label="Toggle large text mode"
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Privacy & Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
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
                I consent to the storage and processing of my health data for
                healthcare services. Data is encrypted and shared only with my
                treating doctors.
              </Label>
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full"
          disabled={saveProfile.isPending}
        >
          {saveProfile.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {saveProfile.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}
