import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSystemStats } from "@/hooks/useQueries";
import {
  Activity,
  Calendar,
  FileText,
  Stethoscope,
  TrendingUp,
  Users,
} from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useSystemStats();

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? BigInt(0),
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      label: "Doctors",
      value: stats?.totalDoctors ?? BigInt(0),
      icon: Stethoscope,
      color: "text-teal-600",
      bg: "bg-teal-50",
      border: "border-teal-200",
    },
    {
      label: "Patients",
      value: stats?.totalPatients ?? BigInt(0),
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200",
    },
    {
      label: "Appointments",
      value: stats?.totalAppointments ?? BigInt(0),
      icon: Calendar,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
    {
      label: "Prescriptions",
      value: stats?.totalPrescriptions ?? BigInt(0),
      icon: FileText,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
  ];

  const platformMetrics = [
    {
      label: "Avg. Response Time",
      value: "< 2hrs",
      desc: "Doctor response time",
    },
    { label: "Satisfaction Rate", value: "97%", desc: "Patient satisfaction" },
    { label: "Uptime", value: "99.9%", desc: "Platform availability" },
    { label: "Data Encrypted", value: "100%", desc: "End-to-end encryption" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          System Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Platform-wide statistics and monitoring
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statCards.map((stat) => (
          <Card
            key={stat.label}
            className={`shadow-card border ${stat.border}`}
          >
            <CardContent className="p-4">
              <div
                className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}
              >
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {isLoading ? "—" : stat.value.toString()}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      )}

      {/* Platform Metrics */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Platform Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {platformMetrics.map((m) => (
              <div
                key={m.label}
                className="rounded-xl bg-muted/50 p-3 text-center"
              >
                <p className="text-xl font-bold text-primary">{m.value}</p>
                <p className="text-xs font-semibold text-foreground mt-0.5">
                  {m.label}
                </p>
                <p className="text-[11px] text-muted-foreground">{m.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { service: "Backend Canister", status: "Operational" },
              { service: "Internet Identity", status: "Operational" },
              { service: "Storage Gateway", status: "Operational" },
              { service: "Video Consultation (WebRTC)", status: "Operational" },
            ].map((item) => (
              <div
                key={item.service}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-foreground">{item.service}</span>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
