import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Create =() => {
    const { registerUser,serverResponse } = useContext(AuthContext);
    const handleSubmit = e => {
        e.preventDefault();
        const name = e.target.name.value;
        const password = e.target.password.value;
        const email = e.target.email.value;
        // const mobile = e.target.mobile.value;

        name.length > 0 && registerUser(email, password, name);
      };
    return(
        <form onSubmit={handleSubmit} className="container">
          {serverResponse!==''?<p>{serverResponse}</p>:null}
        <h1>Create </h1>
        <hr />
        {/* <label htmlFor="name">Username</label> */}
        <input type="text" id="name" placeholder="Enter Username" />
        {/* <label htmlFor="password">Password</label> */}
        <input type="password" id="password" placeholder="Enter Password" />
        {/* <label htmlFor="balance">Balance</label> */}
        <input type="email" id="email" placeholder="Enter your Email" />

        {/* <label htmlFor="pin">PIN</label> */}
        {/* <input type="text" id="mobile" placeholder="Enter your Mobile Number" /> */}


        <button type="submit">Create</button>
        <a href="/">Already Have an Account</a>
      </form>
    );
}

export default Create;