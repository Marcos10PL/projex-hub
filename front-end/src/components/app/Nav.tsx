import { NavLink, useLocation } from "react-router-dom";
import Logo from "../Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faProjectDiagram,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import Logout from "../auth/Logout";

const navLinks = [
  { title: "Home", path: "/", icon: faHome },
  { title: "Projects", path: "/projects", icon: faProjectDiagram },
  { title: "Profile", path: "/profile", icon: faCircleUser },
] as const;

export default function Nav() {
  const location = useLocation();

  return (
    <nav className="flex flex-col md:flex-row justify-evenly items-center py-4 px-8 text-sm">
      <div className="text-3xl pb-2">
        <Logo />
      </div>
      <div className="flex justify-center fixed z-50 md:static bottom-0 py-2 bg-slate-900 md:bg-transparent w-full md:w-fit border-t-2 md:border-0 border-slate-800">
        {navLinks.map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            className={clsx(
              "flex flex-col items-center px-5",
              location.pathname === link.path
                ? "text-text pointer-events-none"
                : "link"
            )}
          >
            <FontAwesomeIcon
              icon={link.icon}
              className="text-2xl md:text-3xl"
            />
            <span>{link.title}</span>
          </NavLink>
        ))}
        <Logout />
      </div>
    </nav>
  );
}
