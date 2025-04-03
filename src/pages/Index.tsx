
import { useState } from "react";
import { usePasswordManager } from "@/hooks/usePasswordManager";
import LoginForm from "@/components/LoginForm";
import SetMasterPassword from "@/components/SetMasterPassword";
import RecoveryForm from "@/components/RecoveryForm";
import PasswordVault from "@/components/PasswordVault";
import RecoveryKeyModal from "@/components/RecoveryKeyModal";

const Index = () => {
  const {
    isAuthenticated,
    hasMasterPassword,
    entries,
    isLoading,
    login,
    recoverAccount,
    createMasterPassword,
    addEntry,
    deleteEntry,
    generatePassword,
    logout,
  } = usePasswordManager();

  const [showRecoveryForm, setShowRecoveryForm] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState("");
  const [showRecoveryKeyModal, setShowRecoveryKeyModal] = useState(false);

  const handleLogin = async (password: string) => {
    return await login(password);
  };

  const handleCreateMasterPassword = async (
    password: string,
    confirmPassword: string
  ) => {
    const result = await createMasterPassword(password, confirmPassword);
    if (result.success) {
      setRecoveryKey(result.recoveryKey);
      setShowRecoveryKeyModal(true);
    }
    return result;
  };

  const handleRecovery = async (key: string) => {
    return await recoverAccount(key);
  };

  // Handle authentication state and render the appropriate component
  const renderAuthComponent = () => {
    if (isAuthenticated) {
      return (
        <PasswordVault
          entries={entries}
          onAddPassword={addEntry}
          onDeletePassword={deleteEntry}
          onGeneratePassword={generatePassword}
          onLogout={logout}
        />
      );
    }

    if (!hasMasterPassword) {
      return (
        <SetMasterPassword
          onSetPassword={handleCreateMasterPassword}
          isLoading={isLoading}
        />
      );
    }

    if (showRecoveryForm) {
      return (
        <RecoveryForm
          onRecovery={handleRecovery}
          onBackToLogin={() => setShowRecoveryForm(false)}
          isLoading={isLoading}
        />
      );
    }

    return (
      <LoginForm
        onLogin={handleLogin}
        onResetClick={() => setShowRecoveryForm(true)}
        isLoading={isLoading}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {renderAuthComponent()}
        
        <RecoveryKeyModal
          isOpen={showRecoveryKeyModal}
          onClose={() => setShowRecoveryKeyModal(false)}
          recoveryKey={recoveryKey}
        />
      </div>
    </div>
  );
};

export default Index;
