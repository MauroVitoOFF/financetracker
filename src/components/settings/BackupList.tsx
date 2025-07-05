import { Button } from "@/components/ui/button";
import { parseBackupDate } from "@/lib/dataSync";

type BackupListProps = {
  backups: string[];
  loading: boolean;
  onCreate: () => void | Promise<void>;
  onRestore: (file: string) => void;
  onDelete: (file: string) => void;
  onExport: () => void | Promise<void>;
  onImport: () => void | Promise<void>;
};

export function BackupList({
  backups,
  loading,
  onCreate,
  onRestore,
  onDelete,
  onExport,
  onImport,
}: BackupListProps) {
  const hasReachedLimit = backups.length >= 5;

  return (
    <div className="p-4 border bg-white rounded-lg space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Versioni Backup</h4>
        <h4 className="text-xs text-gray-500">{backups.length} / 5</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={onCreate}
          disabled={hasReachedLimit}
        >
          Crea Nuovo
        </Button>
      </div>

      {hasReachedLimit && (
        <p className="text-sm text-yellow-600">
          Hai raggiunto il numero massimo di 5 backup. Elimina uno esistente per
          crearne uno nuovo.
        </p>
      )}

      <div className="flex gap-3">
        <Button onClick={onExport}>Esporta Dati</Button>
        <Button variant="outline" onClick={onImport}>
          Importa Dati
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Caricamento...</p>
      ) : backups.length === 0 ? (
        <p className="text-sm text-gray-500">Nessun backup disponibile</p>
      ) : (
        <ul className="space-y-2">
          {backups.map((file) => {
            const date = parseBackupDate(file);
            const label = date
              ? date.toLocaleString("it-IT", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : file;

            return (
              <li
                key={file}
                className="flex items-center justify-between text-sm border p-2 rounded-md"
              >
                <div>
                  <div className="font-medium">{label}</div>
                  <div className="text-xs text-gray-500">{file}</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onRestore(file)}
                  >
                    Ripristina
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:bg-red-100"
                    onClick={() => onDelete(file)}
                  >
                    Elimina
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
