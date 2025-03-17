import { Outlet } from "react-router-dom";
import Logo from "../Logo";

export default function HomeLayout() {
  return (
    <>
      <header className="text-center my-8 text-4xl">
        <Logo />
      </header>
      <main className="md:w-2/3 mx-auto px-4">
        <Outlet />
      </main>
    </>
  );
}