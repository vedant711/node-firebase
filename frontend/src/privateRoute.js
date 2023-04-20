import { useState,useEffect,useContext } from 'react'
import AuthContext from "./context/AuthContext";
// import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Route, Routes,Navigate,Outlet } from 'react-router-dom';


const PrivateRoute = ({ children, ...rest }) => {
  let { user } = useContext(AuthContext);
//   return <Route {...rest}>{!user ? <Navigate to="/login" /> : children}</Route>;
    return !user ? <Navigate to='/'/>:<Outlet/>
};

export default PrivateRoute;