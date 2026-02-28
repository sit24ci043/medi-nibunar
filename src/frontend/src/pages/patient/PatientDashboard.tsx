import { AppointmentStatusBadge } from "@/components/shared/AppointmentStatusBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useAppointments,
  useCallerProfile,
  useReminders,
} from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  AlarmClock,
  AlertCircle,
  Brain,
  Calendar,
  ChevronRight,
  ClipboardList,
  Pill,
  Stethoscope,
} from "lucide-react";
import { AppointmentStatus } from "../../../src/backend.d";

const quickActions = [
  {
    to: "/patient/symptom-checker",
    icon: Brain,
    label: "Symptom Checker",
    description: "AI-powered guidance",
    color: "bg-violet-50 text-violet-700 border-violet-200",
    iconBg: "bg-violet-100",
  },
  {
    to: "/patient/doctors",
    icon: Stethoscope,
    label: "Find a Doctor",
    description: "Book appointment",
    color: "bg-teal-50 text-teal-700 border-teal-200",
    iconBg: "bg-teal-100",
  },
  {
    to: "/patient/emergency",
    icon: AlertCircle,
    label: "Emergency",
    description: "SOS & Hospitals",
    color: "bg-red-50 text-red-700 border-red-200",
    iconBg: "bg-red-100",
  },
];

export default function PatientDashboard() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal() ?? null;
  const { data: profile } = useCallerProfile();
  const { data: appointments = [], isLoading: apptLoading } =
    useAppointments(principal);
  const { data: reminders = [], isLoading: remindersLoading } =
    useReminders(principal);

  const upcomingAppointments = appointments
    .filter(
      (a) =>
        a.status === AppointmentStatus.pending ||
        a.status === AppointmentStatus.confirmed,
    )
    .slice(0, 3);

  const activeReminders = reminders.filter((r) => r.active).slice(0, 4);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Welcome */}
      <div className="animate-slide-up">
        <h1 className="text-2xl font-bold text-foreground">
          {greeting}, {profile?.name?.split(" ")[0] ?? "there"} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          How are you feeling today? Let's take care of your health.
        </p>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-card ${action.color}`}
            >
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center ${action.iconBg}`}
              >
                <action.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-xs">{action.label}</p>
                <p className="text-[10px] opacity-70">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Upcoming Appointments */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Upcoming Appointments
            </CardTitle>
            <Link
              to="/patient/appointments"
              className="text-xs text-primary flex items-center gap-0.5 hover:underline"
            >
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {apptLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No upcoming appointments
              </p>
              <Link
                to="/patient/doctors"
                className="text-xs text-primary hover:underline mt-1 inline-block"
              >
                Book your first appointment →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {appt.reason || "Medical Consultation"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {appt.date} · {appt.timeSlot}
                    </p>
                  </div>
                  <AppointmentStatusBadge status={appt.status} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Medicine Reminders */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <AlarmClock className="h-4 w-4 text-primary" />
              Active Reminders
            </CardTitle>
            <Link
              to="/patient/reminders"
              className="text-xs text-primary flex items-center gap-0.5 hover:underline"
            >
              Manage <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {remindersLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : activeReminders.length === 0 ? (
            <div className="text-center py-6">
              <AlarmClock className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No active reminders
              </p>
              <Link
                to="/patient/reminders"
                className="text-xs text-primary hover:underline mt-1 inline-block"
              >
                Add a reminder →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {activeReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="rounded-lg border bg-primary/5 border-primary/20 p-3"
                >
                  <p className="font-medium text-sm text-foreground truncate">
                    {reminder.medicineName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {reminder.dosage} · {reminder.frequency}
                  </p>
                  <Badge
                    variant="secondary"
                    className="mt-1.5 text-[10px] bg-emerald-100 text-emerald-700"
                  >
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/patient/medical-history"
          className="rounded-xl border bg-card p-4 shadow-card card-hover flex items-center gap-3"
        >
          <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <ClipboardList className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-sm">Medical History</p>
            <p className="text-xs text-muted-foreground">View records</p>
          </div>
        </Link>
        <Link
          to="/patient/prescriptions"
          className="rounded-xl border bg-card p-4 shadow-card card-hover flex items-center gap-3"
        >
          <div className="h-9 w-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
            <Pill className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-sm">Prescriptions</p>
            <p className="text-xs text-muted-foreground">From doctors</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
