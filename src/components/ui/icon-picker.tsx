import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { LucideIcon } from "lucide-react";
import { availableIcons } from "@/config/categories";

interface IconPickerProps {
  selectedIcon: LucideIcon;
  onIconSelect: (icon: LucideIcon) => void;
}

const IconPicker: React.FC<IconPickerProps> = ({
  selectedIcon,
  onIconSelect,
}) => {
  const [open, setOpen] = useState(false);
  const SelectedIconComponent = selectedIcon;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-12 h-12 p-0">
          <SelectedIconComponent className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4">
        <div className="grid grid-cols-4 gap-2">
          {availableIcons.map(({ name, icon: Icon }) => (
            <Button
              key={name}
              variant="outline"
              className="w-12 h-12 p-0"
              onClick={() => {
                onIconSelect(Icon);
                setOpen(false);
              }}
            >
              <Icon className="w-5 h-5" />
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default IconPicker;
