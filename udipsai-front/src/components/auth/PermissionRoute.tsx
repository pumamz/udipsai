import { useAuth } from "../../context/AuthContext";
import { Navigate, Outlet } from "react-router";

interface PermissionRouteProps {
  requiredPermission: string;
}

export default function PermissionRoute({
  requiredPermission,
}: PermissionRouteProps) {
  const { permissions, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!permissions.includes(requiredPermission)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
