import { Link } from "react-router";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  pageTitle: string;
  items?: BreadcrumbItem[];
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle, items }) => {
  const defaultItems = [
    { label: "Inicio", path: "/" },
    { label: pageTitle },
  ];

  const breadcrumbItems = items || defaultItems;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
      <h2 className="ml-8 text-xl font-bold text-gray-800 dark:text-white/90">
        {pageTitle}
      </h2>
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 mr-8">
          {breadcrumbItems.map((item, index) => {
            const isFirst = index === 0;

            return (
              <li key={index} className="flex items-center">
                {!isFirst && (
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                )}

                {item.path ? (
                  <Link
                    to={item.path}
                    className={`inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors duration-200 ${
                      isFirst ? "hover:text-brand-200" : ""
                    }`}
                  >
                    {isFirst && (item.label === "Home" || item.label === "Inicio") && (
                      <Home className="w-4 h-4 mb-0.5" />
                    )}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
