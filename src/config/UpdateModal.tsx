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
        {/* Banner image */}
        <div className="w-full h-46 relative bg-muted">
          <Image
            src="/updateBannerGif.gif"
            alt="Aggiornamento"
            fill
            className="object-cover"
            style={{ objectPosition: "center 20%" }}
          />
        </div>

        {/* Header */}
        <div className="p-6 pt-4">
          <DialogHeader className="items-center text-center mb-4">
            <DialogTitle className="text-2xl font-bold">
              Nuove novità!
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 text-sm text-gray-700 dark:text-gray-300">
            <section>
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                🔁 Transazioni ricorrenti
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Supporto a frequenze settimanali, mensili, trimestrali e
                  annuali
                </li>
                <li>Creazione automatica delle transazioni a ogni avvio</li>
                <li>Icona ↻ per identificarle facilmente</li>
                <li>Gestione iniziale delle rate con data dinamica</li>
                <li>
                  Modifica e cancellazione manuale disabilitate per quelle
                  auto-generate
                </li>
              </ul>
            </section>

            <section>
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                💳 Abbonamenti automatizzati
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Creazione automatica della spesa alla data di rinnovo</li>
                <li>La prossima scadenza viene aggiornata automaticamente</li>
                <li>
                  Supporto alle frequenze: settimanale, mensile, trimestrale,
                  annuale
                </li>
                <li>
                  Transazioni collegate non modificabili o eliminabili
                  manualmente
                </li>
              </ul>
            </section>

            <section>
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                🐞 Bugfix
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Corretta la generazione errata delle date (es. sempre giorno
                  1)
                </li>
                <li>Evitate duplicazioni per le transazioni ricorrenti</li>
                <li>
                  Corretto il calcolo del <code>nextPayment</code> negli
                  abbonamenti
                </li>
                <li>
                  Migliorata la coerenza nel salvataggio dei dati ricorrenti
                </li>
              </ul>
            </section>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 pb-4">
          <Button onClick={onClose} className="w-full">
            Continua
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
