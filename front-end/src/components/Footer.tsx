import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="opacity-70 text-center py-5 mb-20 md:mb-0">
      <div className="flex justify-center items-center gap-1">
        &copy; {new Date().getFullYear()} | <Logo />| All rights reserved
      </div>
    </footer>
  );
}
