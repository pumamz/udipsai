import { ReactNode } from "react";
import { Info } from "lucide-react";

interface TableProps {
  children: ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
}

interface TableCellProps {
  children: ReactNode;
  colSpan?: number;
  isHeader?: boolean;
  className?: string;
}

interface TableLoadingProps {
  colSpan: number;
  message?: string;
}

interface TableEmptyProps {
  colSpan: number;
  message?: string;
}

const variantClasses = {
  body: "px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300",
  header: "px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400",
};

const Table: React.FC<TableProps> = ({ children, className }) => {
  return <table className={`min-w-full  ${className}`}>{children}</table>;
};
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};

const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};
const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return <tr className={className}>{children}</tr>;
};

const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  colSpan,
  className,
}) => {
  const CellTag = isHeader ? "th" : "td";
  return (
    <CellTag
      className={`${variantClasses[isHeader ? "header" : "body"]} ${className}`}
      colSpan={colSpan}
    >
      {children}
    </CellTag>
  );
};

const TableLoading: React.FC<TableLoadingProps> = ({
  colSpan,
  message = "Cargando...",
}) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan}>
        <div className="flex flex-col items-center justify-center space-y-4 py-20">
          <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">{message}</p>
        </div>
      </TableCell>
    </TableRow>
  );
};

const TableEmpty: React.FC<TableEmptyProps> = ({
  colSpan,
  message = "No se encontraron registros",
}) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan}>
        <div className="flex flex-col items-center justify-center gap-2 py-10">
          <span className="text-gray-400 dark:text-gray-600">
            <Info size={30} strokeWidth={1} />
          </span>
          <p className="text-theme-md text-gray-500 dark:text-gray-400">
            {message}
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
};

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableLoading,
  TableEmpty,
};

