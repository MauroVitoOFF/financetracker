"use client";
import React, { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import IconPicker from "../ui/icon-picker";
import {
  addCategory,
  categoryNameExists,
  deleteCategory,
  getCategories,
  updateCategoryIcon,
} from "@/lib/db";
import { availableIcons } from "@/config/categories";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  type: "income" | "expense";
  label: string;
}
interface Category {
  id: number;
  name: string;
  type: "income" | "expense";
  icon: string;
}

export default function CategoriesTab({ type, label }: Props) {
  const [cats, setCats] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState<LucideIcon>(availableIcons[0].icon);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      setCats(await getCategories(type));
    })();
  }, [type]);

  const handleAdd = async () => {
    const name = newName.trim();
    if (!name) return;

    const exists = await categoryNameExists(name);
    if (exists) {
      toast.error("Esiste già una categoria con questo nome.");
      return;
    }

    const iconName = newIcon.displayName!;
    await addCategory({ name, type, icon: iconName });
    setNewName("");
    setNewIcon(availableIcons[0].icon);
    setCats(await getCategories(type));
  };

  const handleDelete = async (category: Category) => {
    try {
      await deleteCategory(category.id);
      setCats(await getCategories(type));
      toast.success("Categoria eliminata.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message, {
          action: {
            label: "Visualizza transazioni",
            onClick: () => {
              localStorage.setItem("categoryFilter", category.name);
              router.push("/transactions");
              console.log("Naviga a transazioni filtrate");
            },
          },
        });
      } else {
        toast.error("Errore sconosciuto durante l'eliminazione.");
      }
    }
  };

  const handleIconChange = async (id: number, iconName: string) => {
    await updateCategoryIcon(id, iconName);
    setCats(await getCategories(type));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{label}</h3>
      <ul className="space-y-3 mb-6">
        {cats.map((c) => {
          const IconComp = LucideIcons[
            c.icon as keyof typeof LucideIcons
          ] as LucideIcon;
          return (
            <li
              key={c.id}
              className="flex items-center justify-between border rounded-lg p-3"
            >
              <div className="flex items-center space-x-3">
                <IconPicker
                  selectedIcon={IconComp}
                  onIconSelect={(IC) => handleIconChange(c.id, IC.displayName!)}
                />
                <span>{c.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(c)}
                className="text-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </li>
          );
        })}
      </ul>
      <div className="flex space-x-2 items-center">
        <IconPicker
          selectedIcon={newIcon}
          onIconSelect={(IC) => setNewIcon(IC)}
        />
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={`Nuova categoria ${type}`}
        />
        <Button onClick={handleAdd} size="sm">
          <Plus />
        </Button>
      </div>
    </div>
  );
}
