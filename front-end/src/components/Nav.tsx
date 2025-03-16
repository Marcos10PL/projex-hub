import { NavLink, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faProjectDiagram,
  faCircleUser,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

const navLinks = [
  { title: "Home", path: "/", icon: faHome },
  { title: "Projects", path: "/projects", icon: faProjectDiagram },
  { title: "Profile", path: "/profile", icon: faCircleUser },
  { title: "Logout", path: "/logout", icon: faRightFromBracket },
] as const;

export default function Nav() {
  const location = useLocation();

  return (
    <nav className="flex flex-col md:flex-row justify-evenly items-center py-4 px-8 text-sm">
      <div className="text-2xl md:text-3xl pb-2">
        <Logo />
      </div>
      <ul className="flex justify-center absolute md:static bottom-0 py-2 bg-slate-900 md:bg-transparent w-full md:w-fit border-t-2 md:border-0 border-slate-800">
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
            <span className="">{link.title}</span>
          </NavLink>
        ))}
      </ul>
    </nav>
  );
}
