import { open, save } from "@tauri-apps/plugin-dialog";
import {
  readTextFile,
  writeTextFile,
  readDir,
  mkdir,
} from "@tauri-apps/plugin-fs";
import { appLocalDataDir, BaseDirectory } from "@tauri-apps/api/path";
import {
  getTransactions,
  getCategories,
  getSubscriptions,
  clearAllData,
  addCategory,
  bulkInsertTransactions,
  addSubscription,
} from "@/lib/db";

// ——— Costanti
const BACKUP_FOLDER_NAME = "backups";

function getExportFileName(): string {
  const date = new Date().toISOString().split("T")[0];
  return `financetracker-backup-${date}.json`;
}

// ——— Esportazione manuale
export async function exportFullData() {
  const [income, expense] = await Promise.all([
    getTransactions("income"),
    getTransactions("expense"),
  ]);

  const categoriesIncome = await getCategories("income");
  const categoriesExpense = await getCategories("expense");
  const subscriptions = await getSubscriptions();

  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    transactions: [...income, ...expense],
    categories: [...categoriesIncome, ...categoriesExpense],
    subscriptions,
  };

  const json = JSON.stringify(payload, null, 2);
  const filename = getExportFileName();

  // Crea la cartella "backups" se non esiste
  try {
    await mkdir(BACKUP_FOLDER_NAME, {
      baseDir: BaseDirectory.AppLocalData,
      recursive: true,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    // ignorato
  }

  // Salva nella cartella interna
  const internalPath = `${BACKUP_FOLDER_NAME}/${filename}`;
  await writeTextFile(internalPath, json, {
    baseDir: BaseDirectory.AppLocalData,
  });

  // Finestra per salvataggio manuale
  const externalPath = await save({
    defaultPath: filename,
    filters: [{ name: "JSON", extensions: ["json"] }],
  });

  if (!externalPath) throw new Error("Export annullato");

  await writeTextFile(externalPath, json);
}

async function categoryExists(name: string): Promise<boolean> {
  const all = await getCategories("expense");
  return all.some((cat) => cat.name === name);
}

// ——— Importazione manuale
export async function importFullData() {
  const filePath = await open({
    multiple: false,
    filters: [{ name: "JSON", extensions: ["json"] }],
  });

  if (typeof filePath !== "string") throw new Error("File non selezionato");

  const contents = await readTextFile(filePath);
  const data = JSON.parse(contents);

  if (!data || data.version !== 1) throw new Error("Formato non valido");

  await clearAllData();

  for (const cat of data.categories) {
    if (!(await categoryExists(cat.name))) {
      await addCategory(cat);
    }
  }

  await bulkInsertTransactions(data.transactions);

  for (const sub of data.subscriptions) await addSubscription(sub);
}

// —————————————————————————————————————
// 🔁 Versionamento Interno
// —————————————————————————————————————

export function parseBackupDate(filename: string): Date | null {
  const match = filename.match(
    /^backup-(\d{4})-(\d{2})-(\d{2})T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z\.json$/
  );

  if (!match) return null;

  const [_, year, month, day, hour, minute, second, millis] = match.map(Number);

  return new Date(Date.UTC(year, month - 1, day, hour, minute, second, millis));
}

// Crea un backup nella directory app
export async function createVersionedBackup(): Promise<string> {
  const dir = await appLocalDataDir();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `backup-${timestamp}.json`;
  const fullPath = `${dir}/${BACKUP_FOLDER_NAME}/${fileName}`;

  // Assicura che la cartella esista
  await mkdir(`${BACKUP_FOLDER_NAME}`, {
    baseDir: BaseDirectory.AppLocalData,
    recursive: true,
  });

  const [income, expense] = await Promise.all([
    getTransactions("income"),
    getTransactions("expense"),
  ]);
  const categoriesIncome = await getCategories("income");
  const categoriesExpense = await getCategories("expense");
  const subscriptions = await getSubscriptions();

  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    transactions: [...income, ...expense],
    categories: [...categoriesIncome, ...categoriesExpense],
    subscriptions,
  };

  const json = JSON.stringify(payload, null, 2);
  await writeTextFile(fullPath, json);

  return fileName;
}

// Elenco backup disponibili
export async function listBackups(): Promise<string[]> {
  const dir = await appLocalDataDir();
  const files = await readDir(`${dir}/${BACKUP_FOLDER_NAME}`);
  return files
    .filter((f) => f.name?.endsWith(".json"))
    .map((f) => f.name!) // name is always present at this point
    .sort()
    .reverse();
}

// Ripristina un backup specifico
export async function restoreBackup(fileName: string): Promise<void> {
  const dir = await appLocalDataDir();
  const contents = await readTextFile(
    `${dir}/${BACKUP_FOLDER_NAME}/${fileName}`
  );
  const data = JSON.parse(contents);

  if (!data || data.version !== 1) throw new Error("Formato non valido");

  await clearAllData();
  for (const cat of data.categories) await addCategory(cat);
  await bulkInsertTransactions(data.transactions);
  for (const sub of data.subscriptions) await addSubscription(sub);
}
