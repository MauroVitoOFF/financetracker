"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export interface SubscriptionFormData {
  name: string;
  amount: number;
  category: string;
  nextPayment: Date | null;
  frequency: string;
  status: "active" | "paused";
  color: string;
}

interface FormProps {
  data: SubscriptionFormData;
  onChange: (newData: SubscriptionFormData) => void;
}

const categories = [
  "Intrattenimento",
  "Musica",
  "Software",
  "Sport",
  "Shopping",
  "Produttività",
  "Streaming",
  "Gaming",
  "Cloud Storage",
  "Altro",
];

const frequencies = ["Mensile", "Annuale", "Settimanale", "Trimestrale"];

const colors = [
  { value: "bg-blue-500", name: "Blu" },
  { value: "bg-red-500", name: "Rosso" },
  { value: "bg-green-500", name: "Verde" },
  { value: "bg-yellow-500", name: "Giallo" },
  { value: "bg-purple-500", name: "Viola" },
  { value: "bg-orange-500", name: "Arancione" },
  { value: "bg-pink-500", name: "Rosa" },
  { value: "bg-indigo-500", name: "Indaco" },
];

const SubscriptionForm: React.FC<FormProps> = ({ data, onChange }) => {
  const update = (key: keyof SubscriptionFormData, value: any) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-6">
      {/* Servizio */}
      <div className="space-y-2">
        <Label htmlFor="name">Servizio</Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="es. Netflix"
        />
      </div>

      {/* Importo e Frequenza */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-5 space-y-2 relative">
          <Label htmlFor="amount">Importo (€)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              €
            </span>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={data.amount === 0 ? "" : data.amount}
              onChange={(e) =>
                update("amount", parseFloat(e.target.value) || 0)
              }
              className="pl-8"
            />
          </div>
        </div>

        <div className="col-span-7 space-y-2">
          <Label>Frequenza</Label>
          <SelectGroup
            options={frequencies}
            value={data.frequency}
            onChange={(v) => update("frequency", v)}
          />
        </div>
      </div>

      {/* Categoria */}
      <div className="space-y-2">
        <Label>Categoria</Label>
        <SelectGroup
          options={categories}
          value={data.category}
          onChange={(v) => update("category", v)}
        />
      </div>

      {/* Prossimo pagamento */}
      <div className="space-y-2">
        <Label>Prossimo pagamento</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full flex items-start justify-start text-left font-normal",
                !data.nextPayment && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
              <span className="flex-1">
                {data.nextPayment
                  ? format(data.nextPayment, "dd/MM/yyyy")
                  : "Seleziona data"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={data.nextPayment || undefined}
              onSelect={(d) => d && update("nextPayment", d)}
              autoFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Colore e Stato */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6 space-y-2">
          <Label>Colore</Label>
          <SelectGroup
            options={colors.map((c) => c.name)}
            value={colors.find((c) => c.value === data.color)?.name || ""}
            onChange={(name) =>
              update("color", colors.find((c) => c.name === name)?.value!)
            }
            renderItem={(name) => {
              const col = colors.find((c) => c.name === name)!;
              return (
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${col.value}`} />
                  {name}
                </div>
              );
            }}
          />
        </div>
        <div className="col-span-6 space-y-2">
          <Label>Stato</Label>
          <SelectGroup
            options={["Attivo", "Sospeso"]}
            value={data.status === "active" ? "Attivo" : "Sospeso"}
            onChange={(v) =>
              update("status", v === "Attivo" ? "active" : "paused")
            }
          />
        </div>
      </div>
    </div>
  );
};

interface SelectGroupProps {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  renderItem?: (v: string) => React.ReactNode;
}

const SelectGroup: React.FC<SelectGroupProps> = ({
  options,
  value,
  onChange,
  renderItem,
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Seleziona..." />
    </SelectTrigger>
    <SelectContent>
      {options.map((opt) => (
        <SelectItem key={opt} value={opt}>
          {renderItem ? renderItem(opt) : opt}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export default SubscriptionForm;
