import { CreditCard, TrendingUp, TrendingDown, Target } from "lucide-react";

interface MainStatsProps {
  total: number;
  income: number;
  expense: number;
}

interface StatCardProps {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: number;
  valueColor?: string;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  valueColor = "text-gray-900",
}: StatCardProps) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
        <Icon className="w-6 h-6 text-gray-600" />
      </div>
    </div>
    <h3 className="text-2xl font-semibold mb-1">
      <span className={valueColor}>€{value.toFixed(2)}</span>
    </h3>
    <p className="text-sm text-gray-600">{label}</p>
  </div>
);

const MainStats = ({ total, income, expense }: MainStatsProps) => (
  <div className="grid grid-cols-4 gap-6 mb-8">
    <StatCard
      icon={CreditCard}
      label="Saldo totale"
      value={total}
      valueColor="text-blue-600"
    />
    <StatCard
      icon={TrendingUp}
      label="Entrate mese"
      value={income}
      valueColor="text-green-600"
    />
    <StatCard
      icon={TrendingDown}
      label="Spese mese"
      value={expense}
      valueColor="text-red-600"
    />
    <StatCard
      icon={Target}
      label="Obiettivi"
      value={0}
      valueColor="text-purple-600"
    />
  </div>
);

export default MainStats;
