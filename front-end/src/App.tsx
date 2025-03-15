import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { AppDispatch, RootState } from "./state/store";
import LoginForm from "./components/auth/LoginForm";
import RegistrationForm from "./components/auth/RegistrationForm";
import Footer from "./components/Footer";
import AuthLayout from "./components/layouts/AuthLayout";
import PrivacyPolicy from "./components/PrivacyPolicy";
import ForgotPassword from "./components/auth/ForgotPassword";
import { useEffect } from "react";
import { checkAuth } from "./state/current-user/currentUserSlice";
import Logout from "./components/auth/Logout";
import ConfirmMail from "./components/auth/ConfirmEmail";
import Spinner from "./components/Spinner";
import ResetPassword from "./components/auth/ResetPassword";

export default function App() {
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.currentUser
  );

  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch, location]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size={8} />
      </div>
    );

  if (!loading)
    return (
      <>
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/confirm-email/:token" element={<ConfirmMail />} />
                <Route
                  path="/reset-password/:token"
                  element={<ResetPassword />}
                />
              </Route>
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route element={<Outlet />}>
                <Route path="/" element={<Logout />} />
                <Route path="/projects" element={<div>Projects</div>} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>

        <Footer />
      </>
    );
}
