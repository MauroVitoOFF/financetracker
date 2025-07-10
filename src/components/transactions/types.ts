import type { Transaction } from "@/lib/types";

export interface Props {
  transaction: Transaction | null;
  onClose: () => void;
  onDelete: (transactionId: number, deleteAll?: boolean) => void;
  onUpdate: (transaction: Transaction, updateAll?: boolean) => void;
  readOnly?: boolean;
}
