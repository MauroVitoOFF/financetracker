"use client";
import React, { useMemo, useState } from "react";
import { ChevronRight, Repeat, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Transaction } from "@/lib/types";
import {
  defaultExpenseCategories,
  defaultIncomeCategories,
} from "@/config/categories";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TransactionItemProps {
  transaction: Transaction;
  onClick?: (txn: Transaction) => void;
  onDelete?: (id: number, deleteAll?: boolean) => void;
}

const italianDateFormatter = new Intl.DateTimeFormat("it-IT", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default function TransactionItem({
  transaction,
  onClick,
  onDelete,
}: TransactionItemProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const { id, title, description, amount, date, type, category, isRecurring } =
    transaction;
  const isIncome = type === "income";

  const { icon: Icon, color } = (isIncome
    ? defaultIncomeCategories
    : defaultExpenseCategories
  ).find((c) => c.name === category) ?? {
    icon: ChevronRight,
    color: "bg-gray-500",
  };

  const formattedAmount = `${isIncome ? "+" : "-"}€${Math.abs(amount).toFixed(
    2
  )}`;
  const formattedDate = useMemo(
    () => italianDateFormatter.format(new Date(date)),
    [date]
  );

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <button
            type="button"
            onClick={() => onClick?.(transaction)}
            className="group flex w-full justify-between items-start p-4 bg-white dark:bg-gray-800 border rounded-lg hover:shadow transition"
          >
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                  color
                )}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col min-w-0 text-start">
                <div className="flex items-center gap-1">
                  <span className="truncate font-medium text-gray-900 dark:text-white">
                    {title || "—"}
                  </span>
                </div>
                <span className="truncate text-sm text-gray-500 dark:text-gray-400">
                  {description || category}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 min-w-[100px]">
              <div className="flex flex-col items-end">
                <span
                  className={cn(
                    "text-sm font-semibold",
                    isIncome
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  )}
                >
                  {formattedAmount}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  {formattedDate}
                  {isRecurring && (
                    <span
                      title="Transazione ricorrente"
                      className="text-gray-400 dark:text-gray-500 text-xs"
                    >
                      <Repeat className="w-3.5 h-3.5" />
                    </span>
                  )}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 self-center" />
            </div>
          </button>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem
            onClick={() => setShowConfirm(true)}
            className="text-red-600 focus:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Elimina
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Dialog di conferma eliminazione */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conferma eliminazione</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Sei sicuro di voler eliminare la transazione{" "}
            <strong>{title}</strong>? Azione irreversibile.
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowConfirm(false)}>
              Annulla
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowConfirm(false);

                if (transaction.subscriptionId) {
                  toast("Operazione bloccata", {
                    description:
                      "Questa transazione è legata a un abbonamento attivo.",
                  });
                  return;
                }

                onDelete?.(id, false); // 👈 elimina solo questa

                toast("Transazione eliminata", {
                  description: `Hai eliminato "${title}" con successo.`,
                });
              }}
            >
              Elimina
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
