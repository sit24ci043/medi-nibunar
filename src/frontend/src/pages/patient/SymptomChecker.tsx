import { MedicalDisclaimerBanner } from "@/components/shared/MedicalDisclaimerBanner";
import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import { SAMPLE_SYMPTOMS } from "@/data/mockData";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useCheckSymptoms, useSymptomQueryLog } from "@/hooks/useQueries";
import {
  AlertCircle,
  Brain,
  ChevronDown,
  ChevronUp,
  Clock,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { SymptomCheckerResult } from "../../backend.d";

function SeverityBadge({ hint }: { hint: string }) {
  const lower = hint.toLowerCase();
  if (lower.includes("high") || lower.includes("severe")) {
    return (
      <Badge className="bg-red-100 text-red-800 border-red-200">
        ⚠️ High Severity
      </Badge>
    );
  }
  if (lower.includes("medium") || lower.includes("moderate")) {
    return (
      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
        ⚡ Moderate
      </Badge>
    );
  }
  return (
    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
      ✓ Low Severity
    </Badge>
  );
}

function ResultCard({ result }: { result: SymptomCheckerResult }) {
  const lower = result.severityHint.toLowerCase();
  const severityClass =
    lower.includes("high") || lower.includes("severe")
      ? "border-red-200 bg-red-50"
      : lower.includes("medium") || lower.includes("moderate")
        ? "border-amber-200 bg-amber-50"
        : "border-emerald-200 bg-emerald-50";

  return (
    <div className={`rounded-xl border p-5 space-y-4 ${severityClass}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base text-foreground">
          AI Analysis Results
        </h3>
        <SeverityBadge hint={result.severityHint} />
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
            Possible Related Conditions
          </p>
          <div className="flex flex-wrap gap-1.5">
            {result.relatedConditions.length > 0 ? (
              result.relatedConditions.map((cond) => (
                <Badge key={cond} variant="outline" className="text-xs">
                  {cond}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                No specific conditions identified
              </span>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
            Recommended Action
          </p>
          <p className="text-sm text-foreground">{result.recommendedAction}</p>
        </div>
      </div>

      <div className="rounded-lg border border-amber-300 bg-amber-100 p-3 flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800">{result.disclaimer}</p>
      </div>
    </div>
  );
}

export default function SymptomChecker() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal() ?? null;
  const checkSymptoms = useCheckSymptoms();
  const { data: queryLog = [], isLoading: logLoading } =
    useSymptomQueryLog(principal);

  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [result, setResult] = useState<SymptomCheckerResult | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const addSymptom = (sym: string) => {
    const trimmed = sym.trim();
    if (!trimmed) return;
    if (symptoms.includes(trimmed)) {
      toast.error("Symptom already added");
      return;
    }
    setSymptoms((prev) => [...prev, trimmed]);
    setInputValue("");
  };

  const removeSymptom = (sym: string) => {
    setSymptoms((prev) => prev.filter((s) => s !== sym));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (symptoms.length === 0) {
      toast.error("Please add at least one symptom");
      return;
    }
    try {
      const res = await checkSymptoms.mutateAsync({
        symptoms,
        age: age ? BigInt(Number.parseInt(age)) : undefined,
        gender: gender || undefined,
      });
      setResult(res);
    } catch {
      toast.error("Failed to analyze symptoms. Please try again.");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          AI Symptom Checker
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Describe your symptoms to get AI-powered health guidance.
        </p>
      </div>

      <MedicalDisclaimerBanner />

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Enter Your Symptoms</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Symptom Input */}
            <div className="space-y-2">
              <Label>Symptoms *</Label>
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a symptom..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSymptom(inputValue);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => addSymptom(inputValue)}
                  aria-label="Add symptom"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Symptom chips */}
              {symptoms.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {symptoms.map((sym) => (
                    <span
                      key={sym}
                      className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium"
                    >
                      {sym}
                      <button
                        type="button"
                        onClick={() => removeSymptom(sym)}
                        className="hover:text-destructive transition-colors"
                        aria-label={`Remove ${sym}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Quick add symptoms */}
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">
                  Common symptoms:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_SYMPTOMS.filter((s) => !symptoms.includes(s))
                    .slice(0, 10)
                    .map((sym) => (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => addSymptom(sym)}
                        className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                      >
                        + {sym}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* Age & Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="age">Age (optional)</Label>
                <Input
                  id="age"
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Your age"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Gender (optional)</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">
                      Other / Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={checkSymptoms.isPending || symptoms.length === 0}
            >
              {checkSymptoms.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Analyze Symptoms
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {result && <ResultCard result={result} />}

      {/* History */}
      <div>
        <button
          type="button"
          onClick={() => setShowHistory((v) => !v)}
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <Clock className="h-4 w-4" />
          Past Queries
          {showHistory ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>

        {showHistory && (
          <div className="mt-3 space-y-2">
            {logLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : queryLog.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No previous queries
              </p>
            ) : (
              queryLog.map((query) => (
                <div
                  key={`${query.timestamp.toString()}-${query.input.symptoms[0]}`}
                  className="rounded-lg border bg-card p-3 space-y-1"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      {query.input.symptoms.slice(0, 4).map((s) => (
                        <Badge
                          key={s}
                          variant="secondary"
                          className="text-[10px]"
                        >
                          {s}
                        </Badge>
                      ))}
                      {query.input.symptoms.length > 4 && (
                        <Badge variant="secondary" className="text-[10px]">
                          +{query.input.symptoms.length - 4} more
                        </Badge>
                      )}
                    </div>
                    <SeverityBadge hint={query.result.severityHint} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {query.result.recommendedAction}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
