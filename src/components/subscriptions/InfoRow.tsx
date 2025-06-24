// InfoRow.tsx
"use client";
import React from "react";
import { Input } from "@/components/ui/input";
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
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (newVal: string) => void;
  selectOptions?: string[];
  isDate?: boolean;
}

export default function InfoRow({
  icon,
  label,
  value,
  isEditing,
  onChange,
  selectOptions,
  isDate = false,
}: InfoRowProps) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <div className="flex-1">
        <p className="text-sm text-gray-600">{label}</p>
        {isEditing ? (
          isDate ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal", // aggiunto text-left
                    !value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value || "Seleziona data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={value ? new Date(value) : undefined}
                  onSelect={(date) => date && onChange(date.toISOString())}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          ) : selectOptions ? (
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger>
                <SelectValue placeholder={`Seleziona ${label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {selectOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input value={value} onChange={(e) => onChange(e.target.value)} />
          )
        ) : (
          <p className="font-medium">{value}</p>
        )}
      </div>
    </div>
  );
}
