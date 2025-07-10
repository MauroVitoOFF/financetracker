import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  open: boolean;
  onCancel: () => void;
  onConfirm: (updateAll: boolean) => void;
}

export const ConfirmUpdateDialog: React.FC<Props> = ({
  open,
  onCancel,
  onConfirm,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Vuoi applicare la modifica anche alle transazioni future?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Puoi aggiornare solo questa transazione oppure anche tutte le rate
            successive collegate.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Annulla</AlertDialogCancel>

          <AlertDialogAction asChild>
            <button
              onClick={() => onConfirm(false)}
              className="bg-primary text-white rounded px-4 py-2"
            >
              Solo questa
            </button>
          </AlertDialogAction>

          <AlertDialogAction asChild>
            <button
              onClick={() => onConfirm(true)}
              className="bg-primary text-white rounded px-4 py-2"
            >
              Tutte le future
            </button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
