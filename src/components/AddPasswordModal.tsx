
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { PlusCircle, RefreshCw } from "lucide-react";

interface AddPasswordModalProps {
  onAddPassword: (website: string, username: string, password: string) => Promise<boolean>;
  onGeneratePassword: (length: number) => Promise<string>;
}

const AddPasswordModal = ({ onAddPassword, onGeneratePassword }: AddPasswordModalProps) => {
  const [open, setOpen] = useState(false);
  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordLength, setPasswordLength] = useState(14);
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePassword = async () => {
    setIsLoading(true);
    try {
      const generatedPassword = await onGeneratePassword(passwordLength);
      setPassword(generatedPassword);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await onAddPassword(website, username, password);
      if (success) {
        setWebsite("");
        setUsername("");
        setPassword("");
        setOpen(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 h-10">
          <PlusCircle size={16} />
          Add Password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md glass-morphism">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Password</DialogTitle>
            <DialogDescription>
              Save a new website login to your secure vault.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="example.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username or Email</Label>
              <Input
                id="username"
                placeholder="user@example.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGeneratePassword}
                  className="h-7 gap-1 text-xs"
                  disabled={isLoading}
                >
                  <RefreshCw size={12} />
                  Generate
                </Button>
              </div>
              <Input
                id="password"
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="font-mono"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password-length">Password Length: {passwordLength}</Label>
                <span className="text-xs text-gray-500">{passwordLength} characters</span>
              </div>
              <Slider
                defaultValue={[passwordLength]}
                min={8}
                max={32}
                step={1}
                onValueChange={(values) => setPasswordLength(values[0])}
                className="py-4"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPasswordModal;
