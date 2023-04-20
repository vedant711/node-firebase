import logo from './logo.svg';
import './components/style.css';
import Login from './components/login';
import Create from './components/create';
import Home from './components/homepage';
// import Admin from './components/admin';
// import Header from './components/header';
import { useState,useEffect,useContext } from 'react'
import AuthContext from "./context/AuthContext";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Route, Routes,Navigate } from 'react-router-dom';
import PrivateRoute from './privateRoute';
// import New from './components/new';

function App() {
  return (
    <>
    <BrowserRouter>
    {/* <Header/> */}
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Login />}/>
          <Route path='/create' element={<Create />}/>
          <Route path='/dashboard' element={<PrivateRoute/>}>
            <Route path='/dashboard' element={<Home/>}/>
          </Route>
          {/* <Route path='/admin' element={<PrivateRoute/>}>
            <Route path='/admin' element={<Admin/>}/>
          </Route> */}
          {/* <Route path='/new' element={<PrivateRoute/>}>
            <Route path='/new' element={<New/>}/>
          </Route> */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    </>
  );
}

export default App;