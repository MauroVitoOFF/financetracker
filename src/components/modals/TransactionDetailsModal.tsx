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
import { Edit, Trash2, Save, X } from "lucide-react";
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
      <DialogContent className="max-w-md">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              {isEditing ? "Modifica Transazione" : "Dettagli Transazione"}
            </DialogTitle>
            <div className="flex items-center gap-1">
              {!isEditing ? (
                <>
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
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
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={handleSave}>
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleCancel}>
                    <X className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            {/* TITOLO */}
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
                />
              )}
            </div>

            {/* IMPORTO */}
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
                />
              )}
            </div>
          </div>

          {/* CATEGORIA E DATA */}
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
                />
              )}
            </div>
          </div>

          {/* DESCRIZIONE */}
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
              />
            )}
          </div>
        </div>

        {/* FOOTER EDITING */}
        {isEditing && (
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
