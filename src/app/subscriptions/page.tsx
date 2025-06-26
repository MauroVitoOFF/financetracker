"use client";

import Header from "@/components/layout/Header";
import AddSubscriptionModal from "@/components/subscriptions/AddSubscriptionModal";
import SubscriptionDetailsModal from "@/components/subscriptions/SubscriptionDetailsModal";
import { SubscriptionFormData } from "@/components/subscriptions/SubscriptionForm";
import SubscriptionItem from "@/components/subscriptions/SubscriptionItem";
import SubscriptionStats from "@/components/subscriptions/SubscriptionStats";
import { Button } from "@/components/ui/button";
import {
  addSubscription,
  deleteSubscription,
  getSubscriptions,
  updateSubscription,
} from "@/lib/db";
import { Subscription } from "@/lib/types";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);

  // 🔄 Aggiorna i dati (es. ricarica dal DB/API)
  const refreshSubscriptions = useCallback(async () => {
    setSubscriptions(await getSubscriptions());
  }, []);

  // 🍀 Edit
  const handleEdit = async (subscription: Subscription) => {
    await updateSubscription(subscription);
    await refreshSubscriptions();
  };

  // ❌ Delete
  const handleDelete = async (id: number) => {
    await deleteSubscription(id);
    await refreshSubscriptions();
  };

  useEffect(() => {
    void refreshSubscriptions();
  }, [refreshSubscriptions]);

  const handleSubscriptionAdded = async (
    data: Omit<SubscriptionFormData, "id">
  ) => {
    const newSub: Omit<Subscription, "id"> = {
      ...data,
      nextPayment: data.nextPayment!.toISOString(), // da Date a string
    };
    await addSubscription(newSub);
    await refreshSubscriptions();
  };

  return (
    <div className="bg-gray-50 min-h-screen space-y-8">
      <Header
        title="Abbonamenti"
        description="Gestisci e visualizza i tuoi abbonamenti"
        actionButton={
          <AddSubscriptionModal onAdd={handleSubscriptionAdded}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nuovo Abbonamento
            </Button>
          </AddSubscriptionModal>
        }
      />
      <SubscriptionStats subscriptions={subscriptions} />
      <div className="bg-white p-6 rounded-lg border space-y-4">
        {subscriptions.map((sub) => (
          <SubscriptionItem
            key={sub.id}
            subscription={sub}
            onClick={setSelectedSubscription}
          />
        ))}
      </div>

      <SubscriptionDetailsModal
        subscription={selectedSubscription}
        onClose={() => setSelectedSubscription(null)}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
}
