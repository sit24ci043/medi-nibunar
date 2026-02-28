import { NotificationBell } from "@/components/shared/NotificationBell";
import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useCallerProfile } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Calendar,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  UserCircle,
  Users,
  X,
} from "lucide-react";
import { type ReactNode, useState } from "react";

const navItems = [
  { to: "/doctor/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/doctor/appointments", icon: Calendar, label: "Appointments" },
  { to: "/doctor/patients", icon: Users, label: "My Patients" },
  { to: "/doctor/chat", icon: MessageSquare, label: "Messages" },
  { to: "/doctor/prescriptions", icon: FileText, label: "Prescriptions" },
  { to: "/doctor/profile", icon: UserCircle, label: "My Profile" },
];

interface DoctorLayoutProps {
  children: ReactNode;
}

export function DoctorLayout({ children }: DoctorLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { clear } = useInternetIdentity();
  const { data: profile } = useCallerProfile();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[oklch(0.2_0.06_210)] text-white flex-shrink-0">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <img
            src="/assets/generated/medi-nibunar-logo-transparent.dim_200x200.png"
            alt="Medi-Nibunar"
            className="h-9 w-9 rounded-lg object-contain bg-white/10"
          />
          <div>
            <p className="font-bold text-sm leading-none text-white">
              Medi-Nibunar
            </p>
            <p className="text-[11px] text-white/50 mt-0.5">Doctor Portal</p>
          </div>
        </div>

        <div className="px-3 py-3 border-b border-white/10">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <div className="h-8 w-8 rounded-full bg-primary/40 flex items-center justify-center text-sm font-bold text-white">
              {profile?.name?.charAt(0)?.toUpperCase() ?? "D"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {profile?.name ?? "Doctor"}
              </p>
              <p className="text-[11px] text-white/50">
                {profile?.specialty ?? "Specialist"}
              </p>
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
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white",
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-white/10">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-white/60 hover:text-white hover:bg-white/10 text-sm"
            onClick={() => clear()}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
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
          "fixed inset-y-0 left-0 z-50 w-72 bg-[oklch(0.2_0.06_210)] text-white flex flex-col transition-transform duration-300 md:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <p className="font-bold text-sm text-white">Medi-Nibunar</p>
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close"
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
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-40" />
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-3 border-t border-white/10">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-white/60 hover:text-white text-sm"
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

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
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
              Doctor Portal
            </span>
          </div>
          <Link to="/doctor/dashboard">
            <NotificationBell />
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">{children}</main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex bg-card border-t border-border md:hidden bottom-nav-safe">
        {navItems.slice(0, 5).map((item) => {
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
              {item.label.split(" ")[0]}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
