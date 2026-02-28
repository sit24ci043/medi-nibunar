import { LanguageSelector } from "@/components/shared/LanguageSelector";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { MEDICAL_SPECIALTIES, SAMPLE_TIME_SLOTS } from "@/data/mockData";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useCallerProfile, useSaveProfile } from "@/hooks/useQueries";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Star,
  UserCircle,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { VerificationStatus } from "../../../src/backend.d";

function VerificationStatusCard({ status }: { status: VerificationStatus }) {
  if (status === VerificationStatus.approved) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3">
        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        <div>
          <p className="text-sm font-semibold text-emerald-800">
            Verified Doctor
          </p>
          <p className="text-xs text-emerald-600">
            Your account is verified and you can see patients
          </p>
        </div>
      </div>
    );
  }
  if (status === VerificationStatus.pending) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3">
        <Clock className="h-5 w-5 text-amber-600" />
        <div>
          <p className="text-sm font-semibold text-amber-800">
            Verification Pending
          </p>
          <p className="text-xs text-amber-600">
            Your account is under review by our admin team
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3">
      <XCircle className="h-5 w-5 text-red-600" />
      <div>
        <p className="text-sm font-semibold text-red-800">
          Verification Rejected
        </p>
        <p className="text-xs text-red-600">
          Please contact support for more information
        </p>
      </div>
    </div>
  );
}

export default function DoctorProfilePage() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading } = useCallerProfile();
  const saveProfile = useSaveProfile();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [specialty, setSpecialty] = useState("General Physician");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setBio(profile.bio ?? "");
      setSpecialty(profile.specialty ?? "General Physician");
      setLanguage(profile.languagePreference ?? "en");
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !identity) return;
    try {
      await saveProfile.mutateAsync({
        ...profile,
        name,
        bio,
        specialty,
        languagePreference: language,
      });
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center text-muted-foreground">Loading...</div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <UserCircle className="h-6 w-6 text-primary" />
          My Profile
        </h1>
      </div>

      {/* Profile Card */}
      <Card className="shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/15 text-primary text-2xl font-bold">
                {profile?.name?.charAt(0)?.toUpperCase() ?? "D"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg text-foreground">
                {profile?.name ?? "Doctor"}
              </p>
              <Badge
                variant="secondary"
                className="mt-0.5 bg-teal-50 text-teal-700 border-teal-200"
              >
                {profile?.specialty ?? "Specialist"}
              </Badge>
              <div className="flex items-center gap-1 mt-1.5">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold">
                  {profile?.rating?.toFixed(1) ?? "N/A"}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({profile?.reviewCount?.toString() ?? 0} reviews)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Status */}
      {profile && (
        <VerificationStatusCard status={profile.verificationStatus} />
      )}

      <form onSubmit={handleSave} className="space-y-5">
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
              <Label>Specialty</Label>
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger>
                  <SelectValue />
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
            <div className="space-y-1.5">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Your qualifications, experience, areas of expertise..."
                rows={4}
                className="resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Language Preference</Label>
              <LanguageSelector value={language} onChange={setLanguage} />
            </div>
          </CardContent>
        </Card>

        {/* Available Slots */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Available Time Slots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_TIME_SLOTS.map((slot) => (
                <Badge
                  key={slot}
                  variant="outline"
                  className="text-xs bg-primary/5 border-primary/20 text-primary"
                >
                  {slot}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Default availability slots. Patients can book any of these times.
            </p>
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
          {saveProfile.isPending ? "Saving..." : "Update Profile"}
        </Button>
      </form>
    </div>
  );
}
