import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routes";
import Login from "../feature/auth/components/login/Login";
import Signup from "../feature/auth/components/signup/Signup";
import ForgotPassword from "../feature/auth/components/forgot-password/ForgotPassword";
import Dashboard from "../feature/dashboard/components/Dashboard";
import FoldersList from "../feature/folders/components/FoldersList";
import NotesList from "../feature/notes/components/NotesList";
import NoteDetail from "../feature/notes/components/NoteDetail";
import TagsList from "../feature/tags/components/TagsList";
import Layout from "../feature/layout/Layout";

const RouteIndex = () => {
  return (
    <Routes>
      <Route path={ROUTES.AUTH.LOGIN} element={<Login />} />
      <Route path={ROUTES.AUTH.SIGNUP} element={<Signup />} />
      <Route path={ROUTES.AUTH.FORGOT_PASSWORD} element={<ForgotPassword />} />

      {/* Protected Routes with Layout */}
      <Route element={<Layout />}>
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.FOLDERS.LIST} element={<FoldersList />} />
        <Route path={ROUTES.NOTES.LIST} element={<NotesList />} />
        <Route path={ROUTES.NOTES.DETAIL} element={<NoteDetail />} />
        <Route path={ROUTES.TAGS.LIST} element={<TagsList />} />
      </Route>

      <Route
        path={ROUTES.HOME}
        element={<Navigate to={ROUTES.AUTH.LOGIN} replace />}
      />
      <Route path="*" element={<Navigate to={ROUTES.AUTH.LOGIN} replace />} />
    </Routes>
  );
};

export default RouteIndex;
