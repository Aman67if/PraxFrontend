"use client";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { LogOut, AlertTriangle } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: LogoutModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Logout">
      <div className="text-center py-4">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Are you sure you want to logout?
        </h3>
        <p className="text-sm text-gray-500 mb-8">
          You will need to sign in again to access your account.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={loading}>
            <LogOut size={16} />
            {loading ? "Logging out…" : "Logout"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
