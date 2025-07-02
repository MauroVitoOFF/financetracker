export interface Transaction {
  id: number;
  amount: number;
  title: string;
  description: string;
  category: string;
  date: string;
  type: "income" | "expense";
  isRecurring: boolean;
  installments?: number | null;
  recurringFrequency?: string | null;
  recurringEndDate?: string | null;
  subscriptionId?: number | null;
}

export interface Subscription {
  id: number;
  name: string;
  amount: number;
  category: string;
  nextPayment: string;
  frequency: "Mensile" | "Annuale" | string;
  status: "active" | "paused";
  color?: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  type: "income" | "expense";
}

export interface MainStatsProps {
  prevStats: { total: number; income: number; expense: number };
  currentStats: { total: number; income: number; expense: number };
}
