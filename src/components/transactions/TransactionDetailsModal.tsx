// Percorso: components/transactions/TransactionDetailsModal.tsx

"use client";
import React, { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTransactionEditForm } from "@/hooks/useTransactionEditForm";
import { EditToolbar } from "@/components/transactions/EditToolbar";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { ConfirmUpdateDialog } from "@/components/transactions/ConfirmUpdateDialog";
import { ConfirmDeleteDialog } from "@/components/transactions/ConfirmDeleteDialog";
import { hasRecurringChildren } from "@/lib/db";
import type { Props } from "./types";

export const TransactionDetailsModal: React.FC<Props> = ({
  transaction,
  onClose,
  onDelete,
  onUpdate,
  readOnly,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmUpdateOpen, setConfirmUpdateOpen] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);

  const {
    editForm,
    updateField,
    hasChanged,
    reset: resetForm,
  } = useTransactionEditForm(transaction);

  const isFromSubscription = !!transaction?.subscriptionId;
  const isGeneratedRecurring = !!transaction?.parentId;
  const isReadOnly = readOnly || isFromSubscription || isGeneratedRecurring;
  const showActions = !isReadOnly;

  useEffect(() => {
    setIsEditing(false);
  }, [transaction?.id]);

  useEffect(() => {
    if (transaction?.isRecurring && !transaction.parentId) {
      hasRecurringChildren(transaction.id).then(setHasChildren);
    } else {
      setHasChildren(false);
    }
  }, [transaction]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancel = useCallback(() => {
    resetForm();
    setIsEditing(false);
  }, [resetForm]);

  const handleSave = useCallback(() => {
    if (!transaction || !hasChanged) return;

    if (transaction.isRecurring && !transaction.parentId && hasChildren) {
      setConfirmUpdateOpen(true);
    } else {
      onUpdate(editForm);
      setIsEditing(false);
      onClose();
    }
  }, [transaction, hasChanged, hasChildren, onUpdate, editForm, onClose]);

  const handleConfirmedDelete = useCallback(
    (deleteAll: boolean) => {
      console.log("→ DELETE ALL:", deleteAll);
      if (!transaction) return;
      onDelete(transaction.id, deleteAll);
      setConfirmDeleteOpen(false);
      onClose();
    },
    [onDelete, transaction, onClose]
  );

  const handleConfirmedUpdate = useCallback(
    (updateAll: boolean) => {
      onUpdate(editForm, updateAll);
      setConfirmUpdateOpen(false);
      setIsEditing(false);
      onClose();
    },
    [onUpdate, editForm, onClose]
  );

  if (!transaction) return null;

  return (
    <Dialog open={!!transaction} onOpenChange={onClose}>
      <DialogContent className="max-w-md" showCloseButton={false}>
        <DialogHeader className="pb-2">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl font-semibold">
              {isEditing ? "Modifica Transazione" : "Dettagli Transazione"}
            </DialogTitle>

            <EditToolbar
              isEditing={isEditing}
              canEdit={showActions}
              onEdit={handleEdit}
              onCancel={handleCancel}
              onSave={handleSave}
              onDelete={() => setConfirmDeleteOpen(true)}
              onClose={onClose}
            />
          </div>
        </DialogHeader>

        <TransactionForm
          transaction={transaction}
          form={editForm}
          onChange={updateField}
          isEditing={isEditing}
          readOnly={isReadOnly}
        />
        {showActions && (
          <ConfirmDeleteDialog
            open={confirmDeleteOpen}
            hasChildren={hasChildren}
            onCancel={() => setConfirmDeleteOpen(false)}
            onConfirm={handleConfirmedDelete}
          />
        )}

        <ConfirmUpdateDialog
          open={confirmUpdateOpen}
          onCancel={() => setConfirmUpdateOpen(false)}
          onConfirm={handleConfirmedUpdate}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailsModal;
