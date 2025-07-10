import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Transaction, Category } from "@/lib/types";
import { getCategories } from "@/lib/db";
import { DatePicker } from "../ui/date-picker";
import { parseISO } from "date-fns";

interface Props {
  transaction: Transaction;
  form: Transaction;
  onChange: (
    field: keyof Transaction,
    value: Transaction[keyof Transaction]
  ) => void;
  isEditing: boolean;
  readOnly: boolean;
}

export const TransactionForm: React.FC<Props> = ({
  transaction,
  form,
  onChange,
  isEditing,
  readOnly,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [amountInputValue, setAmountInputValue] = useState(
    Math.abs(form.amount).toString()
  );

  const isIncome = transaction.type === "income";

  useEffect(() => {
    getCategories(transaction.type).then(setCategories);
  }, [transaction.type]);

  useEffect(() => {
    setAmountInputValue(Math.abs(form.amount).toString());
  }, [form.amount]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setAmountInputValue(raw);

    const cleaned = raw.replace(",", ".");
    const parsed = parseFloat(cleaned);

    if (!isNaN(parsed)) {
      const adjusted = isIncome ? parsed : -parsed;
      onChange("amount", adjusted);
    }
  };

  return (
    <div className="space-y-6 mt-2">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Titolo</Label>
          {!isEditing ? (
            <p className="mt-1 text-lg">{transaction.title || "—"}</p>
          ) : (
            <Input
              id="title"
              value={form.title}
              onChange={(e) => onChange("title", e.target.value)}
              className="mt-1"
              disabled={readOnly}
            />
          )}
        </div>

        <div>
          <Label htmlFor="amount">Importo</Label>
          {!isEditing ? (
            <span
              className={cn(
                "text-2xl font-bold",
                isIncome ? "text-green-600" : "text-red-600"
              )}
            >
              {isIncome ? "+" : "-"}€{Math.abs(transaction.amount).toFixed(2)}
            </span>
          ) : (
            <Input
              id="amount"
              inputMode="decimal"
              lang="en"
              value={amountInputValue}
              onChange={handleAmountChange}
              className="mt-1"
              disabled={readOnly}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <div>
          <Label htmlFor="category">Categoria</Label>
          {!isEditing ? (
            <p className="mt-1 text-sm">{transaction.category || "—"}</p>
          ) : (
            <Select
              value={form.category}
              onValueChange={(value) => onChange("category", value)}
              disabled={readOnly}
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Seleziona una categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.name} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div>
          <Label htmlFor="date">Data</Label>
          {!isEditing ? (
            <p className="mt-1 text-sm">
              {new Date(transaction.date).toLocaleDateString("it-IT", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          ) : (
            <DatePicker
              date={form.date ? parseISO(form.date) : undefined}
              onChange={(date) => {
                if (date) {
                  const isoDate = date.toISOString().split("T")[0];
                  onChange("date", isoDate);
                }
              }}
              disabled={readOnly}
            />
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <Label htmlFor="description">Descrizione</Label>
        {!isEditing ? (
          <p className="mt-1 text-sm">{transaction.description || "—"}</p>
        ) : (
          <Textarea
            id="description"
            value={form.description || ""}
            onChange={(e) => onChange("description", e.target.value)}
            className="mt-1"
            rows={3}
            disabled={readOnly}
          />
        )}
      </div>
    </div>
  );
};
