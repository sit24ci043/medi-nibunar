import { Badge } from "@/components/ui/badge";
import { AppointmentStatus } from "../../../src/backend.d";

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus;
}

const statusConfig = {
  [AppointmentStatus.pending]: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  [AppointmentStatus.confirmed]: {
    label: "Confirmed",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  [AppointmentStatus.cancelled]: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  [AppointmentStatus.completed]: {
    label: "Completed",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
};

export function AppointmentStatusBadge({
  status,
}: AppointmentStatusBadgeProps) {
  const config =
    statusConfig[status] ?? statusConfig[AppointmentStatus.pending];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
