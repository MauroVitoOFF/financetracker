"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SubscriptionForm, { SubscriptionFormData } from "./SubscriptionForm";

interface AddSubscriptionModalProps {
  onAdd: (data: Omit<SubscriptionFormData, "id">) => void;
  children: React.ReactNode;
}

const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({
  onAdd,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<SubscriptionFormData>({
    name: "",
    amount: 0,
    category: "",
    nextPayment: null,
    frequency: "",
    status: "active",
    color: "bg-blue-500",
  });

  const handleSubmit = () => {
    const { name, amount, category, nextPayment, frequency } = formData;
    if (!name || !amount || !category || !frequency || !nextPayment) return;
    onAdd(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: "",
      amount: 0,
      category: "",
      nextPayment: null,
      frequency: "",
      status: "active",
      color: "bg-blue-500",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nuovo Abbonamento</DialogTitle>
        </DialogHeader>

        <SubscriptionForm data={formData} onChange={setFormData} />

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={handleClose}>
            Annulla
          </Button>
          <Button onClick={handleSubmit}>Aggiungi Abbonamento</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubscriptionModal;
