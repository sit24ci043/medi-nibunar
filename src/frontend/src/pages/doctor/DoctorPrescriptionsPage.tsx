import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useCreatePrescription, usePrescriptions } from "@/hooks/useQueries";
import { Calendar, FileText, Loader2, Pill, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Medicine } from "../../backend.d";

export default function DoctorPrescriptionsPage() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal() ?? null;
  const { data: prescriptions = [], isLoading } = usePrescriptions(principal);
  const createPrescription = useCreatePrescription();

  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [dateIssued, setDateIssued] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [medicines, setMedicines] = useState<Medicine[]>([
    { medicineName: "", dosage: "", frequency: "" },
  ]);

  const addMedicine = () => {
    setMedicines((prev) => [
      ...prev,
      { medicineName: "", dosage: "", frequency: "" },
    ]);
  };

  const removeMedicine = (i: number) => {
    if (medicines.length === 1) return;
    setMedicines((prev) => prev.filter((_, idx) => idx !== i));
  };

  const updateMedicine = (i: number, field: keyof Medicine, value: string) => {
    setMedicines((prev) =>
      prev.map((m, idx) => (idx === i ? { ...m, [field]: value } : m)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!principal) return;
    if (medicines.some((m) => !m.medicineName.trim())) {
      toast.error("Please fill all medicine names");
      return;
    }
    try {
      await createPrescription.mutateAsync({
        patientId: principal, // Demo: self, in production use actual patient principal
        blobId: "",
        notes,
        dateIssued,
        medicineList: medicines,
      });
      toast.success("Prescription created");
      setOpen(false);
      setNotes("");
      setMedicines([{ medicineName: "", dosage: "", frequency: "" }]);
    } catch {
      toast.error("Failed to create prescription");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Prescriptions
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage patient prescriptions
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              New
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Prescription</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="date">Date Issued</Label>
                <Input
                  id="date"
                  type="date"
                  value={dateIssued}
                  onChange={(e) => setDateIssued(e.target.value)}
                />
              </div>

              {/* Medicines */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Medicines *</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addMedicine}
                    className="h-7 text-xs gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add
                  </Button>
                </div>
                {medicines.map((med, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: medicine list uses index as stable key during form editing
                  <div key={i} className="rounded-lg border p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-muted-foreground">
                        Medicine {i + 1}
                      </p>
                      {medicines.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeMedicine(i)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      )}
                    </div>
                    <Input
                      placeholder="Medicine name & strength (e.g., Amoxicillin 500mg)"
                      value={med.medicineName}
                      onChange={(e) =>
                        updateMedicine(i, "medicineName", e.target.value)
                      }
                      required
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Dosage"
                        value={med.dosage}
                        onChange={(e) =>
                          updateMedicine(i, "dosage", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Frequency"
                        value={med.frequency}
                        onChange={(e) =>
                          updateMedicine(i, "frequency", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5">
                <Label>Doctor's Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Instructions, warnings, follow-up advice..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={createPrescription.isPending}
              >
                {createPrescription.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {createPrescription.isPending
                  ? "Creating..."
                  : "Create Prescription"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No prescriptions yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Create your first prescription above
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((rx) => (
            <Card key={rx.id} className="shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Prescription</CardTitle>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {rx.dateIssued}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {rx.medicineList.map((med) => (
                    <div
                      key={med.medicineName}
                      className="flex items-center gap-2 rounded-lg bg-primary/5 p-2"
                    >
                      <Pill className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          {med.medicineName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {med.dosage} · {med.frequency}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {rx.notes && (
                  <div className="rounded-lg bg-muted/50 p-2 text-xs text-muted-foreground">
                    {rx.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
