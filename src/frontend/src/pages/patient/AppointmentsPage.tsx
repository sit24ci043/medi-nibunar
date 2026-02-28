import { AppointmentStatusBadge } from "@/components/shared/AppointmentStatusBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useAppointments, useCancelAppointment } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { Calendar, Clock, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppointmentStatus } from "../../../src/backend.d";

export default function AppointmentsPage() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal() ?? null;
  const { data: appointments = [], isLoading } = useAppointments(principal);
  const cancelAppointment = useCancelAppointment();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const upcoming = appointments.filter(
    (a) =>
      a.status === AppointmentStatus.pending ||
      a.status === AppointmentStatus.confirmed,
  );
  const past = appointments.filter(
    (a) =>
      a.status === AppointmentStatus.completed ||
      a.status === AppointmentStatus.cancelled,
  );

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    try {
      await cancelAppointment.mutateAsync(id);
      toast.success("Appointment cancelled");
    } catch {
      toast.error("Failed to cancel appointment");
    } finally {
      setCancellingId(null);
    }
  };

  const AppointmentCard = ({ appt }: { appt: (typeof appointments)[0] }) => (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-base text-foreground truncate">
              {appt.reason || "Medical Consultation"}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {appt.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {appt.timeSlot}
              </span>
            </div>
            {appt.doctorNotes && (
              <div className="mt-2 rounded-lg bg-muted/50 p-2">
                <p className="text-xs font-semibold text-muted-foreground mb-0.5">
                  Doctor's Notes:
                </p>
                <p className="text-xs text-foreground">{appt.doctorNotes}</p>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <AppointmentStatusBadge status={appt.status} />
            {appt.status === AppointmentStatus.pending && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive h-7 text-xs"
                    disabled={cancellingId === appt.id}
                  >
                    {cancellingId === appt.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 mr-1" />
                    )}
                    Cancel
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel this appointment? This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleCancel(appt.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Cancel Appointment
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-4 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your medical appointments
          </p>
        </div>
        <Link to="/patient/doctors">
          <Button size="sm" variant="outline" className="gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Book New
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="upcoming">
            Upcoming{" "}
            {upcoming.length > 0 && (
              <Badge className="ml-1.5 h-4 w-4 p-0 text-[10px]">
                {upcoming.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-4 space-y-3">
          {upcoming.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                No upcoming appointments
              </p>
              <Link
                to="/patient/doctors"
                className="text-xs text-primary hover:underline mt-1 inline-block"
              >
                Book an appointment →
              </Link>
            </div>
          ) : (
            upcoming.map((appt) => (
              <AppointmentCard key={appt.id} appt={appt} />
            ))
          )}
        </TabsContent>
        <TabsContent value="past" className="mt-4 space-y-3">
          {past.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8">
              No past appointments
            </p>
          ) : (
            past.map((appt) => <AppointmentCard key={appt.id} appt={appt} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
