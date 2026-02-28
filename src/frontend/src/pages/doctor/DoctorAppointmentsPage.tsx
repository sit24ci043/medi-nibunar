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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useAppointments,
  useCancelAppointment,
  useCompleteAppointment,
  useConfirmAppointment,
} from "@/hooks/useQueries";
import { Calendar, CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppointmentStatus } from "../../../src/backend.d";

export default function DoctorAppointmentsPage() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal() ?? null;
  const { data: appointments = [], isLoading } = useAppointments(principal);
  const confirmAppt = useConfirmAppointment();
  const cancelAppt = useCancelAppointment();
  const completeAppt = useCompleteAppointment();

  const [notes, setNotes] = useState("");
  const [completingId, setCompletingId] = useState<string | null>(null);

  const pending = appointments.filter(
    (a) => a.status === AppointmentStatus.pending,
  );
  const confirmed = appointments.filter(
    (a) => a.status === AppointmentStatus.confirmed,
  );
  const completed = appointments.filter(
    (a) => a.status === AppointmentStatus.completed,
  );
  const cancelled = appointments.filter(
    (a) => a.status === AppointmentStatus.cancelled,
  );

  const handleConfirm = async (id: string) => {
    try {
      await confirmAppt.mutateAsync(id);
      toast.success("Appointment confirmed");
    } catch {
      toast.error("Failed to confirm");
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelAppt.mutateAsync(id);
      toast.success("Appointment cancelled");
    } catch {
      toast.error("Failed to cancel");
    }
  };

  const handleComplete = async (id: string) => {
    if (!notes.trim()) {
      toast.error("Please add doctor's notes");
      return;
    }
    try {
      await completeAppt.mutateAsync({
        appointmentId: id,
        doctorNotes: notes.trim(),
      });
      toast.success("Appointment marked complete");
      setNotes("");
      setCompletingId(null);
    } catch {
      toast.error("Failed to complete appointment");
    }
  };

  const AppointmentCard = ({ appt }: { appt: (typeof appointments)[0] }) => (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-foreground">
              {appt.reason || "Medical Consultation"}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {appt.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {appt.timeSlot}
              </span>
            </div>
            {appt.doctorNotes && (
              <div className="mt-2 rounded-lg bg-muted/50 p-2 text-xs text-foreground">
                <span className="font-semibold text-muted-foreground">
                  Notes:{" "}
                </span>
                {appt.doctorNotes}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <AppointmentStatusBadge status={appt.status} />
            <div className="flex gap-1">
              {appt.status === AppointmentStatus.pending && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs gap-1 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                    onClick={() => handleConfirm(appt.id)}
                    disabled={confirmAppt.isPending}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    Confirm
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs text-destructive hover:text-destructive"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleCancel(appt.id)}
                          className="bg-destructive text-destructive-foreground"
                        >
                          Cancel
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
              {appt.status === AppointmentStatus.confirmed && (
                <Dialog
                  open={completingId === appt.id}
                  onOpenChange={(o) => {
                    if (!o) setCompletingId(null);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs gap-1 text-blue-700 border-blue-300 hover:bg-blue-50"
                      onClick={() => setCompletingId(appt.id)}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      Complete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Complete Appointment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 mt-2">
                      <Label>Doctor's Notes *</Label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Clinical observations, recommendations, follow-up instructions..."
                        rows={4}
                        className="resize-none"
                      />
                      <Button
                        className="w-full"
                        onClick={() => handleComplete(appt.id)}
                        disabled={completeAppt.isPending}
                      >
                        {completeAppt.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        {completeAppt.isPending
                          ? "Saving..."
                          : "Mark as Completed"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
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
      <div>
        <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {appointments.length} total · {pending.length} pending
        </p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="grid grid-cols-4 w-full text-xs">
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="confirmed">
            Confirmed ({confirmed.length})
          </TabsTrigger>
          <TabsTrigger value="completed">Done ({completed.length})</TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelled.length})
          </TabsTrigger>
        </TabsList>
        {[
          { value: "pending", data: pending },
          { value: "confirmed", data: confirmed },
          { value: "completed", data: completed },
          { value: "cancelled", data: cancelled },
        ].map(({ value, data }) => (
          <TabsContent key={value} value={value} className="mt-4 space-y-3">
            {data.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                No {value} appointments
              </p>
            ) : (
              data.map((appt) => <AppointmentCard key={appt.id} appt={appt} />)
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
