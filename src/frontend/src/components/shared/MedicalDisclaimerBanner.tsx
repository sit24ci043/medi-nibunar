import { AlertTriangle } from "lucide-react";

interface MedicalDisclaimerBannerProps {
  className?: string;
}

export function MedicalDisclaimerBanner({
  className = "",
}: MedicalDisclaimerBannerProps) {
  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 ${className}`}
    >
      <AlertTriangle
        className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600"
        aria-hidden="true"
      />
      <div className="text-sm">
        <span className="font-semibold">Medical Disclaimer: </span>
        This AI-powered symptom checker provides general health information
        only. It is <strong>not a diagnosis</strong> and should never replace
        consultation with a licensed medical professional. Always seek
        professional medical advice for health concerns.
      </div>
    </div>
  );
}
