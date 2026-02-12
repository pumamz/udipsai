import { useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useAuth } from "../../context/AuthContext";
import { ThemeToggleButton } from "../common/ThemeToggleButton";
import { User, Shield } from "lucide-react";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { userName, userIdentity, userRole, logout } = useAuth();

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const formattedRole = userRole?.replace("ROLE_", "") || "USUARIO";
  const isEspecialista = userRole === "ROLE_ESPECIALISTA";

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 text-gray-700 dropdown-toggle dark:text-gray-400 group"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-gray-800 dark:text-white">
            {userName}
          </span>
          <span className="block text-xs font-medium text-gray-500 dark:text-gray-400">
            {formattedRole}
          </span>
        </span>
        
        <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${isEspecialista ? 'border-brand-100 bg-brand-50 text-brand-600 dark:border-gray-800 dark:bg-gray-600 dark:text-brand-300'  : 'border-blue-light-100 bg-blue-light-50 text-blue-light-600 dark:border-gray-800 dark:bg-gray-600 dark:text-blue-light-300'}`}>
          <span className="text-lg font-bold">
            {userName?.charAt(0).toUpperCase()}
          </span>
        </div>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 group-hover:stroke-gray-700 dark:group-hover:stroke-gray-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-3 flex items-center justify-between">
           <div>
              <span className="block font-medium text-gray-900 text-theme-sm dark:text-white">
                {userName}
              </span>
              <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]" title={userIdentity || ""}>
                {userIdentity}
              </span>
           </div>
           <ThemeToggleButton />
        </div>

        <div className="px-3 pb-3">
             <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                isEspecialista 
                  ? "text-brand-600 dark:text-brand-300" 
                  : "text-blue-light-600 dark:text-blue-light-300"
             }`}>
                {isEspecialista ? <Shield className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                {formattedRole}
             </span>
        </div>

        <ul className="flex flex-col gap-1 border-t border-gray-100 dark:border-gray-800 pt-2">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <User className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
              Mi Perfil
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={() => {
                  closeDropdown();
                  logout();
              }}
              to="#"
              className="flex items-center gap-3 px-3 py-2 mt-1 font-medium rounded-lg group text-theme-sm hover:bg-red-50 hover:text-red-700 dark:text-gray-400 dark:hover:bg-gray-500/10 dark:hover:text-red-400"
            >
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                 <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
                />
              </svg>
              Cerrar Sesión
            </DropdownItem>
          </li>
        </ul>
      </Dropdown>
    </div>
  );
}
