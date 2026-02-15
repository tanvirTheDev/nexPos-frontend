import { useSelector } from "react-redux";
import { RootState } from "@store/index";

export const useAuth = () => {
  const { user, token, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.role === "SuperAdmin") return true;
    if (user.role === "OrgAdmin") return true;
    return user.permissions?.includes(permission) || false;
  };

  const hasRole = (...roles: string[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return {
    user,
    token,
    isAuthenticated,
    hasPermission,
    hasRole,
    isSuperAdmin: user?.role === "SuperAdmin",
    isOrgAdmin: user?.role === "OrgAdmin",
    isAdmin: user?.role === "Admin",
  };
};
