import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { jwtDecode } from "jwt-decode";



interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
  userRole: string | null;
  userName: string | null;
  userIdentity: string | null;
  permissions: string[];
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userIdentity, setUserIdentity] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);

  const decodeAndSetUser = (token: string) => {
    try {
      const decoded = jwtDecode<any>(token);
      
      const allAuthorities: string[] = [];
      
      if (Array.isArray(decoded.authorities)) {
         allAuthorities.push(...decoded.authorities.map((a: any) => typeof a === 'string' ? a : a.authority));
      } else if (Array.isArray(decoded.roles)) {
          allAuthorities.push(...decoded.roles);
      } else {
          console.warn("No 'authorities' or 'roles' found in token");
      }
      
      const role = allAuthorities.find(auth => auth.startsWith('ROLE_')) || null;
      const perms = allAuthorities.filter(auth => !auth.startsWith('ROLE_'));

      const extractedName = decoded.name || decoded.fullName || "Usuario";
      const extractedIdentity = decoded.sub || ""; 

      setUserRole(role);
      setUserName(extractedName);
      setUserIdentity(extractedIdentity);
      setPermissions(perms);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to decode token", error);
      logout();
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      const token = localStorage.getItem("accessToken");
      
      if (isAuth && token) {
        decodeAndSetUser(token);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = (token: string) => {
    decodeAndSetUser(token);
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName(null);
    setUserIdentity(null);
    setPermissions([]);
  };

  const hasPermission = (permission: string) => {
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading, userRole, userName, userIdentity, permissions, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
