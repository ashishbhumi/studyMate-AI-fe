import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routes";
import Login from "../feature/auth/components/login/Login";
import Signup from "../feature/auth/components/signup/Signup";
import ForgotPassword from "../feature/auth/components/forgot-password/ForgotPassword";
import Dashboard from "../feature/dashboard/components/Dashboard";

const RouteIndex = () => {
  return (
    <Routes>
      <Route path={ROUTES.AUTH.LOGIN} element={<Login />} />
      <Route path={ROUTES.AUTH.SIGNUP} element={<Signup />} />
      <Route path={ROUTES.AUTH.FORGOT_PASSWORD} element={<ForgotPassword />} />
      <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
      <Route
        path={ROUTES.HOME}
        element={<Navigate to={ROUTES.AUTH.LOGIN} replace />}
      />
      <Route path="*" element={<Navigate to={ROUTES.AUTH.LOGIN} replace />} />
    </Routes>
  );
};

export default RouteIndex;
