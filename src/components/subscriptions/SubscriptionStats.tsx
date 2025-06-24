import { CreditCard, AlertCircle } from "lucide-react";
import type { Subscription } from "@/lib/types";

interface Props {
  subscriptions: Subscription[];
}

// Formatter globale
const itDate = new Intl.DateTimeFormat("it-IT", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function SubscriptionStats({ subscriptions }: Props) {
  const active = subscriptions.filter((s) => s.status === "active");
  const totalMonthly = active.reduce(
    (sum, s) => sum + (s.frequency === "Mensile" ? s.amount : s.amount / 12),
    0
  );

  const next = active.length
    ? active.reduce((a, b) =>
        new Date(a.nextPayment).getTime() < new Date(b.nextPayment).getTime()
          ? a
          : b
      )
    : null;

  const subtitle = next
    ? `${next.name} – ${itDate.format(new Date(next.nextPayment))}`
    : "Nessun abbonamento attivo";

  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      <StatCard
        icon={<CreditCard className="w-5 h-5 text-blue-500" />}
        title="Abbonamenti Mensili"
        amount={totalMonthly}
        subtitle={`${active.length} attivi`}
      />
      <StatCard
        icon={<AlertCircle className="w-5 h-5 text-orange-500" />}
        title="Prossimo Pagamento"
        amount={next ? next.amount : 0}
        subtitle={subtitle}
      />
    </div>
  );
}

function StatCard({
  icon,
  title,
  amount,
  subtitle,
  isCurrency = true,
}: {
  icon: React.ReactNode;
  title: string;
  amount: number;
  subtitle?: string;
  isCurrency?: boolean;
}) {
  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon}
      </div>
      <p className="text-2xl font-semibold text-gray-900">
        {isCurrency ? `€${amount.toFixed(2)}` : amount}
      </p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
