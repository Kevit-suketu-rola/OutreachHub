import { useLocation } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import AdminLoginForm from "../components/auth/AdminLoginForm";

const Auth = () => {
  const location = useLocation();

  const renderForm = () => {
    if (location.pathname === "/login") return <LoginForm />;
    if (location.pathname === "/admin-login") return <AdminLoginForm />;
    return <LoginForm />;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-300 to-purple-600 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        {renderForm()}
      </div>
    </div>
  );
};

export default Auth;
