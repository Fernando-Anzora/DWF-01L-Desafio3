import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080/api/v1/books";

export default function GestorLibros() {
  const [libros, setLibros] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [libroEditando, setLibroEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [anyo, setAnyo] = useState("");

  const navigate = useNavigate();

  // ✅ Validar token al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire("Sesión requerida", "Debes iniciar sesión primero", "warning");
      navigate("/login");
      return;
    }

    cargarLibros();
    
  }, []);

  // ✅ Cerrar sesión
  function cerrarSesion() {
    localStorage.clear();
    navigate("/login");
  }

  // ✅ Cargar libros
  async function cargarLibros() {
    try {
      const res = await fetch(API_URL, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (!res.ok) throw new Error("Error al obtener libros");
      const datos = await res.json();
      setLibros(datos.content || []);
    } catch (error) {
      Swal.fire("Error", "No se pudo conectar con la API.", "error");
    }
  }


  // ✅ Buscar libros
  async function buscarLibros() {
    if (!busqueda.trim()) return cargarLibros();
    try {
      const res = await fetch(`${API_URL}/search?title=${busqueda}`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      if (!res.ok) throw new Error("Error al buscar libros");
      const datos = await res.json();
      setLibros(datos);
    } catch (error) {
      Swal.fire("Error", "No se pudo buscar libros.", "error");
    }
  }

  // ✅ Nuevo libro
  function abrirNuevo() {
    setLibroEditando(null);
    setTitulo("");
    setAutor("");
    setAnyo("");
    setMostrarFormulario(true);
  }

  // ✅ Editar libro
  async function abrirEditar(id) {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      if (!res.ok) throw new Error("No encontrado");
      const libro = await res.json();
      setLibroEditando(libro.id);
      setTitulo(libro.title || "");
      setAutor(libro.author || "");
      setAnyo(libro.publicationYear || "");
      setMostrarFormulario(true);
    } catch (error) {
      Swal.fire("Error", "No se pudo cargar el libro para editar.", "error");
    }
  }

  // ✅ Eliminar libro
  async function eliminarLibro(id) {
    Swal.fire({
      title: "¿Eliminar libro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: { Authorization: "Bearer " + localStorage.getItem("token") },
          });
          if (!res.ok) throw new Error("Error al eliminar");
          await cargarLibros();
          Swal.fire("Eliminado", "El libro fue eliminado.", "success");
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar el libro.", "error");
        }
      }
    });
  }

  // ✅ Validar formulario
  function validarFormulario() {
    const anyoActual = new Date().getFullYear();
    if (!titulo.trim())
      return Swal.fire("Validación", "El título no puede estar vacío.", "warning");
    if (!autor.trim())
      return Swal.fire("Validación", "El autor no puede estar vacío.", "warning");
    if (isNaN(Number(anyo)) || anyo < 1000 || anyo > anyoActual)
      return Swal.fire("Validación", `El año debe estar entre 1000 y ${anyoActual}.`, "warning");
    return true;
  }

  // ✅ Guardar libro
  async function guardarLibro(e) {
    e.preventDefault();
    if (!validarFormulario()) return;

    const payload = {
      title: titulo.trim(),
      author: autor.trim(),
      publicationYear: anyo ? Number(anyo) : null,
    };

    try {
      let res;
      if (libroEditando) {
        res = await fetch(`${API_URL}/${libroEditando}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error("Error al guardar");
      Swal.fire("Éxito", libroEditando ? "Libro actualizado" : "Libro agregado", "success");
      setMostrarFormulario(false);
      cargarLibros();
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar el libro.", "error");
    }
  }

  // ✅ Renderizado
  return (
    <div className="p-6 font-sans min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Libros</h1>
        <button
          onClick={cerrarSesion}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </div>

      <div className=" gap-2 mb-4">
        <input
          className="border px-2 py-1 rounded w-1/3"
          value={busqueda}
          placeholder="Buscar por título"
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && buscarLibros()}
        />
        <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={buscarLibros}>
          Buscar
        </button>
        <button className="bg-green-500 text-white px-4 py-1 rounded" onClick={abrirNuevo}>
          Nuevo Libro
        </button>
      </div>

      {libros.length === 0 ? (
        <p>No hay libros registrados.</p>
      ) : (
        <table className="border-collapse w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2 text-left">Título</th>
              <th className="border px-4 py-2 text-left">Autor</th>
              <th className="border px-4 py-2 text-left">Año</th>
              <th className="border px-4 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {libros.map((libro) => (
              <tr key={libro.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{libro.title}</td>
                <td className="border px-4 py-2">{libro.author}</td>
                <td className="border px-4 py-2">{libro.publicationYear ?? ""}</td>
                <td className="border px-4 py-2 text-right">
                  <button
                    className="bg-yellow-400 text-white px-3 py-1 rounded mr-2"
                    onClick={() => abrirEditar(libro.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => eliminarLibro(libro.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <form
            onSubmit={guardarLibro}
            className="bg-white p-6 rounded-lg shadow-md w-96"
          >
            <h2 className="text-xl mb-4">
              {libroEditando ? "Editar libro" : "Nuevo libro"}
            </h2>
            <input
              className="border w-full mb-2 px-2 py-1 rounded"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título"
            />
            <input
              className="border w-full mb-2 px-2 py-1 rounded"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              placeholder="Autor"
            />
            <input
              className="border w-full mb-4 px-2 py-1 rounded"
              type="number"
              value={anyo}
              onChange={(e) => setAnyo(e.target.value)}
              placeholder="Año"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="bg-gray-400 text-white px-3 py-1 rounded"
                onClick={() => setMostrarFormulario(false)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
