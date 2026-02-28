import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SAMPLE_DOCTORS, SAMPLE_TIME_SLOTS } from "@/data/mockData";
import { useActor } from "@/hooks/useActor";
import { useCreateAppointment } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function BookAppointmentPage() {
  const { doctorId } = useParams({ from: "/patient/book/$doctorId" });
  const navigate = useNavigate();
  const createAppointment = useCreateAppointment();
  const { actor } = useActor();

  const doctor = SAMPLE_DOCTORS.find((d) => d.id === doctorId);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [reason, setReason] = useState("");
  const [booked, setBooked] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    if (!selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }
    if (!reason.trim()) {
      toast.error("Please enter a reason for the appointment");
      return;
    }
    if (!actor) {
      toast.error("Not connected");
      return;
    }

    try {
      // We use a dummy principal for sample doctors since they aren't real ICP principals
      // In production this would use the actual doctor's principal
      const principal = actor
        ? await actor.getCallerUserProfile().then((p) => p?.id)
        : null;
      if (!principal) throw new Error("Could not get principal");

      await createAppointment.mutateAsync({
        doctorId: principal, // Using caller's own principal as demo
        date: selectedDate,
        timeSlot: selectedSlot,
        reason: reason.trim(),
      });
      setBooked(true);
      toast.success("Appointment booked successfully!");
    } catch {
      toast.error("Failed to book appointment. Please try again.");
    }
  };

  if (!doctor) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Doctor not found</p>
        <Button
          variant="link"
          onClick={() => navigate({ to: "/patient/doctors" })}
        >
          Back to doctors
        </Button>
      </div>
    );
  }

  if (booked) {
    return (
      <div className="p-6 max-w-md mx-auto text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Appointment Booked!
        </h2>
        <p className="text-muted-foreground text-sm">
          Your appointment with <strong>{doctor.name}</strong> on{" "}
          <strong>{selectedDate}</strong> at <strong>{selectedSlot}</strong> has
          been submitted.
        </p>
        <p className="text-xs text-muted-foreground">
          You'll receive confirmation once the doctor accepts.
        </p>
        <div className="flex flex-col gap-2">
          <Button onClick={() => navigate({ to: "/patient/appointments" })}>
            View Appointments
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/patient/doctors" })}
          >
            Back to Doctors
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: "/patient/doctors" })}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Book Appointment
          </h1>
          <p className="text-sm text-muted-foreground">with {doctor.name}</p>
        </div>
      </div>

      {/* Doctor Card */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center text-lg font-bold text-primary">
              {doctor.name.split(" ").slice(-1)[0]?.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-foreground">{doctor.name}</p>
              <Badge
                variant="secondary"
                className="text-xs bg-teal-50 text-teal-700 border-teal-200"
              >
                {doctor.specialty}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Date */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="date"
              value={selectedDate}
              min={today}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
              className="text-foreground"
            />
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Select Time Slot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {SAMPLE_TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={cn(
                    "rounded-lg border py-2 text-sm font-medium transition-all",
                    selectedSlot === slot
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-foreground hover:border-primary/50",
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reason */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Reason for Visit</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Brief description of your symptoms or reason..."
              rows={3}
              required
              className="resize-none"
            />
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={createAppointment.isPending}
        >
          {createAppointment.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Calendar className="mr-2 h-4 w-4" />
          )}
          {createAppointment.isPending ? "Booking..." : "Confirm Appointment"}
        </Button>
      </form>
    </div>
  );
}
