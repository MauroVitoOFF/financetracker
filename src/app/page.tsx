"use client";

import { useCallback, useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import MainStats from "@/components/dashboard/MainStats";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import { loadStats, getRecentTransactions } from "@/lib/db";
import { Transaction } from "@/lib/types";

export default function Home() {
  const [stats, setStats] = useState({ total: 0, income: 0, expense: 0 });
  const [recent, setRecent] = useState<Transaction[]>([]);

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
    <div className="min-h-screen bg-gray-50 pl-20 pr-8 py-8">
      <div className="max-w-6xl mx-auto">
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
      </div>
    </div>
  );
}
