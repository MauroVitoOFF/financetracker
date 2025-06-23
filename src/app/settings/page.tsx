"use client";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CategoriesTab from "@/components/settings/CategoriesTab";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { clearAllData } from "@/lib/db";
import { toast } from "sonner";

export default function Settings() {
  const [isClearing, setIsClearing] = useState(false);

  const handleClear = async () => {
    setIsClearing(true);
    try {
      await clearAllData();
      toast.success("Tutti i dati sono stati cancellati.");
    } catch {
      toast.error("Errore durante la cancellazione dei dati.");
    }
    setIsClearing(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen space-y-8">
      <Header title="Impostazioni" description="Gestisci le tue preferenze" />

      <Tabs defaultValue="categories">
        <TabsList className="grid grid-cols-6 gap-2 mb-4">
          <TabsTrigger value="categories">Categorie</TabsTrigger>
          <TabsTrigger value="data">Dati</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <div className="grid grid-cols-2 gap-6">
            <CategoriesTab type="expense" label="Categorie Spese" />
            <CategoriesTab type="income" label="Categorie Entrate" />
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          {/* Sezione Esporta... rimane invariata */}

          <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
            <h4 className="font-medium text-red-900 mb-2">Zona Pericolosa</h4>
            <p className="text-sm text-red-700 mb-4">
              Queste azioni sono irreversibili. Procedi con cautela.
            </p>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-300"
                >
                  Cancella Tutti i Dati
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Conferma Eliminazione Dati
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Sei sicuro di voler cancellare **tutte** le transazioni?
                    Questa azione è irreversibile.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annulla</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={handleClear}
                    disabled={isClearing}
                  >
                    {isClearing ? "Eliminazione..." : "Elimina Tutti i Dati"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
