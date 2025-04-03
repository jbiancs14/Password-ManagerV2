
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, CheckCircle2 } from "lucide-react";

interface RecoveryKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  recoveryKey: string;
}

export function RecoveryKeyModal({ isOpen, onClose, recoveryKey }: RecoveryKeyModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(recoveryKey);
    setCopied(true);
    toast.success("Recovery key copied to clipboard");
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md glass-morphism">
        <DialogHeader>
          <DialogTitle>Recovery Key</DialogTitle>
          <DialogDescription>
            Store this key in a secure location. It's required if you ever forget your master password.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 py-4">
          <div className="grid flex-1 gap-2">
            <div className="bg-gray-50 border rounded-md p-3 text-center font-mono tracking-wider text-sm">
              {recoveryKey}
            </div>
          </div>
          <Button size="icon" variant="outline" onClick={handleCopy} type="button">
            {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button type="button" variant="default" onClick={onClose}>
            I've Saved My Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RecoveryKeyModal;
