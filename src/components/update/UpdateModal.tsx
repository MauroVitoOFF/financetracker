"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function UpdateModal({ onClose }: { onClose: () => void }) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>🎉 Novità</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 text-sm text-gray-600">
          <p>🔄 Popup aggiornamento</p>
          <p>🧩 Migliorata la gestione degli abbonamenti</p>
          <p>
            ⚙️ Aggiunto pulsante nelle impostazioni per controllare ed
            eventualmente aggiornare l applicazione
          </p>
          <p>🐞 Risolti bug nel salvataggio delle categorie</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Chiudi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
