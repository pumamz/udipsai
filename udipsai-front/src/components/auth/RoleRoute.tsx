import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";

interface RoleRouteProps {
  allowedRoles: string[];
}

export default function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse text-lg">
          Verificando permisos...
        </p>
      </div>
    );
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
