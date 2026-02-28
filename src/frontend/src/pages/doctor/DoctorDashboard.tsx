import { AppointmentStatusBadge } from "@/components/shared/AppointmentStatusBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useAppointments, useCallerProfile } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Users,
} from "lucide-react";
import { AppointmentStatus } from "../../../src/backend.d";

export default function DoctorDashboard() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal() ?? null;
  const { data: profile } = useCallerProfile();
  const { data: appointments = [], isLoading } = useAppointments(principal);

  const today = new Date().toISOString().split("T")[0];
  const todayAppts = appointments.filter((a) => a.date === today);
  const pendingCount = appointments.filter(
    (a) => a.status === AppointmentStatus.pending,
  ).length;
  const confirmedCount = appointments.filter(
    (a) => a.status === AppointmentStatus.confirmed,
  ).length;
  const completedCount = appointments.filter(
    (a) => a.status === AppointmentStatus.completed,
  ).length;

  const uniquePatients = [
    ...new Set(appointments.map((a) => a.patientId.toString())),
  ].length;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {greeting}, {profile?.name?.split(" ")[0] ?? "Doctor"} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {profile?.specialty ?? "Specialist"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total Patients",
            value: uniquePatients,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Pending",
            value: pendingCount,
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Confirmed",
            value: confirmedCount,
            icon: Calendar,
            color: "text-teal-600",
            bg: "bg-teal-50",
          },
          {
            label: "Completed",
            value: completedCount,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
        ].map((stat) => (
          <Card key={stat.label} className="shadow-card">
            <CardContent className="p-4">
              <div
                className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}
              >
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {isLoading ? "—" : stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Appointments */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Today's Schedule
            </CardTitle>
            <Link
              to="/doctor/appointments"
              className="text-xs text-primary flex items-center gap-0.5 hover:underline"
            >
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : todayAppts.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No appointments today
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {todayAppts.map((appt) => (
                <div
                  key={appt.id}
                  className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {appt.reason || "Consultation"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {appt.timeSlot}
                    </p>
                  </div>
                  <AppointmentStatusBadge status={appt.status} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Upcoming Appointments</CardTitle>
            <Link
              to="/doctor/appointments"
              className="text-xs text-primary flex items-center gap-0.5 hover:underline"
            >
              All <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : (
            (() => {
              const upcoming = appointments
                .filter(
                  (a) =>
                    a.status === AppointmentStatus.pending ||
                    a.status === AppointmentStatus.confirmed,
                )
                .slice(0, 5);
              return upcoming.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">
                  No upcoming appointments
                </p>
              ) : (
                <div className="space-y-2">
                  {upcoming.map((appt) => (
                    <div
                      key={appt.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {appt.reason || "Consultation"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {appt.date} · {appt.timeSlot}
                        </p>
                      </div>
                      <AppointmentStatusBadge status={appt.status} />
                    </div>
                  ))}
                </div>
              );
            })()
          )}
        </CardContent>
      </Card>
    </div>
  );
}
