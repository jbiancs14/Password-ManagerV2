
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, Copy, Trash2 } from "lucide-react";
import { PasswordEntry as PasswordEntryType } from "@/hooks/usePasswordManager";

interface PasswordEntryProps {
  entry: PasswordEntryType;
  onDelete: (id: number) => Promise<boolean>;
}

const PasswordEntry = ({ entry, onDelete }: PasswordEntryProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(entry.password);
    toast.success("Password copied to clipboard");
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(entry.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="apple-card hover:shadow-md transition-shadow duration-200 slide-up">
      <CardContent className="p-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-base">{entry.website}</h3>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleCopy} 
                className="h-8 w-8 text-gray-500 hover:text-blue-500"
              >
                <Copy size={16} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowPassword(!showPassword)}
                className="h-8 w-8 text-gray-500 hover:text-blue-500"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-8 w-8 text-gray-500 hover:text-red-500"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-500">{entry.username}</p>
          <p className={`text-sm font-mono mt-1 ${showPassword ? '' : 'text-gray-900'}`}>
            {showPassword ? entry.password : '••••••••••••'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordEntry;
