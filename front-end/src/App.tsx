import { useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { RootState } from "./state/store";
import LoginForm from "./components/auth/LoginForm";
import RegistrationForm from "./components/auth/RegistrationForm";
import Footer from "./components/Footer";
import AuthLayout from "./components/layouts/AuthLayout";
import PrivacyPolicy from "./components/PrivacyPolicy";
import ForgotPassword from "./components/auth/ForgotPassword";

export default function App() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.currentUser.isAuthenticated
  );

  return (
    <>
      <Routes>
        <Route
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <AuthLayout />
          }
        >
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        <Route
          element={
            isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
          }
        >
          <Route path="/" element={<div>Home</div>} />
          <Route path="/projects" element={<div>Projects</div>} />
          <Route path="*" element={<div>404</div>} />
        </Route>
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>

      <Footer />
    </>
  );
}
