"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import CategoriesTab from "@/components/settings/CategoriesTab";
import { Button } from "@/components/ui/button";
import { getVersion, getTauriVersion } from "@tauri-apps/api/app";
import { toast } from "sonner";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { importFullData, exportFullData } from "@/lib/dataSync";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BackupList } from "@/components/settings/BackupList";
import { BackupDeleteModal } from "@/components/settings/BackupDeleteModal";
import { useBackups } from "@/hooks/useBackups";
import { clearAllData } from "@/lib/db";

export default function Settings() {
  const [isClearing, setIsClearing] = useState(false);
  const [appVersion, setAppVersion] = useState("...");
  const [tauriVersion, setTauriVersion] = useState("...");
  const [backupToDelete, setBackupToDelete] = useState<string | null>(null);

  const { backups, loading, refresh, create, restore, deleteBackup } =
    useBackups();

  const checkForUpdate = async () => {
    try {
      const shouldUpdate = await check();
      if (shouldUpdate) {
        toast(`Aggiornamento disponibile: v${shouldUpdate.version}`, {
          action: {
            label: "Aggiorna Ora",
            onClick: async () => {
              shouldUpdate.downloadAndInstall(() => {});
              await relaunch();
            },
          },
        });
      } else {
        toast.success("L'app è già aggiornata!");
      }
    } catch (e) {
      toast.error("Errore durante il controllo aggiornamenti: " + e);
    }
  };

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

  useEffect(() => {
    getVersion().then(setAppVersion);
    getTauriVersion().then(setTauriVersion);
    refresh();
  }, [refresh]);

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
          <BackupList
            backups={backups}
            loading={loading}
            onCreate={create}
            onRestore={restore}
            onDelete={(filename) => setBackupToDelete(filename)}
            onExport={async () => {
              try {
                const file = await exportFullData();
                toast.success(`Esportazione completata: ${file}`);
                await refresh();
              } catch (err) {
                toast.error("Errore durante l'esportazione.");
                console.error(err);
              }
            }}
            onImport={importFullData}
          />

          <BackupDeleteModal
            open={!!backupToDelete}
            filename={backupToDelete || ""}
            onCancel={() => setBackupToDelete(null)}
            onConfirm={async () => {
              if (backupToDelete) await deleteBackup(backupToDelete);
              setBackupToDelete(null);
            }}
          />

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
                  <AlertDialogTitle>Conferma Eliminazione</AlertDialogTitle>
                  <AlertDialogDescription>
                    Sei sicuro di voler eliminare <strong>tutti</strong> i dati?
                    Questa azione è permanente.
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

          <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
            <h4 className="font-medium">Versione Attuale</h4>
            <p className="text-sm text-gray-700">
              App version: <span className="font-semibold">{appVersion}</span>
              <br />
              Runtime: <span className="font-semibold">{tauriVersion}</span>
            </p>

            <Button onClick={checkForUpdate} className="mt-2">
              Controlla aggiornamenti
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
