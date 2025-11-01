import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [nombre, setNombre] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: nombre,
          password: contrasena,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Credenciales incorrectas");
      }

      const data = await res.json();

      // Guardar datos en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("email", data.email);
      localStorage.setItem("role", data.role);
      localStorage.setItem("type", data.type);

      Swal.fire("Bienvenido", "Inicio de sesión exitoso", "success");
      navigate("/libros");
    } catch (error) {
      Swal.fire("Error", error.message || "No se pudo iniciar sesión", "error");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-lg w-80"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Iniciar sesión</h2>

        <input
          type="text"
          className="border w-full mb-3 px-3 py-2 rounded"
          placeholder="Nombre de usuario"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input
          type="password"
          className="border w-full mb-3 px-3 py-2 rounded"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Ingresar
        </button>

        <p className="mt-4 text-center text-sm">
          ¿No tienes cuenta?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Regístrate aquí
          </span>
        </p>
      </form>
    </div>
  );
}