import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { SAMPLE_HOSPITALS } from "@/data/mockData";
import { useHospitalsByCity } from "@/hooks/useQueries";
import {
  AlertCircle,
  Building2,
  Clock,
  MapPin,
  Phone,
  Search,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function EmergencyPage() {
  const [city, setCity] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const { data: backendHospitals = [], isLoading } =
    useHospitalsByCity(searchCity);

  const sampleForCity = searchCity
    ? (SAMPLE_HOSPITALS[searchCity.toLowerCase()] ?? [])
    : [];
  const hospitals =
    backendHospitals.length > 0 ? backendHospitals : sampleForCity;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = city.trim().toLowerCase();
    if (!trimmed) return;
    setSearchCity(trimmed);
  };

  const handleSOS = () => {
    toast.error(
      "🚨 EMERGENCY ALERT — In a real deployment, this would contact emergency services. Call 112 immediately!",
      {
        duration: 8000,
      },
    );
  };

  const EMERGENCY_NUMBERS = [
    { label: "National Emergency", number: "112", icon: "🚨" },
    { label: "Ambulance", number: "108", icon: "🚑" },
    { label: "Police", number: "100", icon: "👮" },
    { label: "Fire Brigade", number: "101", icon: "🔥" },
    { label: "Women Helpline", number: "1091", icon: "👩" },
    { label: "Health Helpline", number: "104", icon: "🏥" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <AlertCircle className="h-6 w-6 text-destructive" />
          Emergency
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Quick access to emergency services and nearby hospitals
        </p>
      </div>

      {/* SOS Button */}
      <div className="rounded-2xl bg-destructive/5 border-2 border-destructive/20 p-6 text-center space-y-4">
        <div className="space-y-1">
          <p className="text-lg font-bold text-destructive">In an Emergency?</p>
          <p className="text-sm text-muted-foreground">
            Call 112 immediately for life-threatening emergencies
          </p>
        </div>
        <button
          type="button"
          onClick={handleSOS}
          className="inline-flex items-center justify-center gap-3 rounded-2xl bg-destructive px-10 py-5 text-destructive-foreground font-bold text-lg shadow-emergency emergency-pulse hover:bg-destructive/90 active:scale-95 transition-transform"
        >
          <AlertCircle className="h-7 w-7" />
          TAP FOR SOS
        </button>
        <p className="text-xs text-muted-foreground">
          ⚠️ Demo only — Tap to simulate emergency alert
        </p>
      </div>

      {/* Emergency Numbers */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Emergency Numbers (India)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {EMERGENCY_NUMBERS.map((num) => (
            <a
              key={num.number}
              href={`tel:${num.number}`}
              className="flex flex-col items-center gap-1.5 rounded-xl border bg-card p-3 text-center shadow-card hover:border-destructive/40 hover:bg-destructive/5 transition-colors"
            >
              <span className="text-2xl">{num.icon}</span>
              <p className="font-bold text-base text-foreground">
                {num.number}
              </p>
              <p className="text-[10px] text-muted-foreground leading-tight">
                {num.label}
              </p>
            </a>
          ))}
        </div>
      </div>

      {/* Hospital Search */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Nearby Hospitals
        </h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city (Mumbai, Delhi, Bangalore...)"
              className="pl-9"
            />
          </div>
          <Button
            type="submit"
            variant="outline"
            size="icon"
            aria-label="Search hospitals"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>

        {!searchCity ? (
          <div className="rounded-lg bg-muted/50 p-4 text-center">
            <Building2 className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Enter a city to find nearby hospitals
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Try: Mumbai, Delhi, Bangalore, Chennai, Hyderabad
            </p>
          </div>
        ) : isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : hospitals.length === 0 ? (
          <div className="text-center py-8">
            <Building2 className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">
              No hospitals found for "{searchCity}"
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {hospitals.map((hospital) => (
              <Card key={hospital.id} className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-5 w-5 text-destructive" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-sm text-foreground leading-tight">
                          {hospital.name}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-[10px] flex-shrink-0"
                        >
                          {hospital.hospitalType}
                        </Badge>
                      </div>
                      <div className="flex items-start gap-1 mt-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{hospital.address}</span>
                      </div>
                      <a
                        href={`tel:${hospital.phone}`}
                        className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-destructive hover:underline"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {hospital.phone}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Safety Tips */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-amber-700" />
          <p className="text-sm font-semibold text-amber-800">Emergency Tips</p>
        </div>
        <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
          <li>Stay calm and assess the situation</li>
          <li>Call 112 immediately for life-threatening emergencies</li>
          <li>Don't move injured persons unless there's immediate danger</li>
          <li>Keep the emergency line on until help arrives</li>
          <li>Share your location clearly with the dispatcher</li>
        </ul>
      </div>
    </div>
  );
}
