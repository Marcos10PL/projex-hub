import { NavLink } from "react-router-dom";

export default function ForgotPassword() {
  return (
    <>
      <form>
        <div className="mb-5">
          <input
            id="forgot-password-email"
            type="email"
            className="border-2 border-gray-500 rounded-lg outline-0 focus:border-2 focus:border-primary block w-full p-2.5 bg-gray-800"
            placeholder="Email..."
            required
          />
          <label
            htmlFor="forgot-password-email"
            className="py-2 block text-center"
          >
            Enter your email address and we will send you a link to reset your
            password.
          </label>
        </div>
      </form>

      <div className="my-3 flex flex-col items-center gap-2">
        <NavLink to="/login" className="link">
          Remember your password? Login now!
        </NavLink>
      </div>
      <div className="my-3 flex flex-col items-center gap-2">
        <NavLink to="/register" className="link">
          Don't have an account? Register now!
        </NavLink>
      </div>
    </>
  );
}
