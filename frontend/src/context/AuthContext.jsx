import { useState,useEffect,createContext } from 'react'
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
      localStorage.getItem("authTokens")
        ? JSON.parse(localStorage.getItem("authTokens"))
        : null
    );
    const [user, setUser] = useState(() =>
      localStorage.getItem("authTokens")
        ? jwt_decode(localStorage.getItem("authTokens"))
        : null
    );
    const [loading, setLoading] = useState(true);

    const [serverResponse, setServerResponse] = useState('')
  
    const navigate = useNavigate();
  
    const loginUser = async (email, password) => {
        try {
      const response = await fetch("http://localhost:55355/login", { 
      method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email:email,
          password:password
        })
      });
    //   console.log(response)
      response.json().then((data)=>{
        // console.log(data)
        if (response.status === 200) {
            setAuthTokens(data.token);
            setUser(jwt_decode(data.token));
            localStorage.setItem("authTokens", JSON.stringify(data.token));
            navigate("/dashboard");
          } else {
            alert("Something went wrong!");
          }
    });
    // console.log(authTokens)
    // console.log(user)
} catch (err) {
    
}


    //   console.log(data)
    //   console.log(jwt_decode(data))
    // console.log(data)
      
    }
    const logoutUser = () => {
      setAuthTokens(null);
      setUser(null);
      localStorage.removeItem("authTokens");
      navigate("/");
    };

    const registerUser = async(email,password,name) => {
        await axios.post('http://localhost:55355/create',{'email':email,'password':password,'name':name}).then(res=>{
            console.log(res);
            if (res.status===200) navigate('/')
            else {
              setServerResponse(res.data)
              setTimeout(()=>setServerResponse(''),5000)
            }
        })
        
    }
    const contextData = {
        user,
        setUser,
        authTokens,
        setAuthTokens,
        registerUser,
        loginUser,
        logoutUser,
        serverResponse,
        setServerResponse,
      };
    
      useEffect(() => {
        if (authTokens) {
            // console.log(authTokens,user)
          setUser(jwt_decode(authTokens));
          let token = localStorage.getItem('authTokens')
          // console.log(token)
        }
        setLoading(false);
      }, [authTokens, loading]);

      return (
        <AuthContext.Provider value={contextData}>
          {loading ? null : children}
        </AuthContext.Provider>
      );
}