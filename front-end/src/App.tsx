import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppDispatch, RootState } from "./state/store";
import Footer from "./components/Footer";
import AuthLayout from "./components/layouts/AuthLayout";
import { useEffect } from "react";
import { checkAuth } from "./state/current-user/currentUserSlice";
import ConfirmMail from "./components/pages/ConfirmEmail";
import Spinner from "./components/Spinner";
import ResetPassword from "./components/pages/auth/ResetPassword";
import RegistrationForm from "./components/pages/auth/RegistrationForm";
import ForgotPassword from "./components/pages/auth/ForgotPassword";
import LoginForm from "./components/pages/auth/LoginForm";
import AppLayout from "./components/layouts/AppLayout";
import HomeLayout from "./components/layouts/HomeLyout";
import PrivacyPolicy from "./components/pages/PrivacyPolicy";
import Profile from "./components/pages/app/Profile";
import Home from "./components/pages/app/Home";
import ProjectDetails from "./components/pages/app/Project/ProjectDetails";
import Projects from "./components/pages/app/Projects";
import UpdateProject from "./components/pages/app/Project/UpdateProject";
import DeleteProject from "./components/pages/app/Project/DeleteProject";

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
                <Route
                  path="/reset-password/:token"
                  element={<ResetPassword />}
                />
              </Route>
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/projects">
                  <Route index element={<Projects />} />
                  <Route path=":id">
                    <Route index element={<ProjectDetails />} />
                    <Route path="update" element={<UpdateProject />} />
                    <Route path="delete" element={<DeleteProject />} />
                  </Route>
                  <Route path="create" element={<ProjectDetails />} />
                </Route>
                <Route path="/profile" element={<Profile />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}

          <Route element={<HomeLayout />}>
            <Route path="/confirm-email/:token" element={<ConfirmMail />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Route>
        </Routes>

        <Footer />
      </>
    );
}
