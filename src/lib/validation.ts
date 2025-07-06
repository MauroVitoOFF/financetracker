import { z } from "zod";

export const TransactionBackupSchema = z.object({
  amount: z.number(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  date: z.string(),
  type: z.enum(["income", "expense"]),
  isRecurring: z.boolean(),
  installments: z.number().nullable(),
  recurringFrequency: z.string().nullable(),
  recurringEndDate: z.string().nullable(),
  subscriptionId: z.number().nullable(),
});

export const CategoryBackupSchema = z.object({
  name: z.string(),
  icon: z.string(),
  type: z.enum(["income", "expense"]),
});

export const SubscriptionBackupSchema = z.object({
  name: z.string(),
  amount: z.number(),
  category: z.string(),
  nextPayment: z.string(),
  frequency: z.string(),
  status: z.enum(["active", "paused"]),
  color: z.string().nullable().optional(),
});

// Schemi base
export const TransactionSchema = z.object({
  id: z.number().optional(), // necessario per Zod inferenza flessibile
  amount: z.number(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  date: z.string(), // ISO string (meglio validarla se vuoi)
  type: z.enum(["income", "expense"]),
  isRecurring: z.boolean(),
  installments: z.number().nullable(),
  recurringFrequency: z.string().nullable(),
  recurringEndDate: z.string().nullable(),
  subscriptionId: z.number().nullable(),
});

export const CategorySchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  icon: z.string(),
  type: z.enum(["income", "expense"]),
});

export const SubscriptionSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  amount: z.number(),
  category: z.string(),
  nextPayment: z.string(),
  frequency: z.string(),
  status: z.enum(["active", "paused"]),
  color: z.string().optional().nullable(),
});

// Schema backup finale
export const BackupDataSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string(),
  transactions: z.array(TransactionBackupSchema),
  categories: z.array(CategoryBackupSchema),
  subscriptions: z.array(SubscriptionBackupSchema),
  signature: z.string(),
});
