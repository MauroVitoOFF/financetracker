"use client";
import { useState, useEffect, useCallback } from "react";
import Header from "@/components/layout/Header";
import TransactionItem from "@/components/transactions/TransactionItem";
import AddTransactionModal from "@/components/transactions/AddTransactionModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, Filter, CalendarIcon } from "lucide-react";
import { Transaction } from "@/lib/types";
import TransactionDetailsModal from "@/components/transactions/TransactionDetailsModal";

type TypeFilter = "all" | "expense" | "income";

export default function Transactions() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const expenseData = await getTransactions("expense");
    const incomeData = await getTransactions("income");
    const combined = [...expenseData, ...incomeData].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setTransactions(combined);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const storedCategory = localStorage.getItem("categoryFilter");
    if (storedCategory) {
      setCategoryFilter(storedCategory);
      localStorage.removeItem("categoryFilter");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const filtered = transactions.filter((tx) => {
    const textMatch =
      tx.description.toLowerCase().includes(search.toLowerCase()) ||
      tx.category.toLowerCase().includes(search.toLowerCase());

    const typeMatch = typeFilter === "all" || tx.type === typeFilter;

    const dateMatch = dateFilter
      ? new Date(tx.date).toDateString() === dateFilter.toDateString()
      : true;

    const categoryMatch =
      !categoryFilter ||
      tx.category.toLowerCase() === categoryFilter.toLowerCase();

    return textMatch && typeMatch && dateMatch && categoryMatch;
  });

  const totalIncome = filtered
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const handleUpdate = async (txn: Transaction) => {
    await updateTransaction(txn);
    await refresh();
  };

  const handleDelete = async (id: number, deleteAll: boolean = false) => {
    await deleteTransaction(id, deleteAll);
    await refresh();
  };

  return (
    <div className="bg-gray-50 min-h-screen space-y-8">
      <Header
        title="Transazioni"
        description="Gestisci e visualizza le tue transazioni"
        actionButtons={
          <AddTransactionModal type="expense" onTransactionAdded={refresh}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-transform duration-200 transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nuova Transazione
            </Button>
          </AddTransactionModal>
        }
      />

      {/* Filtro e barra ricerca */}
      <div className="flex gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cerca..."
            className="pl-12 h-12"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-12 px-4 flex items-center space-x-2"
            >
              <Filter className="w-5 h-5" />
              <span>Filtra</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={4}>
            <DropdownMenuLabel>Tipo transazione</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={typeFilter}
              onValueChange={(v) => setTypeFilter(v as TypeFilter)}
            >
              <DropdownMenuRadioItem value="all">Tutti</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="expense">
                Spese
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="income">
                Entrate
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-12 px-4 flex items-center space-x-2"
            >
              <Filter className="w-5 h-5" />
              <span>{categoryFilter ?? "Categoria"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={4}>
            <DropdownMenuLabel>Categoria</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={categoryFilter ?? "all"}
              onValueChange={(value) =>
                setCategoryFilter(value === "all" ? null : value)
              }
            >
              <DropdownMenuRadioItem value="all">Tutte</DropdownMenuRadioItem>
              {Array.from(new Set(transactions.map((t) => t.category)))
                .sort()
                .map((cat) => (
                  <DropdownMenuRadioItem key={cat} value={cat}>
                    {cat}
                  </DropdownMenuRadioItem>
                ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-12 px-4 flex items-center space-x-2"
            >
              <CalendarIcon />
              <span>{dateFilter?.toLocaleDateString("it-IT") ?? "Data"}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-auto">
            <Calendar
              mode="single"
              selected={dateFilter}
              onSelect={(d) => setDateFilter(d ?? undefined)}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Statistiche rapide */}
      {isLoading ? (
        <div className="grid grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg border">
              <Skeleton className="h-5 w-28 mb-2" />
              <Skeleton className="h-8 w-32" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              label: "Tot. Entrate",
              value: totalIncome,
              color: "text-green-600",
            },
            { label: "Tot. Spese", value: totalExpense, color: "text-red-600" },
            { label: "Saldo Netto", value: netBalance, color: "text-blue-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-lg border">
              <h3 className="text-sm text-gray-600">{stat.label}</h3>
              <p className={`text-2xl font-semibold ${stat.color}`}>
                {isNaN(stat.value) ? "-" : `€${stat.value.toFixed(2)}`}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Lista transazioni (Card) */}
      <div className="bg-white p-6 rounded-lg border space-y-4">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-md" />
          ))
        ) : filtered.length === 0 ? (
          <p className="text-gray-500">Nessuna transazione trovata.</p>
        ) : (
          filtered.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onClick={setSelectedTxn}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <TransactionDetailsModal
        transaction={selectedTxn}
        onClose={() => setSelectedTxn(null)}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
