import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { RootState } from "./state/store";
import LoginForm from "./components/auth/loginForm";
import RegistrationForm from "./components/auth/registrationForm";


export default function App() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.currentUser.isAuthenticated
  );

  console.log(isAuthenticated);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={!isAuthenticated ? <LoginForm /> : <div>HOME</div>}
        />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
      </Routes>
    </>
  );
}
