import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SAMPLE_DOCTORS } from "@/data/mockData";
import { Search, Stethoscope, User, Users } from "lucide-react";
import { useState } from "react";
import { VerificationStatus } from "../../../src/backend.d";

// Sample user list combining sample doctors + sample patients
const SAMPLE_USERS = [
  ...SAMPLE_DOCTORS.map((d) => ({
    id: d.id,
    name: d.name,
    role: "doctor" as const,
    specialty: d.specialty,
    verificationStatus: d.verificationStatus,
    rating: d.rating,
  })),
  {
    id: "p-1",
    name: "Rahul Gupta",
    role: "patient" as const,
    specialty: undefined,
    verificationStatus: "approved" as const,
    rating: 0,
  },
  {
    id: "p-2",
    name: "Sunita Sharma",
    role: "patient" as const,
    specialty: undefined,
    verificationStatus: "approved" as const,
    rating: 0,
  },
  {
    id: "p-3",
    name: "Vijay Patel",
    role: "patient" as const,
    specialty: undefined,
    verificationStatus: "approved" as const,
    rating: 0,
  },
  {
    id: "p-4",
    name: "Meera Krishnan",
    role: "patient" as const,
    specialty: undefined,
    verificationStatus: "approved" as const,
    rating: 0,
  },
  {
    id: "p-5",
    name: "Arun Nair",
    role: "patient" as const,
    specialty: undefined,
    verificationStatus: "approved" as const,
    rating: 0,
  },
  {
    id: "p-6",
    name: "Preethi Iyer",
    role: "patient" as const,
    specialty: undefined,
    verificationStatus: "approved" as const,
    rating: 0,
  },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "patient" | "doctor">(
    "all",
  );

  const filtered = SAMPLE_USERS.filter((u) => {
    const matchesSearch =
      !search || u.name.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const doctors = SAMPLE_USERS.filter((u) => u.role === "doctor");
  const patients = SAMPLE_USERS.filter((u) => u.role === "patient");

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          All Users
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {SAMPLE_USERS.length} total users
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 text-center">
          <p className="text-2xl font-bold text-primary">
            {SAMPLE_USERS.length}
          </p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        <div className="rounded-xl bg-teal-50 border border-teal-200 p-3 text-center">
          <p className="text-2xl font-bold text-teal-700">{doctors.length}</p>
          <p className="text-xs text-muted-foreground">Doctors</p>
        </div>
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-center">
          <p className="text-2xl font-bold text-blue-700">{patients.length}</p>
          <p className="text-xs text-muted-foreground">Patients</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="pl-9"
          />
        </div>
        <div className="flex rounded-lg border overflow-hidden text-sm">
          {(["all", "doctor", "patient"] as const).map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-2 font-medium capitalize transition-colors ${
                roleFilter === r
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((user) => (
          <Card key={user.id} className="shadow-card">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback
                    className={`text-sm font-bold ${user.role === "doctor" ? "bg-primary/15 text-primary" : "bg-secondary text-secondary-foreground"}`}
                  >
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {user.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {user.role === "doctor" ? (
                      <span className="flex items-center gap-0.5 text-[11px] text-teal-700">
                        <Stethoscope className="h-3 w-3" />
                        {user.specialty}
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
                        <User className="h-3 w-3" />
                        Patient
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge
                    variant="secondary"
                    className={`text-[10px] ${user.role === "doctor" ? "bg-teal-50 text-teal-700" : "bg-blue-50 text-blue-700"}`}
                  >
                    {user.role}
                  </Badge>
                  {user.role === "doctor" && (
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        user.verificationStatus === VerificationStatus.approved
                          ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                          : user.verificationStatus ===
                              VerificationStatus.pending
                            ? "border-amber-300 text-amber-700 bg-amber-50"
                            : "border-red-300 text-red-700 bg-red-50"
                      }`}
                    >
                      {user.verificationStatus}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
