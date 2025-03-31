import { Outlet } from "react-router-dom";
import Logo from "../components/Logo";

export default function AuthLayout() {
  return (
    <>
      <header className="text-center my-8 text-4xl">
        <Logo />
      </header>
      <main className="max-w-sm mx-auto px-4">
        <Outlet />
      </main>
    </>
  );
}
