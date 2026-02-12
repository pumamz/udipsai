import { FileText, ListPlus, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import React, { useEffect, useState } from "react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import { FilterDropdown } from "./FilterDropdown";
import Select from "../form/Select";
import Label from "../form/Label";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterField {
  type: "select" | "input";
  name: string;
  label: string;
  placeholder?: string;
  options?: FilterOption[];
  className?: string;
  defaultValue?: string;
}

interface TableActionHeaderProps {
  title: string;
  onSearchClick?: (term: string) => void;
  onNew?: () => void;
  newButtonText?: string;
  onExport?: () => void;
  loading?: boolean;
  placeholder?: string;
  onFilterApply?: () => void;
  onFilterClear?: () => void;
  filterContent?: React.ReactNode;
  filterConfig?: FilterField[];
  activeFilters?: Record<string, any>;
  onFiltersChange?: (filters: Record<string, any>) => void;
  createPermission?: string;
}

export const TableActionHeader: React.FC<TableActionHeaderProps> = ({
  title,
  onSearchClick,
  onNew,
  newButtonText = "Nuevo",
  onExport,
  loading = false,
  placeholder = "Buscar...",
  onFilterApply,
  onFilterClear,
  filterContent,
  filterConfig,
  activeFilters,
  onFiltersChange,
  createPermission,
}) => {
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [internalFilters, setInternalFilters] = useState<Record<string, any>>(
    {}
  );

  useEffect(() => {
    if (activeFilters) {
      setInternalFilters({ ...activeFilters });
    }
  }, [activeFilters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = () => {
    if (onSearchClick) {
      onSearchClick(searchTerm);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleFilterChange = (name: string, value: any) => {
    setInternalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApply = () => {
    if (onFiltersChange) {
      onFiltersChange(internalFilters);
    }
    if (onFilterApply) {
      onFilterApply();
    }
  };

  const handleClear = () => {
    setInternalFilters({});
    if (onFiltersChange) {
      onFiltersChange({});
    }
    if (onFilterClear) {
      onFilterClear();
    }
  };

  const renderDynamicFilters = () => {
    if (!filterConfig) return null;

    return (
      <div className="space-y-4">
        {filterConfig.map((field) => (
          <div key={field.name} className={field.className}>
            <Label className="mb-1.5 text-xs">{field.label}</Label>
            {field.type === "select" ? (
              <Select
                options={field.options || []}
                placeholder={field.placeholder || "Seleccionar"}
                value={
                  internalFilters[field.name] === undefined
                    ? ""
                    : String(internalFilters[field.name])
                }
                onChange={(val) => handleFilterChange(field.name, val)}
                className="h-9 text-xs"
              />
            ) : (
              <Input
                type="text"
                placeholder={field.placeholder || ""}
                value={internalFilters[field.name] || ""}
                onChange={(e) => handleFilterChange(field.name, e.target.value)}
                className="h-9 text-xs"
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const contentToRender = filterConfig ? renderDynamicFilters() : filterContent;
  const showFilterDropdown =
    Boolean(contentToRender) &&
    ((filterConfig && onFiltersChange) || (onFilterApply && onFilterClear));

  return (
    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 ml-4">
        {title}
      </h2>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {onSearchClick && (
            <div className="relative flex items-center group">
              <Input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="h-11 w-full sm:w-64 rounded-r-none border-r-0 focus:ring-0"
              />
              <Button
                onClick={handleSearchSubmit}
                className="h-11 rounded-l-none px-4 flex items-center gap-2 transition-all duration-200 dark:bg-gray-600 dark:hover:bg-gray-700"
              >
                <Search size={16} />
              </Button>
            </div>
          )}

          {showFilterDropdown && (
            <FilterDropdown onApply={handleApply} onClear={handleClear}>
              {contentToRender}
            </FilterDropdown>
          )}

        <div className="flex gap-2">
          {onExport && (
            <Button variant="outline" onClick={onExport} className="h-11">
              <FileText size={16} /> Exportar
            </Button>
          )}

          {onNew && (!createPermission || hasPermission(createPermission)) && (
            <Button
              onClick={onNew}
              disabled={loading}
              className="h-11 dark:bg-gray-600 dark:hover:bg-gray-700"
            >
              <ListPlus size={16} /> {newButtonText}
            </Button>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};
