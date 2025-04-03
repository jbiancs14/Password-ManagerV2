
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound } from "lucide-react";

interface RecoveryFormProps {
  onRecovery: (key: string) => Promise<boolean>;
  onBackToLogin: () => void;
  isLoading: boolean;
}

const RecoveryForm = ({ onRecovery, onBackToLogin, isLoading }: RecoveryFormProps) => {
  const [recoveryKey, setRecoveryKey] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onRecovery(recoveryKey);
  };

  return (
    <div className="w-full max-w-md mx-auto slide-up">
      <Card className="apple-card overflow-hidden">
        <CardHeader className="bg-gradient-to-b from-blue-50 to-white pb-8 text-center">
          <div className="mx-auto bg-blue-500 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
            <KeyRound className="text-white" size={20} />
          </div>
          <CardTitle className="text-2xl font-semibold">Account Recovery</CardTitle>
          <CardDescription>Enter your recovery key to reset your password</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="recovery-key"
                  placeholder="Recovery Key"
                  value={recoveryKey}
                  onChange={(e) => setRecoveryKey(e.target.value)}
                  className="h-11 font-mono"
                  required
                  autoFocus
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button 
              type="submit" 
              className="w-full h-10" 
              disabled={isLoading || !recoveryKey}
            >
              {isLoading ? "Verifying..." : "Verify Key"}
            </Button>
            <Button 
              type="button" 
              variant="link" 
              onClick={onBackToLogin} 
              className="text-sm text-gray-500"
            >
              Back to Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default RecoveryForm;
