import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useMarkNotificationRead, useNotifications } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import {
  AlarmClock,
  Bell,
  Calendar,
  CheckCheck,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

const NOTIF_ICONS: Record<string, typeof Bell> = {
  appointment: Calendar,
  reminder: AlarmClock,
  message: MessageSquare,
  default: Bell,
};

const sampleNotifications = [
  {
    id: "n-1",
    title: "Appointment Confirmed",
    body: "Your appointment on Feb 28 at 10:00 AM has been confirmed.",
    notifType: "appointment",
    isRead: false,
    timestamp: BigInt(Date.now() * 1_000_000 - 3_600_000_000_000),
  },
  {
    id: "n-2",
    title: "Medicine Reminder",
    body: "Time to take your Metformin 500mg dose.",
    notifType: "reminder",
    isRead: false,
    timestamp: BigInt(Date.now() * 1_000_000 - 7_200_000_000_000),
  },
  {
    id: "n-3",
    title: "New Message",
    body: "Dr. Priya Sharma sent you a message.",
    notifType: "message",
    isRead: true,
    timestamp: BigInt(Date.now() * 1_000_000 - 86_400_000_000_000),
  },
  {
    id: "n-4",
    title: "Prescription Ready",
    body: "Dr. Rajesh Menon has issued a new prescription for you.",
    notifType: "prescription",
    isRead: true,
    timestamp: BigInt(Date.now() * 1_000_000 - 172_800_000_000_000),
  },
];

export default function NotificationsPage() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal() ?? null;
  const { data: notifications = [], isLoading } = useNotifications(principal);
  const markRead = useMarkNotificationRead();

  const allNotifs = [
    ...notifications,
    ...(notifications.length === 0 ? sampleNotifications : []),
  ];
  const unreadCount = allNotifs.filter((n) => !n.isRead).length;

  const handleMarkRead = async (id: string) => {
    const isReal = notifications.some((n) => n.id === id);
    if (!isReal) return;
    try {
      await markRead.mutateAsync(id);
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const formatTime = (timestamp: bigint) => {
    const ms = Number(timestamp) / 1_000_000;
    const now = Date.now();
    const diff = now - ms;
    const hours = Math.floor(diff / 3_600_000);
    const days = Math.floor(diff / 86_400_000);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {unreadCount} unread
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-muted-foreground"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : allNotifs.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {allNotifs.map((notif) => {
            const IconComponent =
              NOTIF_ICONS[notif.notifType] ?? NOTIF_ICONS.default;
            return (
              <Card
                key={notif.id}
                onClick={() => !notif.isRead && handleMarkRead(notif.id)}
                className={cn(
                  "shadow-card cursor-pointer transition-colors",
                  !notif.isRead && "border-primary/30 bg-primary/5",
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0",
                        !notif.isRead ? "bg-primary/15" : "bg-muted",
                      )}
                    >
                      <IconComponent
                        className={cn(
                          "h-4.5 w-4.5",
                          !notif.isRead
                            ? "text-primary"
                            : "text-muted-foreground",
                        )}
                        style={{ width: "1.125rem", height: "1.125rem" }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            "font-semibold text-sm",
                            !notif.isRead
                              ? "text-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          {notif.title}
                        </p>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {!notif.isRead && (
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          )}
                          <span className="text-[11px] text-muted-foreground">
                            {formatTime(notif.timestamp)}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {notif.body}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
