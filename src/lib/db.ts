// src/lib/db.ts
import Database from "@tauri-apps/plugin-sql";
import type { Transaction, Category } from "./types";

export async function getDB() {
  return await Database.load("sqlite:finance.db");
}

export async function initSchema() {
  const db = await getDB();

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

  // categorie default
  await db.execute(`
    INSERT OR IGNORE INTO categories (name, type, icon) VALUES
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

// TRANSAZIONI

export async function addTransaction(
  txn: Omit<Transaction, "id">
): Promise<void> {
  const db = await getDB();
  await db.execute(
    `INSERT INTO transactions (amount, title, description, category, date, type)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [txn.amount, txn.title, txn.description, txn.category, txn.date, txn.type]
  );
}

// Ritorna array di Transaction
export async function getTransactions(
  type: "income" | "expense"
): Promise<Transaction[]> {
  const db = await getDB();
  return await db.select<Transaction[]>(
    `
    SELECT id, amount, title, description, category, date, type
    FROM transactions
    WHERE type = $1
    ORDER BY date DESC`,
    [type]
  );
}

// CATEGORIE
export async function getCategories(
  type: "income" | "expense"
): Promise<Category[]> {
  const db = await getDB();
  return await db.select<Category[]>(
    `
    SELECT id, name, icon, type
    FROM categories
    WHERE type = $1
    ORDER BY name`,
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
    `
    SELECT id, name, icon, type
    FROM categories
    WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

// STATISTICHE

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

export async function getRecentTransactions(
  limit: number = 5
): Promise<Transaction[]> {
  const db = await getDB();
  const rows = await db.select<Transaction[]>(
    `SELECT id, amount, title, description, category, date, type
     FROM transactions
     ORDER BY date DESC, id DESC
     LIMIT $1`,
    [limit]
  );
  return rows;
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

export async function updateTransaction(txn: Transaction): Promise<void> {
  const db = await getDB();
  await db.execute(
    `UPDATE transactions
     SET amount = $1,
         title = $2
         description = $3,
         category = $4,
         date = $5,
         type = $6
     WHERE id = $7`,
    [
      txn.amount,
      txn.title,
      txn.description,
      txn.category,
      txn.date,
      txn.type,
      txn.id,
    ]
  );
}

export async function deleteTransaction(id: number): Promise<void> {
  const db = await getDB();
  await db.execute(`DELETE FROM transactions WHERE id = $1`, [id]);
}

export async function clearAllData(): Promise<void> {
  const db = await getDB();
  await db.execute(`DELETE FROM transactions;`);
  // Se vuoi anche resettare categorie custom, puoi uncommentare:
  // await db.execute(`DELETE FROM categories WHERE id NOT IN (/* default IDs */);`);
}
