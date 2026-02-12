import type React from "react";
import { Filter } from "lucide-react";
import { useState } from "react";
import Button from "../ui/button/Button";
import { Dropdown } from "../ui/dropdown/Dropdown";

interface FilterDropdownProps {
  children: React.ReactNode;
  onApply: () => void;
  onClear: () => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  children,
  onApply,
  onClear,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="h-11 px-4 flex items-center gap-2 dropdown-toggle"
      >
        <Filter size={16} />
        <span className="hidden sm:inline">Filtros</span>
      </Button>
      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="w-80 p-4 mt-2"
      >
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
            Filtros avanzados
          </h3>
          <div className="space-y-3">{children}</div>
          <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 mt-4">
            <Button
              variant="outline"
              className="flex-1 h-9 text-xs"
              onClick={() => {
                onClear();
                setIsOpen(false);
              }}
            >
              Limpiar
            </Button>
            <Button
              className="flex-1 h-9 text-xs dark:bg-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              onClick={() => {
                onApply();
                setIsOpen(false);
              }}
            >
              Aplicar
            </Button>
          </div>
        </div>
      </Dropdown>
    </div>
  );
};
