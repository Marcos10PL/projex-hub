import { Outlet } from "react-router-dom";
import Nav from "../Nav";

export default function AppLayout() {
  return(
    <>
      <header>
        <Nav />
      </header>
      <main className="max-w-sm mx-auto px-4">
        <Outlet />
      </main>
    </>
  )
}