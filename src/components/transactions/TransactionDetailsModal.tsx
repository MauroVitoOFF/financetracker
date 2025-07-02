"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash2, Save, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/lib/types";

interface Props {
  transaction: Transaction | null;
  onClose: () => void;
  onDelete: (transactionId: number) => void;
  onUpdate: (transaction: Transaction) => void;
}

const TransactionDetailsModal: React.FC<Props> = ({
  transaction,
  onClose,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Transaction | null>(null);

  useEffect(() => {
    setEditForm(transaction ? { ...transaction } : null);
    setIsEditing(false);
  }, [transaction]);

  if (!transaction) return null;

  const isIncome = transaction.type === "income";
  const isFromSubscription = !!transaction.subscriptionId;
  const isReadOnly = transaction.isRecurring || isFromSubscription;
  const showActions = !isReadOnly;

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ ...transaction! });
  };

  const handleSave = () => {
    if (editForm) {
      onUpdate(editForm);
      setIsEditing(false);
      onClose();
    }
  };

  const handleDelete = () => {
    onDelete(transaction.id);
    onClose();
  };

  return (
    <Dialog open={!!transaction} onOpenChange={onClose}>
      <DialogContent className="max-w-md" showCloseButton={false}>
        <DialogHeader className="pb-2">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl font-semibold">
              {isEditing ? "Modifica Transazione" : "Dettagli Transazione"}
            </DialogTitle>

            <div className="flex items-center gap-3">
              {showActions && !isEditing && (
                <>
                  <Button variant="ghost" size="icon" onClick={handleEdit}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Elimina transazione</AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annulla</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Elimina
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
              {isEditing && showActions && (
                <>
                  <Button variant="ghost" size="icon" onClick={handleSave}>
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleCancel}>
                    <XCircle className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="Chiudi"
              >
                <XCircle className="w-4 h-4 text-gray-500 hover:text-gray-700" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {isReadOnly && (
          <div className="text-sm text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 p-3 rounded">
            Questa transazione è stata generata automaticamente (ricorrente o da
            abbonamento) e non può essere modificata o eliminata manualmente.
          </div>
        )}

        <div className="space-y-6 mt-2">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titolo</Label>
              {!isEditing ? (
                <p className="mt-1 text-lg">{transaction.title || "—"}</p>
              ) : (
                <Input
                  id="title"
                  value={editForm?.title || ""}
                  onChange={(e) =>
                    setEditForm((prev) =>
                      prev ? { ...prev, title: e.target.value } : null
                    )
                  }
                  className="mt-1"
                  disabled={isReadOnly}
                />
              )}
            </div>

            <div>
              <Label htmlFor="amount">Importo</Label>
              {!isEditing ? (
                <span
                  className={cn(
                    "text-2xl font-bold",
                    isIncome ? "text-green-600" : "text-red-600"
                  )}
                >
                  {isIncome ? "+" : "-"}€
                  {Math.abs(transaction.amount).toFixed(2)}
                </span>
              ) : (
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={Math.abs(editForm?.amount || 0)}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    const amount = isIncome ? val : -val;
                    setEditForm((prev) => (prev ? { ...prev, amount } : null));
                  }}
                  className="mt-1"
                  disabled={isReadOnly}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <Label htmlFor="category">Categoria</Label>
              {!isEditing ? (
                <p className="mt-1 text-sm">{transaction.category || "—"}</p>
              ) : (
                <Input
                  id="category"
                  value={editForm?.category || ""}
                  onChange={(e) =>
                    setEditForm((prev) =>
                      prev ? { ...prev, category: e.target.value } : null
                    )
                  }
                  className="mt-1"
                  disabled={isReadOnly}
                />
              )}
            </div>

            <div>
              <Label htmlFor="date">Data</Label>
              {!isEditing ? (
                <p className="mt-1 text-sm">
                  {new Date(transaction.date).toLocaleDateString("it-IT", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              ) : (
                <Input
                  id="date"
                  type="date"
                  value={editForm?.date.split("T")[0] || ""}
                  onChange={(e) =>
                    setEditForm((prev) =>
                      prev ? { ...prev, date: e.target.value } : null
                    )
                  }
                  className="mt-1"
                  disabled={isReadOnly}
                />
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <Label htmlFor="description">Descrizione</Label>
            {!isEditing ? (
              <p className="mt-1 text-sm">{transaction.description || "—"}</p>
            ) : (
              <Textarea
                id="description"
                value={editForm?.description || ""}
                onChange={(e) =>
                  setEditForm((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
                className="mt-1"
                rows={3}
                disabled={isReadOnly}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <Label>Ricorrente</Label>
              <p className="mt-1 text-sm">
                {transaction.isRecurring ? "Sì" : "No"}
              </p>
            </div>
            {transaction.isRecurring && (
              <div>
                <Label>Frequenza</Label>
                <p className="mt-1 text-sm">
                  {transaction.recurringFrequency || "—"}
                </p>
              </div>
            )}
          </div>
        </div>

        {isEditing && showActions && (
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <Button variant="outline" onClick={handleCancel}>
              Annulla
            </Button>
            <Button onClick={handleSave}>Salva modifiche</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailsModal;
