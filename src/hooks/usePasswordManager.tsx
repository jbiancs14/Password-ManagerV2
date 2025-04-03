import { useState, useEffect } from 'react';
import { toast } from "sonner";

// Types
export interface PasswordEntry {
  id: number;
  website: string;
  username: string;
  password: string;
}

interface PasswordManagerState {
  isAuthenticated: boolean;
  hasMasterPassword: boolean;
  entries: PasswordEntry[];
  isLoading: boolean;
}

// Mock functions to simulate backend functionality
// In a real implementation, these would connect to actual backend APIs
const mockApi = {
  checkMasterPassword: (password: string): Promise<boolean> => {
    return new Promise(resolve => {
      // For testing purposes, use 'apple123' as the password
      setTimeout(() => resolve(password === 'apple123'), 500);
    });
  },
  
  checkRecoveryKey: (key: string): Promise<boolean> => {
    return new Promise(resolve => {
      // For testing purposes, use 'recovery123' as the recovery key
      console.log("Checking recovery key:", key);
      setTimeout(() => resolve(key === 'recovery123'), 500);
    });
  },
  
  createMasterPassword: (password: string): Promise<{success: boolean, recoveryKey: string}> => {
    return new Promise(resolve => {
      setTimeout(() => resolve({
        success: true,
        // For testing purposes, generate a predictable recovery key
        recoveryKey: 'recovery123'
      }), 500);
    });
  },
  
  getEntries: (): Promise<PasswordEntry[]> => {
    return new Promise(resolve => {
      setTimeout(() => resolve([
        { id: 1, website: 'example.com', username: 'user@example.com', password: 'password123' },
        { id: 2, website: 'github.com', username: 'developer', password: 'securepass456' },
        { id: 3, website: 'gmail.com', username: 'user@gmail.com', password: 'gmailpass789' }
      ]), 500);
    });
  },
  
  addEntry: (entry: Omit<PasswordEntry, 'id'>): Promise<PasswordEntry> => {
    return new Promise(resolve => {
      setTimeout(() => resolve({
        id: Date.now(),
        ...entry
      }), 500);
    });
  },
  
  deleteEntry: (id: number): Promise<boolean> => {
    return new Promise(resolve => {
      setTimeout(() => resolve(true), 500);
    });
  },
  
  generatePassword: (length: number): Promise<string> => {
    return new Promise(resolve => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
      let password = '';
      for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setTimeout(() => resolve(password), 100);
    });
  }
};

export const usePasswordManager = () => {
  const [state, setState] = useState<PasswordManagerState>({
    isAuthenticated: false,
    hasMasterPassword: true, // Assuming we have a master password set up initially
    entries: [],
    isLoading: false
  });

  // Fetch password entries when authenticated
  useEffect(() => {
    if (state.isAuthenticated) {
      fetchEntries();
    }
  }, [state.isAuthenticated]);

  const fetchEntries = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const entries = await mockApi.getEntries();
      setState(prev => ({ ...prev, entries, isLoading: false }));
    } catch (error) {
      toast.error("Failed to fetch password entries");
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const login = async (password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const isValid = await mockApi.checkMasterPassword(password);
      console.log("Login attempt with password:", password, "Valid:", isValid);
      
      if (isValid) {
        setState(prev => ({ ...prev, isAuthenticated: true, isLoading: false }));
        toast.success("Login successful");
        return true;
      } else {
        toast.error("Invalid password");
        setState(prev => ({ ...prev, isLoading: false }));
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const recoverAccount = async (recoveryKey: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const isValid = await mockApi.checkRecoveryKey(recoveryKey);
      console.log("Recovery key valid:", isValid);
      
      if (isValid) {
        // Important: We need to set isAuthenticated to false here to ensure the user
        // is redirected to the password creation screen
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          hasMasterPassword: false, // Force user to create a new master password
          isAuthenticated: false    // Ensure user is not considered logged in yet
        }));
        toast.success("Recovery key accepted");
        return true;
      } else {
        toast.error("Invalid recovery key");
        setState(prev => ({ ...prev, isLoading: false }));
        return false;
      }
    } catch (error) {
      console.error("Recovery error:", error);
      toast.error("Recovery failed");
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const createMasterPassword = async (password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return { success: false, recoveryKey: '' };
    }

    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const result = await mockApi.createMasterPassword(password);
      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          hasMasterPassword: true,
          // Don't set isAuthenticated to true here
        }));
        toast.success("Master password created");
      } else {
        toast.error("Failed to create master password");
        setState(prev => ({ ...prev, isLoading: false }));
      }
      return result;
    } catch (error) {
      toast.error("Failed to create master password");
      setState(prev => ({ ...prev, isLoading: false }));
      return { success: false, recoveryKey: '' };
    }
  };

  const addEntry = async (website: string, username: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const newEntry = await mockApi.addEntry({ website, username, password });
      setState(prev => ({ 
        ...prev, 
        entries: [...prev.entries, newEntry], 
        isLoading: false 
      }));
      toast.success("Password saved");
      return true;
    } catch (error) {
      toast.error("Failed to add password");
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const deleteEntry = async (id: number) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      await mockApi.deleteEntry(id);
      setState(prev => ({ 
        ...prev, 
        entries: prev.entries.filter(entry => entry.id !== id), 
        isLoading: false 
      }));
      toast.success("Password deleted");
      return true;
    } catch (error) {
      toast.error("Failed to delete password");
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const generatePassword = async (length: number = 14) => {
    try {
      return await mockApi.generatePassword(length);
    } catch {
      toast.error("Failed to generate password");
      return '';
    }
  };

  const logout = () => {
    setState({
      isAuthenticated: false,
      hasMasterPassword: true,
      entries: [],
      isLoading: false
    });
    toast.info("Logged out");
  };

  return {
    isAuthenticated: state.isAuthenticated,
    hasMasterPassword: state.hasMasterPassword,
    entries: state.entries,
    isLoading: state.isLoading,
    login,
    recoverAccount,
    createMasterPassword,
    addEntry,
    deleteEntry,
    generatePassword,
    logout
  };
};
