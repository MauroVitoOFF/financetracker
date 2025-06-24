import { ChevronRight, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Subscription } from "@/lib/types";

interface Props {
  subscription: Subscription;
  onClick?: (subscription: Subscription) => void;
}

export default function SubscriptionItem({ subscription, onClick }: Props) {
  const formatter = new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const formattedDate = formatter.format(new Date(subscription.nextPayment));

  return (
    <button
      type="button"
      onClick={() => onClick?.(subscription)}
      className="group flex w-full justify-between items-start p-4 bg-white dark:bg-gray-800 border rounded-lg hover:shadow transition"
    >
      {/* Icona e info base */}
      <div className="flex items-center space-x-4 text-start">
        <div
          className={`w-12 h-12 ${subscription.color} rounded-lg flex items-center justify-center`}
        >
          <span className="text-white font-semibold">
            {subscription.name.charAt(0)}
          </span>
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{subscription.name}</h4>
          <p className="text-sm text-gray-600">{subscription.category}</p>
        </div>
      </div>

      {/* Dettagli: importo, data, badge */}
      <div className="flex items-center space-x-6">
        <div className="text-right">
          <p className="font-semibold text-gray-900">
            €{subscription.amount.toFixed(2)}
          </p>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {formattedDate}
          </span>
        </div>

        {/* Azioni */}
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 self-center" />
      </div>
    </button>
  );
}
