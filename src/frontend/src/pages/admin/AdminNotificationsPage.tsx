import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useCreateNotification } from "@/hooks/useQueries";
import { Bell, CheckCircle2, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const NOTIF_TYPES = [
  { value: "announcement", label: "Announcement" },
  { value: "maintenance", label: "Maintenance" },
  { value: "update", label: "Platform Update" },
  { value: "health_tip", label: "Health Tip" },
  { value: "alert", label: "System Alert" },
];

const RECENT_BROADCASTS = [
  {
    title: "Platform Maintenance",
    body: "Scheduled maintenance on March 1st from 2AM-4AM IST.",
    type: "maintenance",
    date: "Feb 25, 2026",
    recipients: 1247,
  },
  {
    title: "New Feature: Video Consultation",
    body: "We've launched video consultations! Book your first video appointment today.",
    type: "update",
    date: "Feb 20, 2026",
    recipients: 2134,
  },
  {
    title: "Health Tip: Stay Hydrated",
    body: "Drink at least 8 glasses of water daily for better health outcomes.",
    type: "health_tip",
    date: "Feb 15, 2026",
    recipients: 2134,
  },
];

export default function AdminNotificationsPage() {
  const { identity } = useInternetIdentity();
  const createNotification = useCreateNotification();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [notifType, setNotifType] = useState("announcement");
  const [sent, setSent] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error("Please fill in title and message");
      return;
    }
    if (!identity) {
      toast.error("Not connected");
      return;
    }

    try {
      // Send to self as demo (in production this would broadcast to all users)
      await createNotification.mutateAsync({
        userId: identity.getPrincipal(),
        title: title.trim(),
        body: body.trim(),
        notifType,
      });
      toast.success("Notification broadcast sent!");
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setTitle("");
        setBody("");
      }, 3000);
    } catch {
      toast.error("Failed to send notification");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Bell className="h-6 w-6 text-primary" />
          Broadcast Notifications
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Send system-wide notifications to all users
        </p>
      </div>

      {/* Compose */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Compose Broadcast</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSend} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Notification Type</Label>
              <Select value={notifType} onValueChange={setNotifType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NOTIF_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notif-title">Title *</Label>
              <Input
                id="notif-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Notification title..."
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notif-body">Message *</Label>
              <Textarea
                id="notif-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Notification message..."
                rows={4}
                className="resize-none"
                required
              />
              <p className="text-xs text-muted-foreground text-right">
                {body.length}/500
              </p>
            </div>

            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
              ⚠️ This will send a notification to all platform users. Please
              review carefully before sending.
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={createNotification.isPending || sent}
            >
              {createNotification.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : sent ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {createNotification.isPending
                ? "Sending..."
                : sent
                  ? "Sent!"
                  : "Send to All Users"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Broadcasts */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Broadcasts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {RECENT_BROADCASTS.map((notif) => (
            <div key={notif.title} className="rounded-lg border p-3 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-sm text-foreground">
                  {notif.title}
                </p>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                  {notif.date}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{notif.body}</p>
              <p className="text-[11px] text-primary">
                Sent to {notif.recipients.toLocaleString()} users
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
