import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppDispatch, RootState } from "./state/store";
import Footer from "./components/Footer";
import AuthLayout from "./layouts/AuthLayout";
import { useEffect, useRef } from "react";
import { checkAuth } from "./state/current-user/currentUserSlice";
import ConfirmMail from "./pages/ConfirmEmail";
import Spinner from "./components/Spinner";
import ResetPassword from "./pages/auth/ResetPassword";
import RegistrationForm from "./pages/auth/RegistrationForm";
import ForgotPassword from ".//pages/auth/ForgotPassword";
import LoginForm from ".//pages/auth/LoginForm";
import AppLayout from "./layouts/AppLayout";
import HomeLayout from "./layouts/HomeLyout";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Profile from "./pages/app/Profile";
import Home from "./pages/app/Home";
import ProjectDetails from "./pages/app/Projects/Project/ProjectDetails";
import Projects from "./pages/app/Projects/Projects";
import UpdateProject from "./pages/app/Projects/Project/UpdateProject";
import ErrorMsg from "./components/ErrorMsg";
import CreateProject from "./pages/app/Projects/Project/CreateProject";

export default function App() {
  const { isAuthenticated, loading, error, currentUser } = useSelector(
    (state: RootState) => state.currentUser
  );

  // Reload page if username changes
  const prevUsername = useRef(currentUser?.username);
  const username = currentUser?.username;
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/profile") return;
    if (prevUsername.current && prevUsername.current !== username)
      window.location.reload();
    prevUsername.current = username;
  }, [username, location.pathname]);

  const dispatch = useDispatch<AppDispatch>();

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated && loading) dispatch(checkAuth());
  }, [dispatch, isAuthenticated, loading]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size={8} />
      </div>
    );

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
                </Route>
                <Route path="create" element={<CreateProject />} />
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

      <ErrorMsg message={error} />

      <Footer />
    </>
  );
}
