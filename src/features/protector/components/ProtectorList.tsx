import { useState } from "react";
import { Phone, Mail, Trash2, UserPlus, Shield } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { EmptyState } from "@/shared/components/EmptyState";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { ErrorAlert } from "@/shared/components/ErrorAlert";
import { AssignProtectorDialog } from "@/features/protector/components/AssignProtectorDialog";
import {
  useProtectors,
  useRemoveProtector,
} from "@/features/protector/hooks/useProtectors";
import type { Protector } from "@/features/protector/types/protector.types";

interface ProtectorListProps {
  studentId: string;
}

const RELATIONSHIP_LABELS: Record<string, string> = {
  PARENT: "Parent",
  GUARDIAN: "Guardian",
  SIBLING: "Sibling",
  OTHER: "Other",
};

export function ProtectorList({ studentId }: ProtectorListProps) {
  const { data: protectors = [], isLoading, error } = useProtectors(studentId);
  const removeProtector = useRemoveProtector(studentId);

  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<Protector | null>(null);

  const handleConfirmRemove = async () => {
    if (!removeTarget) return;
    await removeProtector.mutateAsync(removeTarget.id);
    setRemoveTarget(null);
  };

  if (error) {
    return (
      <ErrorAlert
        title="Failed to load protectors"
        message={(error as { message: string }).message}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          {isLoading ? "..." : `${protectors.length} protector${protectors.length !== 1 ? "s" : ""}`}
        </p>
        <Button size="sm" onClick={() => setIsAssignOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Assign Protector
        </Button>
      </div>

      {!isLoading && protectors.length === 0 ? (
        <EmptyState
          title="No protectors assigned"
          description="Assign a parent or guardian to this student."
          icon={<Shield className="h-6 w-6 text-neutral-500" />}
          action={{ label: "Assign Protector", onClick: () => setIsAssignOpen(true) }}
        />
      ) : (
        <div className="rounded-md border border-neutral-200 divide-y divide-neutral-100 bg-white">
          {protectors.map((protector) => (
            <div key={protector.id} className="flex items-center gap-3 px-4 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-50 text-sm font-semibold text-secondary-700 uppercase">
                {protector.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm text-neutral-900 truncate">
                    {protector.name}
                  </p>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {RELATIONSHIP_LABELS[protector.relationship] ?? protector.relationship}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-neutral-500">
                  {protector.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {protector.email}
                    </span>
                  )}
                  {protector.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {protector.phone}
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                onClick={() => setRemoveTarget(protector)}
                aria-label={`Remove ${protector.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <AssignProtectorDialog
        isOpen={isAssignOpen}
        studentId={studentId}
        onClose={() => setIsAssignOpen(false)}
      />

      <ConfirmDialog
        isOpen={!!removeTarget}
        title="Remove Protector"
        description={`Remove "${removeTarget?.name}" as a protector for this student?`}
        confirmLabel="Remove"
        variant="destructive"
        isLoading={removeProtector.isPending}
        onConfirm={handleConfirmRemove}
        onClose={() => setRemoveTarget(null)}
      />
    </div>
  );
}
