// Variables y selectores
const API_URL = '/api/v1/books';
const tbodyLibros = document.getElementById('tbody-libros');
const mensajeVacio = document.getElementById('mensaje-vacio');

const inputBuscar = document.getElementById('input-buscar');
const btnBuscar = document.getElementById('btn-buscar');
const btnNuevo = document.getElementById('btn-nuevo');

const dialogLibro = document.getElementById('dialog-libro');
const formLibro = document.getElementById('form-libro');
const dialogTitulo = document.getElementById('dialog-titulo');

const campoId = document.getElementById('libro-id');
const campoTitulo = document.getElementById('libro-titulo');
const campoAutor = document.getElementById('libro-autor');
const campoAnyo = document.getElementById('libro-anyo');

// --- Funciones principales ---
async function cargarLibros() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Error al obtener libros');
        const datos = await res.json();
        mostrarLibros(datos.content); // adaptado a 'content'
    } catch (error) {
        console.error(error);
        mensajeVacio.innerText = 'No se pudieron cargar los libros.';
        Swal.fire('Error', 'No se pudo conectar con la API.', 'error');
    }
}

function mostrarLibros(libros) {
    tbodyLibros.innerHTML = '';
    if (!libros || libros.length === 0) {
        mensajeVacio.innerText = 'No hay libros registrados.';
        return;
    }
    mensajeVacio.innerText = '';

    libros.forEach(libro => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50';
        tr.innerHTML = `
      <td class="px-4 py-3">${escapeHtml(libro.title)}</td>
      <td class="px-4 py-3">${escapeHtml(libro.author)}</td>
      <td class="px-4 py-3">${libro.publicationYear ?? ''}</td>
      <td class="px-4 py-3 text-right">
        <button data-id="${libro.id}" class="editar-libro px-3 py-1 mr-2 rounded bg-yellow-400 text-white">Editar</button>
        <button data-id="${libro.id}" class="eliminar-libro px-3 py-1 rounded bg-red-500 text-white">Eliminar</button>
      </td>
    `;
        tbodyLibros.appendChild(tr);
    });

    document.querySelectorAll('.editar-libro').forEach(boton => {
        boton.addEventListener('click', async (e) => {
            const id = e.currentTarget.dataset.id;
            abrirEditar(id);
        });
    });

    document.querySelectorAll('.eliminar-libro').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            confirmarEliminar(id);
        });
    });
}

async function buscarLibros(titulo) {
    try {
        const url = API_URL + "/search?title="+titulo+"";
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error('Error al buscar libros');
        const datos = await res.json();
        mostrarLibros(datos);
    } catch (error) {
        console.log(error);
        Swal.fire('Error', 'No se pudo buscar libros.', 'error');
    }
}

function abrirNuevo() {
    campoId.value = '';
    campoTitulo.value = '';
    campoAutor.value = '';
    campoAnyo.value = '';
    dialogTitulo.innerText = 'Nuevo libro';
    if (typeof dialogLibro.showModal === 'function') dialogLibro.showModal();
    else alert('Tu navegador no soporta el elemento <dialog>.');
}

async function abrirEditar(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error('No encontrado');
        const libro = await res.json();
        campoId.value = libro.id;
        campoTitulo.value = libro.title || '';
        campoAutor.value = libro.author || '';
        campoAnyo.value = libro.publicationYear || '';
        dialogTitulo.innerText = 'Editar libro';
        dialogLibro.showModal();
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo cargar el libro para editar.', 'error');
    }
}

function validarFormulario() {
    const titulo = campoTitulo.value.trim();
    const autor = campoAutor.value.trim();
    const anyo = parseInt(campoAnyo.value, 10);
    const anyoActual = new Date().getFullYear();


    if (!titulo) {
        Swal.fire('Validación', 'El título no puede estar vacío.', 'warning');
        return false;
    }
    if (!autor) {
        Swal.fire('Validación', 'El autor no puede estar vacío.', 'warning');
        return false;
    }
    if (isNaN(anyo) || anyo < 1000 || anyo > anyoActual) {
        Swal.fire('Validación', `El año debe estar entre 1000 y ${anyoActual}.`, 'warning');
        return false;
    }
    return true;
}

formLibro.addEventListener('submit', async (e) => {
    e.preventDefault();
    dialogLibro.close();
    if (!validarFormulario()) return;

    const id = campoId.value.trim();
    const payload = {
        title: campoTitulo.value.trim(),
        author: campoAutor.value.trim(),
        publicationYear: campoAnyo.value ? Number(campoAnyo.value) : null
    };

    try {
        let res;
        if (id) {
            res = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        if (!res.ok) throw new Error('Error en la operación');
        await cargarLibros();
        dialogLibro.close();
        Swal.fire('Éxito', id ? 'Libro actualizado' : 'Libro agregado', 'success');
    } catch (error) {
        console.log(error);
        Swal.fire('Error', 'No se pudo guardar el libro.', 'error');
    }
});

function confirmarEliminar(id) {
    Swal.fire({
        title: '¿Eliminar libro?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                if (!res.ok) throw new Error('Error al eliminar');
                await cargarLibros();
                Swal.fire('Eliminado', 'El libro fue eliminado.', 'success');
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'No se pudo eliminar el libro.', 'error');
            }
        }
    });
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

btnNuevo.addEventListener('click', abrirNuevo);
btnBuscar.addEventListener('click', () => buscarLibros(inputBuscar.value.trim()));
inputBuscar.addEventListener('keydown', (e) => { if (e.key === 'Enter') buscarLibros(inputBuscar.value.trim()); });
document.getElementById('btn-cancelar').addEventListener('click', () => dialogLibro.close());

cargarLibros();
