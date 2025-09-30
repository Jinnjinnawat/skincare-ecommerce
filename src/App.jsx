import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import Listproduct from "./page/Listproduct";
import NavbarComponent from "./components/Navbar";
import Login from "./page/Login";
import User from "./page/User";
import TBproduct from "./page/TBProduct";
import AddProductForm from "./components/FromAddproduct";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/products/new" element={<AddProductForm />} />
           <Route path="/TBproduct" element={<TBproduct/>} />
          <Route path="/User" element={<User />} />
          <Route path="/home" element={<Home />} />
          <Route path="/Listproduct" element={<Listproduct />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
