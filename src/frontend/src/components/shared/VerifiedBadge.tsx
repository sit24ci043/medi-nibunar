import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { VerificationStatus } from "../../../src/backend.d";

interface VerifiedBadgeProps {
  status: VerificationStatus;
  className?: string;
}

export function VerifiedBadge({ status, className = "" }: VerifiedBadgeProps) {
  if (status === VerificationStatus.approved) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs font-semibold text-teal-700 ${className}`}
      >
        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
        Verified
      </span>
    );
  }
  if (status === VerificationStatus.pending) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs font-semibold text-amber-700 ${className}`}
      >
        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
        Pending Verification
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold text-red-700 ${className}`}
    >
      <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
      Not Verified
    </span>
  );
}
