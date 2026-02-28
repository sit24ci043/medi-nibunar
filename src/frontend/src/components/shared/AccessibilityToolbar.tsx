import { Button } from "@/components/ui/button";
import { Accessibility, X, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";

interface AccessibilityToolbarProps {
  largeText: boolean;
  onToggleLargeText: (val: boolean) => void;
}

export function AccessibilityToolbar({
  largeText,
  onToggleLargeText,
}: AccessibilityToolbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-20 left-4 z-50 md:bottom-6">
      {open && (
        <div className="mb-2 flex flex-col gap-2 rounded-xl border bg-card p-3 shadow-card-hover animate-slide-up">
          <p className="text-xs font-semibold text-muted-foreground">
            Accessibility
          </p>
          <Button
            variant={largeText ? "default" : "outline"}
            size="sm"
            className="gap-2 justify-start"
            onClick={() => onToggleLargeText(!largeText)}
          >
            {largeText ? (
              <ZoomOut className="h-4 w-4" />
            ) : (
              <ZoomIn className="h-4 w-4" />
            )}
            {largeText ? "Normal text" : "Large text"}
          </Button>
        </div>
      )}
      <Button
        size="icon"
        variant="outline"
        className="h-10 w-10 rounded-full shadow-card bg-card border-primary/30"
        onClick={() => setOpen((o) => !o)}
        aria-label="Accessibility options"
        aria-expanded={open}
      >
        {open ? (
          <X className="h-4 w-4" />
        ) : (
          <Accessibility className="h-4 w-4 text-primary" />
        )}
      </Button>
    </div>
  );
}
