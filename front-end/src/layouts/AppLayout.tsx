import { Outlet, useLocation } from "react-router-dom";
import Nav from "../components/app/Nav";
import ButtonBack from "../components/app/Projects/ButtonBack";

export default function AppLayout() {
  const path = useLocation().pathname.split("/");
  
  return (
    <>
      <header>
        <Nav />
      </header>
      <main className="md:w-11/12 lg:w-4/5 xl:w-2/3 mx-auto px-4 md:text-lg">
        {path[1] === "projects" && path[2] ? (
          <section className="space-y-5">
            {!path[3] ? <ButtonBack path="/projects" /> : <ButtonBack />}
            <Outlet />
          </section>
        ) : (
          <Outlet />
        )}
      </main>
    </>
  );
}
