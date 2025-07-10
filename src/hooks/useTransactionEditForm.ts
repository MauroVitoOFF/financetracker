import { useEffect, useMemo, useState } from "react";
import type { Transaction } from "@/lib/types";

export function useTransactionEditForm(transaction: Transaction | null) {
  const [editForm, setEditForm] = useState<Transaction | null>(null);

  useEffect(() => {
    setEditForm(transaction ? { ...transaction } : null);
  }, [transaction]);

  const updateField = <K extends keyof Transaction>(
    field: K,
    value: Transaction[K]
  ) => {
    setEditForm((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const hasChanged = useMemo(() => {
    if (!transaction || !editForm) return false;
    return (
      transaction.title !== editForm.title ||
      transaction.description !== editForm.description ||
      transaction.amount !== editForm.amount ||
      transaction.category !== editForm.category ||
      transaction.date !== editForm.date
    );
  }, [transaction, editForm]);

  return {
    editForm: editForm!,
    updateField,
    hasChanged,
    reset: () => setEditForm(transaction),
  };
}
