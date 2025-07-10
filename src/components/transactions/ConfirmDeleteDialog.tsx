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
  hasChildren: boolean;
  onCancel: () => void;
  onConfirm: (deleteAll: boolean) => void;
}

export const ConfirmDeleteDialog: React.FC<Props> = ({
  open,
  hasChildren,
  onCancel,
  onConfirm,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Vuoi eliminare{" "}
            {hasChildren
              ? "anche le transazioni future?"
              : "questa transazione?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {hasChildren
              ? "Questa azione non può essere annullata. Puoi scegliere se eliminare solo questa rata oppure tutte quelle successive collegate."
              : "Questa azione eliminerà definitivamente la transazione selezionata."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Annulla</AlertDialogCancel>

          {hasChildren ? (
            <>
              <AlertDialogAction asChild>
                <button
                  onClick={() => onConfirm(false)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded px-4 py-2"
                >
                  Solo questa
                </button>
              </AlertDialogAction>
              <AlertDialogAction asChild>
                <button
                  onClick={() => onConfirm(true)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded px-4 py-2"
                >
                  Tutte le future
                </button>
              </AlertDialogAction>
            </>
          ) : (
            <AlertDialogAction asChild>
              <button
                onClick={() => onConfirm(false)}
                className="bg-red-600 hover:bg-red-700 text-white rounded px-4 py-2"
              >
                Elimina
              </button>
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
