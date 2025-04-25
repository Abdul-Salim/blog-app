import React, { ReactNode, useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

// Define dialog options type
type DialogOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

// Define the context type
type ConfirmationContextType = {
  openDialog: (options: DialogOptions) => Promise<{ ok: boolean }>;
} | null;

// Create the context with proper typing
const ConfirmationContext = React.createContext<ConfirmationContextType>(null);

// Hook for using the confirmation dialog
export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error(
      "useConfirmation must be used within a ConfirmationProvider"
    );
  }
  return context;
};

// Define props for the provider component
interface ConfirmationProviderProps {
  children: ReactNode;
}

// Main provider component
export const ConfirmationProvider: React.FC<ConfirmationProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogProps, setDialogProps] = useState<{
    title: string;
    description: string;
    confirmText: string;
    cancelText: string;
    resolve: (value: { ok: boolean }) => void;
  } | null>(null);

  const openDialog = (options: DialogOptions): Promise<{ ok: boolean }> => {
    const {
      title = "Are you sure?",
      description = "",
      confirmText = "Yes",
      cancelText = "No",
    } = options;

    setIsOpen(true);

    return new Promise((resolve) => {
      setDialogProps({
        title,
        description,
        confirmText,
        cancelText,
        resolve,
      });
    });
  };

  const handleConfirm = () => {
    if (dialogProps) {
      dialogProps.resolve({ ok: true });
      setIsOpen(false);
      setDialogProps(null);
    }
  };

  const handleCancel = () => {
    if (dialogProps) {
      dialogProps.resolve({ ok: false });
      setIsOpen(false);
      setDialogProps(null);
    }
  };

  const contextValue = {
    openDialog,
  };

  return (
    <ConfirmationContext.Provider value={contextValue}>
      {children}
      {isOpen && dialogProps && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Alert className="w-96 p-6 bg-white rounded shadow-lg">
            <AlertTitle className="text-xl font-bold mb-2">
              {dialogProps.title}
            </AlertTitle>
            <AlertDescription className="mb-4">
              {dialogProps.description}
            </AlertDescription>
            <div className="flex space-x-2 justify-end">
              <Button variant="outline" onClick={handleCancel}>
                {dialogProps.cancelText}
              </Button>
              <Button onClick={handleConfirm}>{dialogProps.confirmText}</Button>
            </div>
          </Alert>
        </div>
      )}
    </ConfirmationContext.Provider>
  );
};
