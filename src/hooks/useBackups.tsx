import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  listBackups,
  createVersionedBackup,
  restoreBackup,
} from "@/lib/dataSync";
import { BaseDirectory, remove } from "@tauri-apps/plugin-fs";

export function useBackups() {
  const [backups, setBackups] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await listBackups();
      setBackups(list);
    } catch (err) {
      toast.error("Errore nel caricamento dei backup" + err);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async () => {
    if (backups.length >= 5) {
      toast.error(
        "Hai raggiunto il limite massimo di 5 backup. Elimina un backup prima."
      );
      return;
    }
    try {
      const file = await createVersionedBackup();
      toast.success(`Backup creato: ${file}`);
      refresh();
    } catch (err) {
      toast.error("Errore durante il backup");
      console.error(err);
    }
  }, [backups.length, refresh]);

  const restore = useCallback(async (fileName: string) => {
    try {
      await restoreBackup(fileName);
      toast.success(`Backup ripristinato: ${fileName}`);
    } catch (err) {
      toast.error("Errore durante il ripristino");
      console.error(err);
    }
  }, []);

  const deleteBackup = useCallback(
    async (filename: string) => {
      try {
        await remove(`backups/${filename}`, {
          baseDir: BaseDirectory.AppLocalData,
        });
        toast.success("Backup eliminato");
        refresh();
      } catch (err) {
        toast.error("Errore durante l'eliminazione");
        console.error(err);
      }
    },
    [refresh]
  );

  return {
    backups,
    loading,
    refresh,
    create,
    restore,
    deleteBackup,
  };
}
