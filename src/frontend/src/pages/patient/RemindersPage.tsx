import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useAddReminder,
  useReminders,
  useUpdateReminderStatus,
} from "@/hooks/useQueries";
import { AlarmClock, Calendar, Loader2, Pill, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const FREQUENCIES = [
  "Once daily",
  "Twice daily",
  "Three times daily",
  "Four times daily",
  "Every 8 hours",
  "Every 6 hours",
  "Weekly",
  "As needed",
];

const sampleReminders = [
  {
    id: "r-1",
    medicineName: "Metformin 500mg",
    dosage: "500mg",
    frequency: "Twice daily with meals",
    startDate: "2026-01-01",
    endDate: "2026-06-30",
    active: true,
  },
  {
    id: "r-2",
    medicineName: "Vitamin D3 1000IU",
    dosage: "1000 IU",
    frequency: "Once daily",
    startDate: "2026-01-15",
    endDate: "2026-07-15",
    active: true,
  },
  {
    id: "r-3",
    medicineName: "Atorvastatin 20mg",
    dosage: "20mg",
    frequency: "Once daily at bedtime",
    startDate: "2026-02-01",
    endDate: "2026-08-01",
    active: false,
  },
];

export default function RemindersPage() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal() ?? null;
  const { data: reminders = [], isLoading } = useReminders(principal);
  const addReminder = useAddReminder();
  const updateStatus = useUpdateReminderStatus();

  const [open, setOpen] = useState(false);
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("Once daily");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState("");

  const allReminders = [
    ...reminders,
    ...(reminders.length === 0 ? sampleReminders : []),
  ];
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicineName.trim() || !dosage.trim() || !endDate) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      await addReminder.mutateAsync({
        medicineName,
        dosage,
        frequency,
        startDate,
        endDate,
      });
      toast.success("Reminder added!");
      setMedicineName("");
      setDosage("");
      setEndDate("");
      setOpen(false);
    } catch {
      toast.error("Failed to add reminder");
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    // Only toggle real reminders, not sample ones
    const isReal = reminders.some((r) => r.id === id);
    if (!isReal) {
      toast.info("Demo reminder — connect to modify");
      return;
    }
    try {
      await updateStatus.mutateAsync({ reminderId: id, active });
    } catch {
      toast.error("Failed to update reminder");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <AlarmClock className="h-6 w-6 text-primary" />
            Medicine Reminders
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your medications
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Add Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Medicine Reminder</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="med">Medicine Name *</Label>
                <Input
                  id="med"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  placeholder="e.g., Amoxicillin 500mg"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dosage">Dosage *</Label>
                <Input
                  id="dosage"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="e.g., 500mg"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Frequency *</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FREQUENCIES.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="start">Start Date *</Label>
                  <Input
                    id="start"
                    type="date"
                    value={startDate}
                    min={today}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="end">End Date *</Label>
                  <Input
                    id="end"
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={addReminder.isPending}
              >
                {addReminder.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {addReminder.isPending ? "Adding..." : "Add Reminder"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 text-center">
          <p className="text-2xl font-bold text-primary">
            {allReminders.filter((r) => r.active).length}
          </p>
          <p className="text-xs text-muted-foreground">Active</p>
        </div>
        <div className="rounded-xl bg-muted p-3 text-center">
          <p className="text-2xl font-bold text-foreground">
            {allReminders.length}
          </p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : allReminders.length === 0 ? (
        <div className="text-center py-12">
          <AlarmClock className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No reminders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allReminders.map((reminder) => (
            <Card
              key={reminder.id}
              className={`shadow-card ${!reminder.active ? "opacity-60" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${reminder.active ? "bg-primary/10" : "bg-muted"}`}
                  >
                    <Pill
                      className={`h-5 w-5 ${reminder.active ? "text-primary" : "text-muted-foreground"}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {reminder.medicineName}
                      </p>
                      <Switch
                        checked={reminder.active}
                        onCheckedChange={(v) => handleToggle(reminder.id, v)}
                        aria-label={`Toggle ${reminder.medicineName} reminder`}
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px]">
                        {reminder.dosage}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {reminder.frequency}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1.5 text-[11px] text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {reminder.startDate} → {reminder.endDate}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
