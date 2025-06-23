"use client";

import { useCallback, useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import MainStats from "@/components/dashboard/MainStats";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import {
  loadStats,
  getRecentTransactions,
  deleteTransaction,
  updateTransaction,
} from "@/lib/db";
import { Transaction } from "@/lib/types";
import TransactionDetailsModal from "@/components/modals/TransactionDetailsModal";

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
        description="Panoramica delle tue finanze"
        showAddTransactionButton
        onTransactionAdded={handleTransactionAdded}
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
