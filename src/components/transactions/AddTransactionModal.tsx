// src/components/modals/AddTransactionModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { addTransaction, getCategories } from "@/lib/db";
import { toast } from "sonner";

interface Category {
  id: number;
  name: string;
  icon: string;
}

interface AddTransactionModalProps {
  type?: "income" | "expense";
  children: React.ReactNode;
  onTransactionAdded: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  type = "expense",
  children,
  onTransactionAdded,
}) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"expense" | "income">(type);

  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [categories, setCategories] = useState<Category[]>([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("Mensile");
  const [installments, setInstallments] = useState("");

  useEffect(() => {
    if (!open) return;
    (async () => {
      const cats = await getCategories(activeTab);
      setCategories(cats);
      setCategory("");
    })();
  }, [activeTab, open]);

  const resetForm = () => {
    setAmount("");
    setTitle("");
    setDescription("");
    setCategory("");
    setDate(new Date());
    setIsRecurring(false);
    setFrequency("Mensile");
    setInstallments("");
  };

  const handleSubmit = async () => {
    if (!amount || !category || !title) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }

    await addTransaction({
      type: activeTab,
      amount: parseFloat(amount),
      title,
      description,
      date: date.toISOString().split("T")[0],
      category,
      isRecurring,
      installments: installments ? parseInt(installments) : null,
      recurringFrequency: frequency,
    });

    toast.success("Transazione aggiunta!");
    onTransactionAdded();
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Nuova Transazione</span>
          </DialogTitle>
          <DialogDescription>
            Aggiungi una nuova entrata o spesa al portafoglio
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "expense" | "income")}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="expense" className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4" /> Spesa
            </TabsTrigger>
            <TabsTrigger value="income" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Entrata
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {/* Importo e Data */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Importo</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    €
                  </span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-left"
                    >
                      {format(date, "dd/MM/yyyy", { locale: it })}
                      <CalendarIcon className="text-gray-500" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => d && setDate(d)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Titolo */}
            <div className="space-y-2 mt-4">
              <Label>Titolo *</Label>
              <Input
                placeholder="es. Affitto, Spesa, Stipendio"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Descrizione */}
            <div className="space-y-2">
              <Label>Descrizione</Label>
              <Input
                placeholder="Dettagli aggiuntivi (opzionale)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <Label>Categoria *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleziona categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ricorrente */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="recurring"
                  checked={isRecurring}
                  onCheckedChange={(c) => setIsRecurring(c as boolean)}
                />
                <Label htmlFor="recurring">Transazione ricorrente</Label>
              </div>

              {isRecurring && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Frequenza</Label>
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["Mensile", "Settimanale", "Annuale"].map((f) => (
                          <SelectItem key={f} value={f}>
                            {f}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label>Rate (opzionale)</Label>
                    <Input
                      type="number"
                      placeholder="es. 12"
                      value={installments}
                      onChange={(e) => setInstallments(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Button
          className={`w-full py-2 mt-6 ${
            activeTab === "expense" ? "bg-red-600" : "bg-green-600"
          }`}
          disabled={!amount || !category || !title}
          onClick={handleSubmit}
        >
          {activeTab === "expense" ? (
            <TrendingDown className="w-4 h-4 mr-2" />
          ) : (
            <TrendingUp className="w-4 h-4 mr-2" />
          )}
          Aggiungi {activeTab === "expense" ? "Spesa" : "Entrata"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionModal;
