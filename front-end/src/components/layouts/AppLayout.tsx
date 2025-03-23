import { Outlet } from "react-router-dom";
import Nav from "../app/Nav";

export default function AppLayout() {
  return (
    <>
      <header>
        <Nav />
      </header>
      <main className="md:w-11/12 lg:w-4/5 xl:w-2/3 mx-auto px-4">
        <Outlet />
      </main>
    </>
  );
}
