// src/lib/db.ts
import Database from "@tauri-apps/plugin-sql";
import type { Transaction, Category, Subscription } from "./types";
import { addMonths, addWeeks, addYears } from "date-fns";

export async function getDB() {
  return await Database.load("sqlite:finance.db");
}

export async function initSchema() {
  const db = await getDB();

  // Esiste già: transazioni
  await db.execute(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      type TEXT NOT NULL
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL,
      icon TEXT NOT NULL
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      nextPayment TEXT NOT NULL,
      frequency TEXT NOT NULL,
      status TEXT NOT NULL,
      color TEXT
    );
  `);

  const existing = await db.select<{ count: number }[]>(
    `SELECT COUNT(*) as count FROM categories`
  );

  // categorie default (come prima)
  if (existing[0]?.count === 0) {
    await db.execute(`
    INSERT INTO categories (name, type, icon) VALUES
      ('Alimentari', 'expense', 'ShoppingCart'),
      ('Trasporti', 'expense', 'Car'),
      ('Svago', 'expense', 'Gamepad2'),
      ('Casa', 'expense', 'Home'),
      ('Salute', 'expense', 'Heart'),
      ('Shopping', 'expense', 'ShoppingBag'),
      ('Altro', 'expense', 'MoreHorizontal'),
      ('Stipendio', 'income', 'Briefcase'),
      ('Freelance', 'income', 'Laptop'),
      ('Investimenti', 'income', 'TrendingUp'),
      ('Bonus', 'income', 'Gift'),
      ('Altro', 'income', 'MoreHorizontal');
  `);
  }

  const columns = await db.select<{ name: string }[]>(
    `PRAGMA table_info(transactions)`
  );

  const newTransactionColumn = async (name: string, ddl: string) => {
    if (!columns.some((c) => c.name === name)) {
      await db.execute(`ALTER TABLE transactions ADD COLUMN ${ddl}`);
    }
  };

  await newTransactionColumn(
    "isRecurring",
    "isRecurring INTEGER NOT NULL DEFAULT 0"
  );
  await newTransactionColumn(
    "installments",
    "installments INTEGER DEFAULT NULL"
  );
  await newTransactionColumn(
    "recurringFrequency",
    "recurringFrequency TEXT DEFAULT NULL"
  );
  await newTransactionColumn(
    "recurringEndDate",
    "recurringEndDate TEXT DEFAULT NULL"
  );
  await newTransactionColumn(
    "subscriptionId",
    "subscriptionId INTEGER DEFAULT NULL"
  );
}

// ————————————————— TRANSAZIONI —————————————————

export async function addTransaction(
  txn: Omit<Transaction, "id">
): Promise<void> {
  const db = await getDB();
  await db.execute(
    `INSERT INTO transactions (
      amount, title, description, category, date, type,
      isRecurring, installments, recurringFrequency, recurringEndDate, subscriptionId
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [
      txn.amount,
      txn.title,
      txn.description,
      txn.category,
      txn.date,
      txn.type,
      txn.isRecurring ? 1 : 0,
      txn.installments ?? null,
      txn.recurringFrequency ?? null,
      txn.recurringEndDate ?? null,
      txn.subscriptionId ?? null,
    ]
  );
}

export async function getTransactions(
  type: "income" | "expense"
): Promise<Transaction[]> {
  const db = await getDB();
  const rows = await db.select<Transaction[]>(
    `SELECT id, amount, title, description, category, date, type,
            isRecurring, installments, recurringFrequency, recurringEndDate, subscriptionId
     FROM transactions WHERE type = $1 ORDER BY date DESC`,
    [type]
  );

  return rows.map((t) => ({ ...t, isRecurring: !!t.isRecurring }));
}

export async function getRecentTransactions(
  limit: number = 5
): Promise<Transaction[]> {
  const db = await getDB();
  const rows = await db.select<Transaction[]>(
    `SELECT id, amount, title, description, category, date, type,
            isRecurring, installments, recurringFrequency, recurringEndDate
     FROM transactions ORDER BY date DESC, id DESC LIMIT $1`,
    [limit]
  );

  return rows.map((t) => ({ ...t, isRecurring: !!t.isRecurring }));
}

export async function updateTransaction(txn: Transaction): Promise<void> {
  const db = await getDB();
  await db.execute(
    `UPDATE transactions SET
       amount = $1,
       title = $2,
       description = $3,
       category = $4,
       date = $5,
       type = $6,
       isRecurring = $7,
       installments = $8,
       recurringFrequency = $9,
       recurringEndDate = $10
     WHERE id = $11`,
    [
      txn.amount,
      txn.title,
      txn.description,
      txn.category,
      txn.date,
      txn.type,
      txn.isRecurring ? 1 : 0,
      txn.installments ?? null,
      txn.recurringFrequency ?? null,
      txn.recurringEndDate ?? null,
      txn.id,
    ]
  );
}

export async function deleteTransaction(id: number): Promise<void> {
  const db = await getDB();
  await db.execute(`DELETE FROM transactions WHERE id = $1`, [id]);
}

export async function processRecurringTransactions(): Promise<void> {
  const db = await getDB();
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

  const recurringTxns = await db.select<Transaction[]>(
    `SELECT * FROM transactions
     WHERE isRecurring = 1 AND recurringFrequency IS NOT NULL`
  );

  for (const txn of recurringTxns) {
    if (!txn.recurringFrequency) continue;

    const lastDate = new Date(txn.date);
    let nextDate = calcNextDate(lastDate, txn.recurringFrequency);

    // Continua finché la prossima data è passata
    while (nextDate <= new Date(today)) {
      // Se è oltre recurringEndDate (se definita), esci
      if (
        txn.recurringEndDate &&
        new Date(nextDate) > new Date(txn.recurringEndDate)
      ) {
        break;
      }

      // Evita duplicati: controlla se transazione simile esiste già per quella data
      const exists = await db.select<{ count: number }[]>(
        `SELECT COUNT(*) as count FROM transactions
         WHERE title = $1 AND amount = $2 AND date = $3 AND isRecurring = 1`,
        [txn.title, txn.amount, nextDate.toISOString().split("T")[0]]
      );
      if (exists[0]?.count > 0) break;

      // Inserisci nuova transazione ricorrente
      await addTransaction({
        ...txn,
        date: nextDate.toISOString().split("T")[0],
      });

      nextDate = calcNextDate(nextDate, txn.recurringFrequency);
    }
  }
}

export async function processSubscriptions(): Promise<void> {
  const db = await getDB();
  const today = new Date();

  const subscriptions = await db.select<Subscription[]>(
    `SELECT * FROM subscriptions WHERE status = 'active'`
  );

  for (const sub of subscriptions) {
    let paymentDate = new Date(sub.nextPayment);

    while (paymentDate <= today) {
      const formattedDate = paymentDate.toISOString().split("T")[0];

      // Inserisci la spesa solo se non esiste già
      const existing = await db.select<{ count: number }[]>(
        `SELECT COUNT(*) as count FROM transactions
         WHERE title = $1 AND amount = $2 AND date = $3`,
        [sub.name, sub.amount, formattedDate]
      );

      if (existing[0]?.count === 0) {
        await addTransaction({
          title: sub.name,
          description: "Pagamento abbonamento",
          amount: sub.amount,
          category: sub.category,
          date: formattedDate,
          type: "expense",
          isRecurring: false,
          installments: null,
          recurringFrequency: null,
          recurringEndDate: null,
          subscriptionId: sub.id,
        });
      }

      // Calcola la prossima scadenza
      const next = calcNextDate(paymentDate, sub.frequency);

      // Aggiorna nextPayment nel DB
      await db.execute(
        `UPDATE subscriptions SET nextPayment = $1 WHERE id = $2`,
        [next.toISOString(), sub.id]
      );

      // Continua se servono più rate (es. se è passato più di un ciclo)
      paymentDate = next;
    }
  }
}

export async function loadStats(): Promise<{
  total: number;
  income: number;
  expense: number;
}> {
  const db = await getDB();
  const [{ total }] = await db.select<[{ total: number }]>(
    `SELECT COALESCE(SUM(CASE WHEN type='income' THEN amount ELSE -amount END),0) AS total FROM transactions`
  );
  const [{ income }] = await db.select<[{ income: number }]>(
    `SELECT COALESCE(SUM(amount),0) AS income FROM transactions WHERE type='income'`
  );
  const [{ expense }] = await db.select<[{ expense: number }]>(
    `SELECT COALESCE(SUM(amount),0) AS expense FROM transactions WHERE type='expense'`
  );
  return { total, income, expense };
}

export async function loadStatsPeriod(
  start: string,
  end: string
): Promise<{ income: number; expense: number; total: number }> {
  const db = await getDB();
  const [{ income }] = await db.select<[{ income: number }]>(
    `SELECT COALESCE(SUM(amount),0) AS income FROM transactions WHERE type='income' AND date BETWEEN $1 AND $2`,
    [start, end]
  );
  const [{ expense }] = await db.select<[{ expense: number }]>(
    `SELECT COALESCE(SUM(amount),0) AS expense FROM transactions WHERE type='expense' AND date BETWEEN $1 AND $2`,
    [start, end]
  );
  return { income, expense, total: income + expense };
}

// ————————————————— CATEGORIE —————————————————

export async function getCategories(
  type: "income" | "expense"
): Promise<Category[]> {
  const db = await getDB();
  return await db.select<Category[]>(
    `SELECT id, name, icon, type FROM categories WHERE type = $1 ORDER BY name`,
    [type]
  );
}

export async function addCategory(c: Omit<Category, "id">): Promise<void> {
  const db = await getDB();
  await db.execute(
    `INSERT INTO categories (name, type, icon) VALUES ($1, $2, $3)`,
    [c.name, c.type, c.icon]
  );
}

export async function deleteCategory(id: number): Promise<void> {
  const db = await getDB();
  await db.execute(`DELETE FROM categories WHERE id = $1`, [id]);
}

export async function updateCategoryIcon(
  id: number,
  icon: string
): Promise<void> {
  const db = await getDB();
  await db.execute(`UPDATE categories SET icon = $1 WHERE id = $2`, [icon, id]);
}

export async function getCategoryById(id: number): Promise<Category | null> {
  const db = await getDB();
  const rows = await db.select<Category[]>(
    `SELECT id, name, icon, type FROM categories WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

// ————————————————— SUBSCRIPTIONS —————————————————

export async function addSubscription(
  sub: Omit<Subscription, "id">
): Promise<void> {
  const db = await getDB();
  await db.execute(
    `INSERT INTO subscriptions (name, amount, category, nextPayment, frequency, status, color)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      sub.name,
      sub.amount,
      sub.category,
      sub.nextPayment,
      sub.frequency,
      sub.status,
      sub.color,
    ]
  );
}

export async function getSubscriptions(): Promise<Subscription[]> {
  const db = await getDB();
  const subs = await db.select<Subscription[]>(
    `SELECT * FROM subscriptions ORDER BY nextPayment ASC`
  );

  return subs.map((sub) => ({
    ...sub,
    nextPayment: new Date(sub.nextPayment).toISOString(),
  }));
}

export async function updateSubscription(sub: Subscription): Promise<void> {
  const db = await getDB();
  await db.execute(
    `UPDATE subscriptions SET
       name = $1,
       amount = $2,
       category = $3,
       nextPayment = $4,
       frequency = $5,
       status = $6,
       color = $7
     WHERE id = $8`,
    [
      sub.name,
      sub.amount,
      sub.category,
      sub.nextPayment,
      sub.frequency,
      sub.status,
      sub.color,
      sub.id,
    ]
  );
}

export async function deleteSubscription(id: number): Promise<void> {
  const db = await getDB();
  await db.execute(`DELETE FROM subscriptions WHERE id = $1`, [id]);
}

export async function clearAllData(): Promise<void> {
  const db = await getDB();
  await db.execute(`DELETE FROM transactions;`);
  await db.execute(`DELETE FROM subscriptions;`);
}

function calcNextDate(date: Date, frequency: string): Date {
  switch (frequency) {
    case "Settimanale":
      return addWeeks(date, 1);
    case "Mensile":
      return addMonths(date, 1);
    case "Trimestrale":
      return addMonths(date, 3);
    case "Annuale":
      return addYears(date, 1);
    default:
      return date;
  }
}
