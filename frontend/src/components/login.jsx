import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const handleSubmit = e => {
    e.preventDefault();
    const name = e.target.email.value;
    const password = e.target.password.value;
    name.length > 0 && loginUser(name, password);
  };

  return (
    // <section>

      <form onSubmit={handleSubmit} className="container">
        <h1>Login </h1>
        <hr />
        {/* <label htmlFor="name">Username</label> */}
        <input type="email" id="email" placeholder="Enter Email" />
        {/* <label htmlFor="password">Password</label> */}
        <input type="password" id="password" placeholder="Enter Password" />
        <button type="submit">Login</button>
        <a href="/create">Register Yourself</a>
      </form>
    // </section>
  );
};

export default Login;