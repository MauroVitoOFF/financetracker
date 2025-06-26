"use client";
import React, { useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Transaction } from "@/lib/types";
import {
  defaultExpenseCategories,
  defaultIncomeCategories,
} from "@/config/categories";

interface TransactionItemProps {
  transaction: Transaction;
  onClick?: (txn: Transaction) => void;
}

const italianDateFormatter = new Intl.DateTimeFormat("it-IT", {
  day: "2-digit",
  month: "short",
  year: "numeric",
}); // :contentReference[oaicite:5]{index=5}

export default function TransactionItem({
  transaction,
  onClick,
}: TransactionItemProps) {
  const { title, description, amount, date, type, category } = transaction;
  const isIncome = type === "income";

  const { icon: Icon, color } = (isIncome
    ? defaultIncomeCategories
    : defaultExpenseCategories
  ).find((c) => c.name === category) ?? {
    icon: ChevronRight,
    color: "bg-gray-500",
  };

  const formattedAmount = `${isIncome ? "+" : "-"}€${Math.abs(amount).toFixed(
    2
  )}`;
  const formattedDate = useMemo(
    () => italianDateFormatter.format(new Date(date)),
    [date]
  );

  return (
    <button
      type="button"
      onClick={() => onClick?.(transaction)}
      className="group flex w-full justify-between items-start p-4 bg-white dark:bg-gray-800 border rounded-lg hover:shadow transition"
    >
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
            color
          )}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col min-w-0 text-start">
          <span className="truncate font-medium text-gray-900 dark:text-white">
            {title || "—"}
          </span>
          <span className="truncate text-sm text-gray-500 dark:text-gray-400">
            {description || category}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 min-w-[100px]">
        <div className="flex flex-col items-end">
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
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 self-center" />
      </div>
    </button>
  );
}
