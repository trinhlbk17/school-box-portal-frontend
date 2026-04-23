import { useState } from "react";
import { Copy, Check, KeyRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

interface PasswordRevealDialogProps {
  isOpen: boolean;
  password: string;
  userName?: string;
  onClose: () => void;
}

export function PasswordRevealDialog({
  isOpen,
  password,
  userName,
  onClose,
}: PasswordRevealDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement("textarea");
      el.value = password;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <KeyRound className="h-6 w-6 text-amber-600" />
          </div>
          <DialogTitle className="text-center">
            {userName ? `Password for ${userName}` : "Temporary Password"}
          </DialogTitle>
          <DialogDescription className="text-center">
            Copy this password now — it will not be shown again.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <Input
            readOnly
            value={password}
            className="font-mono text-sm bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
            aria-label="Generated password"
          />
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 h-8 w-8 p-0"
            onClick={handleCopy}
            aria-label="Copy password"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4 text-neutral-500" />
            )}
          </Button>
        </div>

        <p className="text-xs text-neutral-500 text-center">
          Share this password securely with the user. They should change it on
          first login.
        </p>

        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
