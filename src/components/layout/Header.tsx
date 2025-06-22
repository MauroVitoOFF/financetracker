import { Plus } from "lucide-react";
import AddTransactionModal from "../modals/AddTransactionModal";
import { Button } from "../ui/button";

interface HeaderProps {
  title: string;
  description: string;
  onTransactionAdded?: () => void;
  showAddTransactionButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  description,
  onTransactionAdded,
  showAddTransactionButton = false,
}) => (
  <div className="flex items-center justify-between mb-8">
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600">{description}</p>
    </div>
    {showAddTransactionButton && onTransactionAdded && (
      <AddTransactionModal
        type="expense"
        onTransactionAdded={onTransactionAdded}
      >
        <Button
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuova Transazione
        </Button>
      </AddTransactionModal>
    )}
  </div>
);

export default Header;
