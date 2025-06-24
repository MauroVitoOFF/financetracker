"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import TransactionCard from "../transactions/TransactionItem";
import TransactionDetailsModal from "@/components/transactions/TransactionDetailsModal";
import { Transaction } from "@/lib/types";
import { useRouter } from "next/navigation";

interface RecentTransactionsProps {
  data: Transaction[];
  onRefresh: () => void;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  data,
  onRefresh,
}) => {
  const router = useRouter();
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  const handleClose = () => setSelectedTxn(null);
  const handleUpdate = async () => {
    onRefresh();
    handleClose();
  };
  const handleDelete = async () => {
    onRefresh();
    handleClose();
  };

  return (
    <div className="col-span-2 bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Transazioni Recenti
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/transactions")}
        >
          Vedi tutte
        </Button>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {data.length === 0 ? (
            <p className="text-gray-500">Nessuna transazione</p>
          ) : (
            data.map((t) => (
              <TransactionCard
                key={t.id}
                transaction={t}
                onClick={() => setSelectedTxn(t)}
              />
            ))
          )}
        </div>
      </div>

      <TransactionDetailsModal
        transaction={selectedTxn}
        onClose={handleClose}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        readOnly={true}
      />
    </div>
  );
};

export default RecentTransactions;
