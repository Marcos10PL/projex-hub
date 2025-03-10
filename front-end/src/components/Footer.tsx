import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="opacity-70 text-center py-5">
      <p className="flex justify-center items-center gap-1">
        &copy; 2025 | <Logo />| All rights reserved
      </p>
    </footer>
  );
}
