"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Subscription } from "@/lib/types";
import InfoRow from "./InfoRow";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Edit,
  Trash2,
  Calendar,
  CreditCard,
  XCircle,
  Save,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

interface Props {
  onClose: () => void;
  subscription: Subscription | null;
  onEdit: (subscription: Subscription) => void;
  onDelete: (subscriptionId: number) => void;
}

const SubscriptionDetailsModal: React.FC<Props> = ({
  onClose,
  subscription,
  onEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Subscription | null>(null);

  useEffect(() => {
    setEditForm(subscription ? { ...subscription } : null);
    setIsEditing(false);
  }, [subscription]);

  if (!subscription || !editForm) return null;

  const { id, name, color, category, amount, frequency, nextPayment, status } =
    subscription;

  const calcNext = (dateStr: string, freq: string): string => {
    const date = new Date(dateStr);
    switch (freq) {
      case "Mensile":
        date.setMonth(date.getMonth() + 1);
        break;
      case "Annuale":
        date.setFullYear(date.getFullYear() + 1);
        break;
      case "Settimanale":
        date.setDate(date.getDate() + 7);
        break;
      case "Trimestrale":
        date.setMonth(date.getMonth() + 3);
        break;
    }
    return date.toISOString();
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ ...subscription! });
  };

  const handleSave = () => {
    if (!editForm) return;

    if (new Date(editForm.nextPayment) <= new Date()) {
      editForm.nextPayment = calcNext(editForm.nextPayment, editForm.frequency);
    }

    onEdit(editForm);
    setIsEditing(false);
    onClose();
  };

  const handleDelete = () => {
    onDelete(id);
    onClose();
  };

  const dateFormatter = new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const formattedDate = dateFormatter.format(new Date(editForm.nextPayment));
  const viewFormatter = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const editFormatter = new Intl.NumberFormat("it-IT", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <Dialog open={!!subscription} onOpenChange={onClose}>
      <DialogContent className="max-w-md" showCloseButton={false}>
        <DialogHeader className="pb-2">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl font-semibold">
              {isEditing ? "Modifica Abbonamento" : "Dettagli Abbonamento"}
            </DialogTitle>

            <div className="flex items-center gap-3">
              {!isEditing && (
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
                        <AlertDialogTitle>Elimina abbonamento</AlertDialogTitle>
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
              {isEditing && (
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

        <div className="space-y-6 py-4">
          <InfoRow
            icon={<CreditCard className="w-5 h-5 text-gray-400" />}
            label="Importo"
            value={
              isEditing
                ? editFormatter.format(editForm.amount)
                : viewFormatter.format(subscription.amount)
            }
            isEditing={isEditing}
            onChange={(val) =>
              setEditForm((f) =>
                f ? { ...f, amount: parseFloat(val) || 0 } : f
              )
            }
          />
          <InfoRow
            icon={<Calendar className="w-5 h-5 text-gray-400" />}
            label="Frequenza"
            value={editForm.frequency}
            isEditing={isEditing}
            selectOptions={["Mensile", "Annuale", "Settimanale", "Trimestrale"]}
            onChange={(val) =>
              setEditForm((f) => (f ? { ...f, frequency: val } : f))
            }
          />
          <InfoRow
            icon={<Calendar className="w-5 h-5 text-gray-400" />}
            label="Prossimo pagamento"
            value={formattedDate}
            isEditing={isEditing}
            isDate
            onChange={(val) =>
              setEditForm((f) => (f ? { ...f, nextPayment: val } : f))
            }
          />
          <InfoRow
            icon={
              <span className="w-5 h-5 flex items-center justify-center">
                <span
                  className={`w-3 h-3 rounded-full ${
                    editForm?.status === "active"
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                  aria-hidden
                />
              </span>
            }
            label="Stato"
            value={editForm?.status === "active" ? "Attivo" : "Sospeso"}
            isEditing={isEditing}
            onChange={(val) =>
              setEditForm((f) =>
                f ? { ...f, status: val === "Attivo" ? "active" : "paused" } : f
              )
            }
            selectOptions={["Attivo", "Sospeso"]}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDetailsModal;
