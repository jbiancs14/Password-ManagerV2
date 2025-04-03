
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LockKeyhole } from "lucide-react";
import { toast } from "sonner";

interface LoginFormProps {
  onLogin: (password: string) => Promise<boolean>;
  onResetClick: () => void;
  isLoading: boolean;
}

const LoginForm = ({ onLogin, onResetClick, isLoading }: LoginFormProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    console.log("Attempting login with password:", password);
    
    try {
      const success = await onLogin(password);
      if (!success) {
        setError("Invalid password. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login");
      toast.error("Login failed");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto slide-up">
      <Card className="apple-card overflow-hidden">
        <CardHeader className="bg-gradient-to-b from-blue-50 to-white pb-8 text-center">
          <div className="mx-auto bg-blue-500 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
            <LockKeyhole className="text-white" size={20} />
          </div>
          <CardTitle className="text-2xl font-semibold">Secure Password Vault</CardTitle>
          <CardDescription>Enter your master password to unlock</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="Master Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                  required
                  autoFocus
                />
                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button 
              type="submit" 
              className="w-full h-10" 
              disabled={isLoading}
            >
              {isLoading ? "Unlocking..." : "Unlock"}
            </Button>
            <Button 
              type="button" 
              variant="link" 
              onClick={onResetClick} 
              className="text-sm text-gray-500"
            >
              Forgot Master Password?
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;
