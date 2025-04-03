
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LockKeyhole, ShieldCheck } from "lucide-react";

interface SetMasterPasswordProps {
  onSetPassword: (password: string, confirmPassword: string) => Promise<{ success: boolean, recoveryKey: string }>;
  isLoading: boolean;
}

const SetMasterPassword = ({ onSetPassword, isLoading }: SetMasterPasswordProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (pass.match(/[A-Z]/)) strength += 1;
    if (pass.match(/[0-9]/)) strength += 1;
    if (pass.match(/[^A-Za-z0-9]/)) strength += 1;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return;
    }
    await onSetPassword(password, confirmPassword);
  };

  return (
    <div className="w-full max-w-md mx-auto slide-up">
      <Card className="apple-card overflow-hidden">
        <CardHeader className="bg-gradient-to-b from-blue-50 to-white pb-8 text-center">
          <div className="mx-auto bg-blue-500 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
            <ShieldCheck className="text-white" size={20} />
          </div>
          <CardTitle className="text-2xl font-semibold">Create Master Password</CardTitle>
          <CardDescription>Choose a strong, memorable password</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="new-password"
                  type="password"
                  placeholder="New Master Password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="h-11"
                  required
                  autoFocus
                />
                
                {/* Password strength indicator */}
                {password && (
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        passwordStrength === 0 ? 'bg-red-500 w-1/4' : 
                        passwordStrength === 1 ? 'bg-orange-500 w-2/4' : 
                        passwordStrength === 2 ? 'bg-yellow-500 w-3/4' : 
                        'bg-green-500 w-full'
                      }`}
                    ></div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm Master Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11"
                  required
                />
                
                {password && confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-500">Passwords don't match</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full h-10" 
              disabled={isLoading || !password || password !== confirmPassword}
            >
              {isLoading ? "Creating..." : "Create Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SetMasterPassword;
