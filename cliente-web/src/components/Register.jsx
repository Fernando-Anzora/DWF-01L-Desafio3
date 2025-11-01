import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: nombre,
          email: correo,
          password: contrasena,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al registrar usuario");
      }

      const res2 = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: nombre,
          password: contrasena,
        }),
      });

      const data = await res2.json();
      if (!res2.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al intentar ingresar al usuario");
      }

      // Guardar datos en localStorage automáticamente al crear cuenta
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("email", data.email);
      localStorage.setItem("role", data.role);
      localStorage.setItem("type", data.type);

      Swal.fire("Éxito", "Cuenta creada correctamente", "success");
      navigate("/libros");
    } catch (error) {
      Swal.fire("Error", error.message || "No se pudo registrar el usuario", "error");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded-lg shadow-lg w-80"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Crear cuenta</h2>

        <input
          type="text"
          className="border w-full mb-3 px-3 py-2 rounded"
          placeholder="Nombre de usuario"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input
          type="email"
          className="border w-full mb-3 px-3 py-2 rounded"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
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
          className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
        >
          Registrarse
        </button>

        <p className="mt-4 text-center text-sm">
          ¿Ya tienes cuenta?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Inicia sesión
          </span>
        </p>
      </form>
    </div>
  );
}