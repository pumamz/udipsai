import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

import {
  Calendar,
  ChevronDown,
  LayoutGrid,
  MoreHorizontal,
  PieChart,
  Building2,
  Users,
  MapPin,
  Gamepad2,
  ClipboardList,
  UploadCloud,
} from "lucide-react";

import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    requiredPermission?: string;
  }[];
  requiredPermission?: string;
};

const navItems: NavItem[] = [
  {
    icon: <LayoutGrid size={20} />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <Users size={20} />,
    name: "Pacientes",
    path: "/pacientes",
    requiredPermission: "PERM_PACIENTES",
  },
  {
    name: "Fichas",
    icon: <ClipboardList size={20} />,
    path: "/fichas",
    requiredPermission: "PERM_PACIENTES",
  },
  {
    name: "Especialistas",
    icon: <Users size={20} />,
    path: "/especialistas",
    requiredPermission: "PERM_ESPECIALISTAS",
  },
  {
    name: "Pasantes",
    icon: <Users size={20} />,
    path: "/pasantes",
    requiredPermission: "PERM_PASANTES",
  },
  {
    icon: <Building2 size={20} />,
    name: "Instituciones",
    path: "/instituciones",
    requiredPermission: "PERM_INSTITUCIONES_EDUCATIVAS",
  },
  {
    name: "Sedes",
    icon: <MapPin size={20} />,
    path: "/sedes",
    requiredPermission: "PERM_SEDES",
  },
  {
    name: "Especialidades",
    icon: <ClipboardList size={20} />,
    path: "/especialidades",
    requiredPermission: "PERM_ESPECIALIDADES",
  },
  {
    icon: <Calendar size={20} />,
    name: "Citas",
    subItems: [
      { name: "Agendamiento", path: "/citas", pro: false },
      { name: "Reportes", path: "/reportes-citas", pro: false },
    ],
  },

  {
    name: "Juegos",
    icon: <Gamepad2 size={20} />,
    path: "/juegos",
    requiredPermission: "PERM_RECURSOS",
  },
  {
    name: "Tests",
    icon: <ClipboardList size={20} />,
    // path: "/tests",  // Removed path as it now has subItems
    subItems: [
      { name: "WAIS", path: "/fichas/wais", pro: false }, // Using /fichas/wais as planned
    ],
    requiredPermission: "PERM_RECURSOS",
  },
  {
    name: "Subir Recursos",
    icon: <UploadCloud size={20} />,
    path: "/subir-recursos",
    requiredPermission: "PERM_RECURSOS",
  },
];

const othersItems: NavItem[] = [
  {
    icon: <PieChart size={20} />,
    name: "Reportes",
    subItems: [
      { name: "Fichas", path: "/reportes-fichas", pro: false },
      { name: "Cambios", path: "/reportes-cambios", pro: false },
      { name: "Citas", path: "/reportes-citas", pro: false },
    ],
    requiredPermission: "PERM_PACIENTES",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { permissions } = useAuth();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const filterItems = (items: NavItem[]) => {
    return items
      .filter((item) => {
        if (!item.requiredPermission) return true;
        return permissions.includes(item.requiredPermission);
      })
      .map((item) => {
        if (item.subItems) {
          const filteredSubItems = item.subItems.filter((subItem) => {
            if (!subItem.requiredPermission) return true;
            return permissions.includes(subItem.requiredPermission);
          });
          return { ...item, subItems: filteredSubItems };
        }
        return item;
      })
      .filter((item) => {
        if (item.subItems && item.subItems.length === 0 && !item.path)
          return false;
        return true;
      });
  };

  const filteredNavItems = useMemo(
    () => filterItems(navItems),
    [permissions]
  );
  const filteredOthersItems = useMemo(
    () => filterItems(othersItems),
    [permissions]
  );

  useEffect(() => {
  }, [permissions, filteredNavItems]);

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items =
        menuType === "main" ? filteredNavItems : filteredOthersItems;
      items.forEach((nav: NavItem, index: number) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem: any) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location.pathname, filteredNavItems, filteredOthersItems, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDown
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500 dark:text-gray-200"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/" className="flex justify-center items-center w-full">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo.png"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block opacity-75 transition-opacity hover:opacity-100"
                src="/images/logo/logo-dark.png"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.png"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <MoreHorizontal className="size-6" />
                )}
              </h2>
              {renderMenuItems(filteredNavItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
