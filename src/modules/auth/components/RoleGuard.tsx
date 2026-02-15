import { useSelector } from "react-redux";
import { RootState } from "@store/index";
import { Navigate } from "react-router-dom";

interface RoleGuardProps {
  children: React.ReactNode;
  roles: ("SuperAdmin" | "OrgAdmin" | "Admin")[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, roles }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
