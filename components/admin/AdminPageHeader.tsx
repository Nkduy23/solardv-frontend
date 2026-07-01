import { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

export function AdminPageHeader({ title, description, action, onAction }: { title: string; description?: string; action?: string; onAction?: () => void }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 className="font-display text-xl font-semibold text-navy">{title}</h2>
        {description && <p className="mt-1 text-sm text-navy/50">{description}</p>}
      </div>
      {action && onAction && (
        <Button variant="primary" onClick={onAction}>
          <Plus size={15} />
          {action}
        </Button>
      )}
    </div>
  );
}
