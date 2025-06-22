"use client";
import React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Transaction } from "@/lib/types";
import {
  defaultExpenseCategories,
  defaultIncomeCategories,
} from "@/config/categories";

interface Props {
  transaction: Transaction;
  onClick?: (txn: Transaction) => void;
}

const TransactionCard: React.FC<Props> = ({ transaction, onClick }) => {
  const isIncome = transaction.type === "income";
  const { title, description, amount, date, category } = transaction;

  const config = (isIncome
    ? defaultIncomeCategories
    : defaultExpenseCategories
  ).find((c) => c.name === category) ?? {
    icon: ChevronRight,
    color: "bg-gray-500",
  };

  const CategoryIcon = config.icon;

  const formattedAmount = `${isIncome ? "+" : "-"}€${Math.abs(amount).toFixed(
    2
  )}`;
  const formattedDate = new Date(date).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <button
      onClick={() => onClick?.(transaction)}
      className={cn(
        "group flex w-full items-start justify-between bg-white dark:bg-gray-800 border rounded-lg p-4 hover:shadow transition-all cursor-pointer"
      )}
    >
      {/* Icona + Testo */}
      <div className="flex items-start gap-4 flex-1 min-w-0">
        {/* Icona */}
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
            config.color
          )}
        >
          <CategoryIcon className="w-6 h-6 text-white" />
        </div>

        {/* Titolo + Descrizione */}
        <div className="flex flex-col min-w-0">
          <span className="font-medium text-gray-900 dark:text-white truncate text-start">
            {title || "—"}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 truncate text-start">
            {description || category}
          </span>
        </div>
      </div>

      {/* Importo + Data + Freccia */}
      <div className="flex items-start shrink-0 ml-4">
        {/* Importo + Data */}
        <div className="flex flex-col items-end text-right min-w-[100px]">
          <span
            className={cn(
              "text-sm font-semibold",
              isIncome
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            )}
          >
            {formattedAmount}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {formattedDate}
          </span>
        </div>

        {/* Freccia */}
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 self-center ml-3" />
      </div>
    </button>
  );
};

export default TransactionCard;
