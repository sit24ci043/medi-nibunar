import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SAMPLE_DOCTORS } from "@/data/mockData";
import { useApproveDoctor, useRejectDoctor } from "@/hooks/useQueries";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Star,
  Stethoscope,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { VerificationStatus } from "../../../src/backend.d";

export default function AdminDoctorsPage() {
  // These mutations are available for future integration with real doctor principals
  useApproveDoctor();
  useRejectDoctor();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [localStatus, setLocalStatus] = useState<
    Record<string, VerificationStatus>
  >({});

  const pendingDoctors = SAMPLE_DOCTORS.filter(
    (d) =>
      (localStatus[d.id] ?? d.verificationStatus) ===
      VerificationStatus.pending,
  );
  const approvedDoctors = SAMPLE_DOCTORS.filter(
    (d) =>
      (localStatus[d.id] ?? d.verificationStatus) ===
      VerificationStatus.approved,
  );
  const rejectedDoctors = SAMPLE_DOCTORS.filter(
    (d) =>
      (localStatus[d.id] ?? d.verificationStatus) ===
      VerificationStatus.rejected,
  );

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      // Demo: update local status since sample doctors don't have real principals
      setLocalStatus((prev) => ({
        ...prev,
        [id]: VerificationStatus.approved,
      }));
      toast.success("Doctor approved successfully");
    } catch {
      toast.error("Failed to approve doctor");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      setLocalStatus((prev) => ({
        ...prev,
        [id]: VerificationStatus.rejected,
      }));
      toast.success("Doctor rejected");
    } catch {
      toast.error("Failed to reject doctor");
    } finally {
      setProcessingId(null);
    }
  };

  const DoctorCard = ({
    doctor,
    showActions,
  }: {
    doctor: (typeof SAMPLE_DOCTORS)[0];
    showActions: boolean;
  }) => {
    const status = localStatus[doctor.id] ?? doctor.verificationStatus;
    return (
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/15 text-primary font-bold">
                {doctor.name.split(" ").slice(-1)[0]?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-sm text-foreground">
                    {doctor.name}
                  </p>
                  <Badge
                    variant="secondary"
                    className="text-xs mt-0.5 bg-teal-50 text-teal-700 border-teal-200"
                  >
                    {doctor.specialty}
                  </Badge>
                </div>
                {status === VerificationStatus.approved ? (
                  <Badge
                    variant="outline"
                    className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200 gap-1"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </Badge>
                ) : status === VerificationStatus.rejected ? (
                  <Badge
                    variant="outline"
                    className="text-xs bg-red-50 text-red-700 border-red-200 gap-1"
                  >
                    <XCircle className="h-3 w-3" />
                    Rejected
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-xs bg-amber-50 text-amber-700 border-amber-200 gap-1"
                  >
                    <Clock className="h-3 w-3" />
                    Pending
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                {doctor.bio}
              </p>
              <div className="flex items-center gap-1 mt-1 text-xs text-amber-600">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {doctor.rating} · {doctor.reviewCount.toString()} reviews
              </div>
              {showActions && (
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    className="h-7 text-xs gap-1 flex-1 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handleApprove(doctor.id)}
                    disabled={processingId === doctor.id}
                  >
                    {processingId === doctor.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-3 w-3" />
                    )}
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs gap-1 flex-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                    onClick={() => handleReject(doctor.id)}
                    disabled={processingId === doctor.id}
                  >
                    <XCircle className="h-3 w-3" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-primary" />
          Doctor Verification
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review and manage doctor registrations
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-center">
          <p className="text-2xl font-bold text-amber-700">
            {pendingDoctors.length}
          </p>
          <p className="text-xs text-amber-600">Pending</p>
        </div>
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-center">
          <p className="text-2xl font-bold text-emerald-700">
            {approvedDoctors.length}
          </p>
          <p className="text-xs text-emerald-600">Verified</p>
        </div>
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-center">
          <p className="text-2xl font-bold text-red-700">
            {rejectedDoctors.length}
          </p>
          <p className="text-xs text-red-600">Rejected</p>
        </div>
      </div>

      {/* Pending */}
      {pendingDoctors.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-600" />
            Pending Review ({pendingDoctors.length})
          </h2>
          {pendingDoctors.map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} showActions={true} />
          ))}
        </div>
      )}

      {/* Verified */}
      {approvedDoctors.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Verified Doctors ({approvedDoctors.length})
          </h2>
          {approvedDoctors.map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} showActions={false} />
          ))}
        </div>
      )}
    </div>
  );
}
