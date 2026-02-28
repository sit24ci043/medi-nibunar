import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { usePrescriptions } from "@/hooks/useQueries";
import { Calendar, FileText, Pill } from "lucide-react";

export default function PrescriptionsPage() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal() ?? null;
  const { data: prescriptions = [], isLoading } = usePrescriptions(principal);

  // Add sample prescriptions for demo
  const samplePrescriptions = [
    {
      id: "rx-1",
      dateIssued: "2026-02-10",
      notes: "Take with food. Avoid alcohol. Complete the full course.",
      medicineList: [
        {
          medicineName: "Amoxicillin 500mg",
          dosage: "500mg",
          frequency: "3 times daily for 7 days",
        },
        {
          medicineName: "Paracetamol 650mg",
          dosage: "650mg",
          frequency: "As needed for fever/pain",
        },
      ],
    },
    {
      id: "rx-2",
      dateIssued: "2026-01-28",
      notes:
        "Monitor blood pressure regularly. Lifestyle modifications advised.",
      medicineList: [
        {
          medicineName: "Metformin 500mg",
          dosage: "500mg",
          frequency: "Twice daily with meals",
        },
        {
          medicineName: "Losartan 50mg",
          dosage: "50mg",
          frequency: "Once daily in morning",
        },
      ],
    },
  ];

  const allPrescriptions = [
    ...prescriptions,
    ...(prescriptions.length === 0 ? samplePrescriptions : []),
  ];

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-4 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Prescriptions
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Digital prescriptions from your doctors
        </p>
      </div>

      {allPrescriptions.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No prescriptions yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {allPrescriptions.map((rx) => (
            <Card key={rx.id} className="shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Prescription
                  </CardTitle>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {rx.dateIssued}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Medicines */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Prescribed Medicines
                  </p>
                  <div className="space-y-2">
                    {rx.medicineList.map((med) => (
                      <div
                        key={med.medicineName}
                        className="flex items-start gap-3 rounded-lg bg-primary/5 border border-primary/15 p-3"
                      >
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Pill className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground">
                            {med.medicineName}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className="text-[10px]">
                              {med.dosage}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {med.frequency}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {rx.notes && (
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                      Doctor's Notes
                    </p>
                    <p className="text-sm text-foreground">{rx.notes}</p>
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
