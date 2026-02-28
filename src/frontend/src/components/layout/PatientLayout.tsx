import { AccessibilityToolbar } from "@/components/shared/AccessibilityToolbar";
import { EmergencyFAB } from "@/components/shared/EmergencyFAB";
import { NotificationBell } from "@/components/shared/NotificationBell";
import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useCallerProfile, useSaveProfile } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  AlarmClock,
  AlertCircle,
  Bell,
  Brain,
  Calendar,
  ChevronRight,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Stethoscope,
  X,
} from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";

const navItems = [
  { to: "/patient/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/patient/symptom-checker", icon: Brain, label: "Symptom Checker" },
  { to: "/patient/doctors", icon: Stethoscope, label: "Find Doctors" },
  { to: "/patient/appointments", icon: Calendar, label: "Appointments" },
  { to: "/patient/chat", icon: MessageSquare, label: "Messages" },
  { to: "/patient/prescriptions", icon: FileText, label: "Prescriptions" },
  {
    to: "/patient/medical-history",
    icon: ClipboardList,
    label: "Medical History",
  },
  { to: "/patient/reminders", icon: AlarmClock, label: "Reminders" },
  { to: "/patient/emergency", icon: AlertCircle, label: "Emergency" },
  { to: "/patient/notifications", icon: Bell, label: "Notifications" },
  { to: "/patient/settings", icon: Settings, label: "Settings" },
];

const bottomNavItems = [
  { to: "/patient/dashboard", icon: LayoutDashboard, label: "Home" },
  { to: "/patient/symptom-checker", icon: Brain, label: "Symptoms" },
  { to: "/patient/appointments", icon: Calendar, label: "Appointments" },
  { to: "/patient/chat", icon: MessageSquare, label: "Chat" },
  { to: "/patient/settings", icon: Settings, label: "Settings" },
];

interface PatientLayoutProps {
  children: ReactNode;
}

export function PatientLayout({ children }: PatientLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { clear } = useInternetIdentity();
  const { data: profile } = useCallerProfile();
  const saveProfile = useSaveProfile();
  const location = useLocation();

  const [largeText, setLargeText] = useState(profile?.largeTextMode ?? false);

  useEffect(() => {
    if (profile) {
      setLargeText(profile.largeTextMode);
    }
  }, [profile]);

  useEffect(() => {
    if (largeText) {
      document.documentElement.classList.add("large-text");
    } else {
      document.documentElement.classList.remove("large-text");
    }
  }, [largeText]);

  const handleToggleLargeText = (val: boolean) => {
    setLargeText(val);
    if (profile) {
      saveProfile.mutate({ ...profile, largeTextMode: val });
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 sidebar-gradient text-sidebar-foreground flex-shrink-0">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
          <img
            src="/assets/generated/medi-nibunar-logo-transparent.dim_200x200.png"
            alt="Medi-Nibunar"
            className="h-9 w-9 rounded-lg object-contain bg-white/10"
          />
          <div>
            <p className="font-bold text-sm leading-none text-white">
              Medi-Nibunar
            </p>
            <p className="text-[11px] text-sidebar-foreground/60 mt-0.5">
              Patient Portal
            </p>
          </div>
        </div>

        <div className="px-3 py-3 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <div className="h-8 w-8 rounded-full bg-primary/30 flex items-center justify-center text-sm font-bold text-white">
              {profile?.name?.charAt(0)?.toUpperCase() ?? "P"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {profile?.name ?? "Patient"}
              </p>
              <p className="text-[11px] text-sidebar-foreground/50">Patient</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.to ||
              location.pathname.startsWith(`${item.to}/`);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-white"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-white",
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
                {item.to === "/patient/emergency" && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-destructive animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent/60 text-sm"
            onClick={() => clear()}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 md:hidden cursor-default"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
          tabIndex={-1}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 sidebar-gradient text-sidebar-foreground flex flex-col transition-transform duration-300 md:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/medi-nibunar-logo-transparent.dim_200x200.png"
              alt="Medi-Nibunar"
              className="h-8 w-8 rounded object-contain bg-white/10"
            />
            <p className="font-bold text-sm text-white">Medi-Nibunar</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                  isActive
                    ? "bg-sidebar-accent text-white"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-white",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-40" />
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-3 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent/60 text-sm"
            onClick={() => {
              clear();
              setSidebarOpen(false);
            }}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 py-3 bg-card border-b border-border h-14 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <span className="font-semibold text-sm text-foreground/70 hidden md:block">
              Patient Portal
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Link to="/patient/notifications">
              <NotificationBell />
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">{children}</main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex bg-card border-t border-border md:hidden bottom-nav-safe">
        {bottomNavItems.map((item) => {
          const isActive =
            location.pathname === item.to ||
            location.pathname.startsWith(`${item.to}/`);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon
                className={cn("h-5 w-5", isActive && "text-primary")}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <EmergencyFAB />
      <AccessibilityToolbar
        largeText={largeText}
        onToggleLargeText={handleToggleLargeText}
      />
    </div>
  );
}
