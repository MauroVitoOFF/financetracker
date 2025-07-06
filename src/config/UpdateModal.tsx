"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function UpdateModal({ onClose }: { onClose: () => void }) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        {/* Banner */}
        <div className="w-full h-46 relative bg-muted">
          <Image
            src="/updateBannerGif.gif"
            alt="Aggiornamento"
            fill
            className="object-cover"
            style={{ objectPosition: "center 20%" }}
          />
        </div>

        {/* Contenuto */}
        <div className="p-6 pt-4">
          <DialogHeader className="items-center text-center mb-4">
            <DialogTitle className="text-2xl font-bold">
              Novità disponibili!
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 text-sm text-gray-700 dark:text-gray-300">
            <section>
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                💾 Backup e ripristino avanzati
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Backup firmati e verificati per evitare alterazioni</li>
                <li>Ripristino completo con protezioni su categorie e dati</li>
                <li>
                  Interfaccia con etichette “Esportato” e “Creato manualmente”
                </li>
                <li>Limite massimo di 5 backup con gestione semplificata</li>
                <li>Esportazione/Importazione manuale in formato JSON</li>
              </ul>
            </section>

            <section>
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                ⚙️ Miglioramenti tecnici
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Validazioni più rigide e gestione errori più robusta</li>
                <li>Ristrutturazione del codice per maggiore affidabilità</li>
              </ul>
            </section>
          </div>
        </div>

        <DialogFooter className="px-6 pb-4">
          <Button onClick={onClose} className="w-full">
            Continua
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
