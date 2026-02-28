import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useAppointments,
  useMedicalHistory,
  usePrescriptions,
} from "@/hooks/useQueries";
import type { Principal } from "@icp-sdk/core/principal";
import { Calendar, ChevronRight, ClipboardList, Users } from "lucide-react";
import { useState } from "react";

export default function DoctorPatientsPage() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal() ?? null;
  const { data: appointments = [], isLoading } = useAppointments(principal);

  const [selectedPatient, setSelectedPatient] = useState<Principal | null>(
    null,
  );
  const [selectedName, setSelectedName] = useState<string>("");

  // Get unique patients from appointments
  const uniquePatients = [
    ...new Map(appointments.map((a) => [a.patientId.toString(), a])).values(),
  ];

  const PatientDetailModal = () => {
    const { data: history = [] } = useMedicalHistory(selectedPatient);
    const { data: prescriptions = [] } = usePrescriptions(selectedPatient);

    return (
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-sm bg-primary/15 text-primary font-bold">
                {selectedName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {selectedName || "Patient"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Appointments (
              {
                appointments.filter(
                  (a) => a.patientId.toString() === selectedPatient?.toString(),
                ).length
              }
              )
            </p>
            <div className="space-y-2">
              {appointments
                .filter(
                  (a) => a.patientId.toString() === selectedPatient?.toString(),
                )
                .slice(0, 3)
                .map((appt) => (
                  <div
                    key={appt.id}
                    className="flex items-center justify-between rounded-lg bg-muted/50 p-2 text-xs"
                  >
                    <span>{appt.reason || "Consultation"}</span>
                    <span className="text-muted-foreground">
                      {appt.date} · {appt.timeSlot}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {history.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Medical History
              </p>
              <div className="space-y-1.5">
                {history.slice(0, 3).map((h) => (
                  <div key={h.id} className="rounded-lg border p-2 text-xs">
                    <p className="font-medium">{h.title}</p>
                    <p className="text-muted-foreground">
                      {h.date} · {h.category}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {prescriptions.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Prescriptions
              </p>
              <div className="space-y-1.5">
                {prescriptions.slice(0, 2).map((rx) => (
                  <div key={rx.id} className="rounded-lg border p-2 text-xs">
                    <p className="font-medium">
                      {rx.medicineList.length} medicine(s) prescribed
                    </p>
                    <p className="text-muted-foreground">{rx.dateIssued}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          My Patients
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {uniquePatients.length} patient(s) from your appointments
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : uniquePatients.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No patients yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Patients will appear as they book appointments
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {uniquePatients.map((appt) => {
            const patientAppts = appointments.filter(
              (a) => a.patientId.toString() === appt.patientId.toString(),
            );
            const shortId = appt.patientId.toString().substring(0, 8);
            return (
              <Dialog key={appt.patientId.toString()}>
                <Card
                  className="shadow-card card-hover cursor-pointer"
                  onClick={() => {
                    setSelectedPatient(appt.patientId);
                    setSelectedName(`Patient ${shortId}`);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/15 text-primary font-bold">
                          {shortId.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground">
                          Patient {shortId}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {patientAppts.length} appointment(s)
                          </span>
                          <span>
                            Last:{" "}
                            {patientAppts[patientAppts.length - 1]?.date ??
                              "N/A"}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Dialog>
            );
          })}
        </div>
      )}

      {selectedPatient && (
        <Dialog
          open={!!selectedPatient}
          onOpenChange={(o) => !o && setSelectedPatient(null)}
        >
          <PatientDetailModal />
        </Dialog>
      )}
    </div>
  );
}
