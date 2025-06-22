export interface Transaction {
  id: number;
  amount: number;
  title: string;
  description: string;
  category: string;
  date: string;
  type: "income" | "expense";
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
