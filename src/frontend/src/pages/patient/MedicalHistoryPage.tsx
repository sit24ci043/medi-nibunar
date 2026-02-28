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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { MEDICAL_CATEGORIES } from "@/data/mockData";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useAddMedicalHistory, useMedicalHistory } from "@/hooks/useQueries";
import { Calendar, ClipboardList, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const categoryColors: Record<string, string> = {
  Diagnosis: "bg-blue-100 text-blue-800 border-blue-200",
  Surgery: "bg-red-100 text-red-800 border-red-200",
  Vaccination: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Allergy: "bg-amber-100 text-amber-800 border-amber-200",
  "Chronic Condition": "bg-purple-100 text-purple-800 border-purple-200",
  Hospitalization: "bg-orange-100 text-orange-800 border-orange-200",
  "Lab Report": "bg-teal-100 text-teal-800 border-teal-200",
  Imaging: "bg-indigo-100 text-indigo-800 border-indigo-200",
  Consultation: "bg-pink-100 text-pink-800 border-pink-200",
  Other: "bg-slate-100 text-slate-800 border-slate-200",
};

const sampleHistory = [
  {
    id: "mh-1",
    title: "Hypertension Diagnosis",
    description:
      "Diagnosed with stage 1 hypertension. Blood pressure consistently above 140/90 mmHg.",
    date: "2025-08-15",
    category: "Diagnosis",
    blobId: undefined,
  },
  {
    id: "mh-2",
    title: "COVID-19 Vaccination (Booster)",
    description:
      "Received Covishield booster dose. No adverse reactions noted.",
    date: "2025-05-20",
    category: "Vaccination",
    blobId: undefined,
  },
  {
    id: "mh-3",
    title: "Annual Blood Work",
    description:
      "Complete blood count, lipid panel, HbA1c. Results within normal range except slightly elevated LDL.",
    date: "2025-11-10",
    category: "Lab Report",
    blobId: undefined,
  },
];

export default function MedicalHistoryPage() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal() ?? null;
  const { data: history = [], isLoading } = useMedicalHistory(principal);
  const addEntry = useAddMedicalHistory();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Diagnosis");

  const allHistory = [
    ...history,
    ...(history.length === 0 ? sampleHistory : []),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !date) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      await addEntry.mutateAsync({
        title,
        description,
        date,
        category,
        blobId: null,
      });
      toast.success("Medical record added");
      setTitle("");
      setDescription("");
      setDate("");
      setCategory("Diagnosis");
      setOpen(false);
    } catch {
      toast.error("Failed to add record");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            Medical History
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your complete health records
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Medical Record</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Diabetes Diagnosis"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MEDICAL_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="desc">Description *</Label>
                <Textarea
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the medical event..."
                  rows={3}
                  className="resize-none"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={addEntry.isPending}
              >
                {addEntry.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {addEntry.isPending ? "Saving..." : "Save Record"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : allHistory.length === 0 ? (
        <div className="text-center py-12">
          <ClipboardList className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            No medical records yet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {allHistory.map((entry) => (
            <Card key={entry.id} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm text-foreground">
                        {entry.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`text-[10px] flex-shrink-0 ${categoryColors[entry.category] ?? categoryColors.Other}`}
                      >
                        {entry.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {entry.date}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {entry.description}
                    </p>
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
