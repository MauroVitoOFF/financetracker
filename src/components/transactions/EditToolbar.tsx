import { Button } from "@/components/ui/button";
import { Edit, Trash2, Save, XCircle } from "lucide-react";
import React from "react";

interface Props {
  isEditing: boolean;
  canEdit: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export const EditToolbar: React.FC<Props> = ({
  isEditing,
  canEdit,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  onClose,
}) => (
  <div className="flex items-center gap-3">
    {canEdit && !isEditing && (
      <>
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="w-4 h-4 text-red-600" />
        </Button>
      </>
    )}
    {canEdit && isEditing && (
      <>
        <Button variant="ghost" size="icon" onClick={onSave}>
          <Save className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <XCircle className="w-4 h-4 text-gray-500 hover:text-gray-700" />
        </Button>
      </>
    )}
    <Button variant="ghost" size="icon" onClick={onClose} aria-label="Chiudi">
      <XCircle className="w-4 h-4 text-gray-500 hover:text-gray-700" />
    </Button>
  </div>
);
