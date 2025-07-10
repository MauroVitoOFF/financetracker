import { open, save } from "@tauri-apps/plugin-dialog";
import { sha256 } from "@noble/hashes/sha2";
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
import { BackupDataSchema } from "./validation";
import {
  BackupData,
  CategoryBackup,
  SubscriptionBackup,
  TransactionBackup,
} from "./types";

const BACKUP_FOLDER_NAME = "backups";

// —————————————————————————————————————
// Utility
// —————————————————————————————————————

function getExportFileName(): string {
  const date = new Date().toISOString().split("T")[0];
  return `financetracker-backup-${date}.json`;
}

export function parseBackupDate(filename: string): Date | null {
  // Formato con timestamp completo (usato nei backup automatici)
  const detailed = filename.match(
    /^backup-(\d{4})-(\d{2})-(\d{2})T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z\.json$/
  );

  if (detailed) {
    const [_, year, month, day, hour, minute, second, millis] =
      detailed.map(Number);
    return new Date(
      Date.UTC(year, month - 1, day, hour, minute, second, millis)
    );
  }

  // Formato semplice (usato nei backup manuali)
  const simple = filename.match(
    /^financetracker-backup-(\d{4})-(\d{2})-(\d{2})\.json$/
  );

  if (simple) {
    const [_, year, month, day] = simple.map(Number);
    return new Date(year, month - 1, day);
  }

  return null;
}

export function generateSignature(data: object): string {
  const clean = JSON.parse(JSON.stringify(data));
  const encoded = new TextEncoder().encode(JSON.stringify(clean));
  const hash = sha256(encoded); // returns Uint8Array
  return Array.from(hash)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// —————————————————————————————————————
// Backup & Restore Core
// —————————————————————————————————————

export async function generateSignedPayload(): Promise<BackupData> {
  const [income, expense] = await Promise.all([
    getTransactions("income"),
    getTransactions("expense"),
  ]);
  const categoriesIncome = await getCategories("income");
  const categoriesExpense = await getCategories("expense");
  const subscriptions = await getSubscriptions();

  const transactions: TransactionBackup[] = [...income, ...expense].map(
    ({
      id,
      installments,
      recurringFrequency,
      recurringEndDate,
      subscriptionId,
      parentId,
      ...rest
    }) => ({
      ...rest,
      installments: installments ?? null,
      recurringFrequency: recurringFrequency ?? null,
      recurringEndDate: recurringEndDate ?? null,
      subscriptionId: subscriptionId ?? null,
      parentId: parentId ?? null,
    })
  );

  const categories: CategoryBackup[] = [
    ...categoriesIncome,
    ...categoriesExpense,
  ].map(({ id, ...rest }) => rest);

  const subscriptionsBackup: SubscriptionBackup[] = subscriptions.map(
    ({ id, ...rest }) => rest
  );

  const payloadWithoutSignature: Omit<BackupData, "signature"> = {
    version: 1 as const,
    exportedAt: new Date().toISOString(),
    transactions,
    categories,
    subscriptions: subscriptionsBackup,
  };

  const signature = generateSignature(payloadWithoutSignature);

  return {
    ...payloadWithoutSignature,
    signature,
  };
}

export function parseAndAssertBackupData(data: unknown): BackupData {
  const parsed = BackupDataSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Struttura del file di backup non valida.");
  }

  const { signature, ...rest } = parsed.data;
  const expected = generateSignature(rest);

  if (signature !== expected) {
    throw new Error("Il file di backup è stato alterato o corrotto.");
  }

  if (parsed.data.version !== 1) {
    throw new Error("Versione del file non supportata.");
  }

  return parsed.data;
}

async function restoreData(
  data: Omit<BackupData, "version" | "exportedAt" | "signature">
): Promise<void> {
  await clearAllData();

  for (const cat of data.categories) {
    await addCategory(cat);
  }

  await bulkInsertTransactions(data.transactions);

  for (const sub of data.subscriptions) {
    await addSubscription({
      ...sub,
      color: sub.color ?? undefined,
    });
  }
}

// —————————————————————————————————————
// Esportazione / Importazione
// —————————————————————————————————————

export async function exportFullData() {
  const signedPayload = await generateSignedPayload();
  const json = JSON.stringify(signedPayload, null, 2);
  const filename = getExportFileName();

  try {
    await mkdir(BACKUP_FOLDER_NAME, {
      baseDir: BaseDirectory.AppLocalData,
      recursive: true,
    });
  } catch (e) {
    console.warn("Directory già esistente o errore mkdir:", e);
  }

  const internalPath = `${BACKUP_FOLDER_NAME}/${filename}`;
  await writeTextFile(internalPath, json, {
    baseDir: BaseDirectory.AppLocalData,
  });

  const externalPath = await save({
    defaultPath: filename,
    filters: [{ name: "JSON", extensions: ["json"] }],
  });

  if (!externalPath) throw new Error("Export annullato dall'utente");
  await writeTextFile(externalPath, json);

  return filename;
}

export async function importFullData() {
  const filePath = await open({
    multiple: false,
    filters: [{ name: "JSON", extensions: ["json"] }],
  });

  if (typeof filePath !== "string") throw new Error("Nessun file selezionato");

  const contents = await readTextFile(filePath);
  const raw = JSON.parse(contents);

  const data = parseAndAssertBackupData(raw);

  await exportFullData(); // backup di sicurezza prima del restore
  await restoreData(data);
}

// —————————————————————————————————————
// Backup Versionati Internamente
// —————————————————————————————————————

export async function createVersionedBackup(): Promise<string> {
  const dir = await appLocalDataDir();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `backup-${timestamp}.json`;
  const fullPath = `${dir}/${BACKUP_FOLDER_NAME}/${fileName}`;

  await mkdir(BACKUP_FOLDER_NAME, {
    baseDir: BaseDirectory.AppLocalData,
    recursive: true,
  });

  const signedPayload = await generateSignedPayload();
  const json = JSON.stringify(signedPayload, null, 2);
  await writeTextFile(fullPath, json);

  return fileName;
}

export async function listBackups(): Promise<string[]> {
  const dir = await appLocalDataDir();
  const backupDir = `${dir}/${BACKUP_FOLDER_NAME}`;

  try {
    const files = await readDir(backupDir);
    return files
      .filter((f) => f.name?.endsWith(".json"))
      .map((f) => f.name!)
      .sort()
      .reverse();
  } catch {
    return [];
  }
}

export async function restoreBackup(fileName: string): Promise<void> {
  const dir = await appLocalDataDir();
  const filePath = `${dir}/${BACKUP_FOLDER_NAME}/${fileName}`;
  const contents = await readTextFile(filePath);
  const data = parseAndAssertBackupData(JSON.parse(contents));
  await restoreData(data);
}
