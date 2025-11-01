import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import GestorLibros from "./components/GestorLibros";
import Login from "./components/Login";
import Register from "./components/Register";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GestorLibros />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/libros" element={<GestorLibros />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
