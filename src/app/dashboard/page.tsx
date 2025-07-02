"use client";
import { useCallback, useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import MainStats from "@/components/dashboard/MainStats";
import RecentTransactions from "@/components/transactions/RecentTransactions";
import AddTransactionModal from "@/components/transactions/AddTransactionModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  loadStats,
  getRecentTransactions,
  deleteTransaction,
  updateTransaction,
} from "@/lib/db";
import { Transaction } from "@/lib/types";
import TransactionDetailsModal from "@/components/transactions/TransactionDetailsModal";
import UpdateModal from "@/config/UpdateModal";

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, income: 0, expense: 0 });
  const [recent, setRecent] = useState<Transaction[]>([]);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  const refreshStats = useCallback(async () => {
    const data = await loadStats();
    setStats(data);
  }, []);

  const refreshRecent = useCallback(async () => {
    const data = await getRecentTransactions(5);
    setRecent(data);
  }, []);

  const handleTransactionAdded = useCallback(() => {
    refreshStats();
    refreshRecent();
  }, [refreshStats, refreshRecent]);

  useEffect(() => {
    refreshStats();
    refreshRecent();
  }, [refreshStats, refreshRecent]);

  return (
    <div className="bg-gray-50 min-h-screen space-y-8">
      <Header
        title="Dashboard"
        description="Gestione delle tue finanze"
        actionButtons={
          <>
            <AddTransactionModal
              type="expense"
              onTransactionAdded={handleTransactionAdded}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" /> Nuova Transazione
              </Button>
            </AddTransactionModal>
          </>
        }
      />
      <MainStats {...stats} />
      <div className="grid grid-cols-3 gap-8">
        <RecentTransactions data={recent} onRefresh={refreshRecent} />
      </div>
      <TransactionDetailsModal
        transaction={selectedTxn}
        onClose={() => setSelectedTxn(null)}
        onDelete={(id) => {
          deleteTransaction(id).then(() => {
            refreshStats();
            refreshRecent();
            setSelectedTxn(null);
          });
        }}
        onUpdate={(updated) => {
          updateTransaction(updated).then(() => {
            refreshStats();
            refreshRecent();
            setSelectedTxn(null);
          });
        }}
      />
    </div>
  );
}
