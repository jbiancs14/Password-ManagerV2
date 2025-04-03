
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, LogOut } from "lucide-react";
import PasswordEntry from "@/components/PasswordEntry";
import AddPasswordModal from "@/components/AddPasswordModal";
import { PasswordEntry as PasswordEntryType } from "@/hooks/usePasswordManager";

interface PasswordVaultProps {
  entries: PasswordEntryType[];
  onAddPassword: (website: string, username: string, password: string) => Promise<boolean>;
  onDeletePassword: (id: number) => Promise<boolean>;
  onGeneratePassword: (length: number) => Promise<string>;
  onLogout: () => void;
}

const PasswordVault = ({ 
  entries, 
  onAddPassword, 
  onDeletePassword, 
  onGeneratePassword, 
  onLogout 
}: PasswordVaultProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEntries = entries.filter((entry) => 
    entry.website.toLowerCase().includes(searchTerm.toLowerCase()) || 
    entry.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container max-w-3xl mx-auto p-4 fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Secure Password Vault</h1>
        <Button variant="ghost" size="icon" onClick={onLogout}>
          <LogOut size={18} />
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full md:w-2/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search passwords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <AddPasswordModal onAddPassword={onAddPassword} onGeneratePassword={onGeneratePassword} />
      </div>
      
      {filteredEntries.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
            <Search className="text-gray-400" size={24} />
          </div>
          {searchTerm ? (
            <>
              <h3 className="font-medium text-gray-700 mb-1">No matching passwords</h3>
              <p className="text-gray-500 text-sm">Try a different search term</p>
            </>
          ) : (
            <>
              <h3 className="font-medium text-gray-700 mb-1">No passwords yet</h3>
              <p className="text-gray-500 text-sm">Add your first password to get started</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredEntries.map((entry) => (
            <PasswordEntry 
              key={entry.id} 
              entry={entry} 
              onDelete={onDeletePassword} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PasswordVault;
