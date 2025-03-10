import { Link, NavLink } from "react-router-dom";

export default function RegistrationForm() {
  return (
    <>
      <form>
        <div className="mb-5">
          <input
            type="email"
            className="border-2 border-gray-500 rounded-lg outline-0 focus:border-2 focus:border-primary block w-full p-2.5 bg-gray-800"
            placeholder="Email..."
            // required
          />
        </div>
        <div className="mb-5">
          <input
            type="email"
            className="border-2 border-gray-500 rounded-lg outline-0 focus:border-2 focus:border-primary block w-full p-2.5 bg-gray-800"
            placeholder="Username..."
            // required
          />
        </div>
        <div className="mb-5">
          <input
            type="password"
            placeholder="Password..."
            className="border-2 border-gray-500 rounded-lg outline-0 focus:border-primary block w-full p-2.5 bg-gray-800"
            // required
          />
        </div>
        <div className="mb-5">
          <input
            type="password"
            placeholder="Repeat password..."
            className="border-2 border-gray-500 rounded-lg outline-0 focus:border-primary block w-full p-2.5 bg-gray-800"
            // required
          />
        </div>
        <button type="submit" className="button w-full">
          Register
        </button>
      </form>

      <div className="text-center my-3">
        By registering you acknowledge that you have read and accept the{" "}
        <Link to="/privacy-policy" className="link">
          privacy policy
        </Link>
        , which explains how your data will be used and protected. Your consent
        is voluntary, and you can withdraw it at any time by deleting an
        account.
      </div>

      <div className="my-3 flex flex-col items-center gap-2">
        <NavLink to="/login" className="link">
          Already have an account? Login now!
        </NavLink>
      </div>
    </>
  );
}
