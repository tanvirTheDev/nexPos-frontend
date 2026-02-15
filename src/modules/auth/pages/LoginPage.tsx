import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@store/index";
import { LoginForm } from "../components/LoginForm";

export const LoginPage = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">NexaPos</h1>
          <p className="text-muted-foreground">
            Multi-tenant Point of Sale System
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};
