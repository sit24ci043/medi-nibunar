import { VerifiedBadge } from "@/components/shared/VerifiedBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MEDICAL_SPECIALTIES, SAMPLE_DOCTORS } from "@/data/mockData";
import { Link } from "@tanstack/react-router";
import { Calendar, Search, Star } from "lucide-react";
import { useState } from "react";
import type { VerificationStatus } from "../../../src/backend.d";

export default function DoctorsPage() {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("all");

  const filtered = SAMPLE_DOCTORS.filter((doc) => {
    const matchesSearch =
      !search ||
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(search.toLowerCase()) ||
      doc.bio.toLowerCase().includes(search.toLowerCase());
    const matchesSpecialty = specialty === "all" || doc.specialty === specialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Find a Doctor</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Browse verified specialists and book appointments
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or specialty..."
            className="pl-9"
          />
        </div>
        <Select value={specialty} onValueChange={setSpecialty}>
          <SelectTrigger className="sm:w-56">
            <SelectValue placeholder="All specialties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specialties</SelectItem>
            {MEDICAL_SPECIALTIES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground">
        {filtered.length} doctor{filtered.length !== 1 ? "s" : ""} found
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">
            No doctors found matching your search
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((doc) => (
            <Card key={doc.id} className="shadow-card card-hover">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center text-lg font-bold text-primary flex-shrink-0">
                    {doc.name.split(" ").slice(-1)[0]?.charAt(0) ?? "D"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base text-foreground leading-tight truncate">
                        {doc.name}
                      </h3>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs mt-0.5 bg-teal-50 text-teal-700 border-teal-200"
                    >
                      {doc.specialty}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      {doc.bio}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1">
                        <VerifiedBadge
                          status={doc.verificationStatus as VerificationStatus}
                        />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-amber-600">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{doc.rating}</span>
                        <span className="text-muted-foreground">
                          ({doc.reviewCount.toString()})
                        </span>
                      </div>
                    </div>
                    {doc.verificationStatus === "approved" ? (
                      <Link
                        to="/patient/book/$doctorId"
                        params={{ doctorId: doc.id }}
                        className="mt-3 flex items-center justify-center gap-2 w-full rounded-lg bg-primary text-primary-foreground text-xs font-semibold py-2 hover:bg-primary/90 transition-colors"
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        Book Appointment
                      </Link>
                    ) : (
                      <div className="mt-3 flex items-center justify-center w-full rounded-lg bg-muted text-muted-foreground text-xs font-semibold py-2">
                        Pending Verification
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
