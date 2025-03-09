export default function RegistrationForm() {
  return (
    <form className="form">
      <input type="email" id="email" />
      <label htmlFor="password">Password</label>
      <input type="password" id="password" />
      <button type="submit">Register</button>
    </form>
  );
}