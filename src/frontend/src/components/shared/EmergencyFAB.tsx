import { useNavigate } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";

export function EmergencyFAB() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate({ to: "/patient/emergency" })}
      className="fixed bottom-24 right-4 z-50 flex h-14 w-14 flex-col items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-emergency emergency-pulse hover:bg-destructive/90 active:scale-95 transition-transform md:bottom-8"
      aria-label="Emergency SOS - Navigate to emergency page"
    >
      <AlertCircle className="h-7 w-7" />
      <span className="text-[9px] font-bold leading-tight mt-0.5">SOS</span>
    </button>
  );
}
