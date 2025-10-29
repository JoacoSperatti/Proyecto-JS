let tareas = [];

async function cargarTareasPrecargadas() {
  try {
    const respuesta = await fetch("/db/tareasPrecargadas.json");
    if (!respuesta.ok) throw new Error("No se pudieron cargar las tareas");

    const data = await respuesta.json();
    const tareasStorage = obtenerTareasStorage();

    tareas = tareasStorage.length ? tareasStorage : data;
    guardarTareasStorage(tareas);
  } catch (error) {
    mostrarMensaje("Error al cargar datos", "error");
    console.error(error);
  } finally {
    mostrarTareas();
  }
}

function mostrarTareas() {
  const container = document.getElementById("tareasContainer");
  container.innerHTML = "";

  for (const tarea of tareas) {
    crearTareaDOM(tarea, container);
  }

  document
    .querySelectorAll(".btn-borrar")
    .forEach((btn) =>
      btn.addEventListener("click", (e) =>
        eliminarTarea(parseInt(e.target.dataset.id))
      )
    );

  document
    .querySelectorAll(".btn-estado")
    .forEach((btn) =>
      btn.addEventListener("click", (e) =>
        cambiarEstado(parseInt(e.target.dataset.id))
      )
    );

  document
    .querySelectorAll(".btn-editar")
    .forEach((btn) =>
      btn.addEventListener("click", (e) =>
        editarTarea(parseInt(e.target.dataset.id))
      )
    );
}

function agregarTarea() {
  const titulo = document.getElementById("tituloTarea").value.trim();
  const descripcion = document.getElementById("descripcionTarea").value.trim();
  const fecha = document.getElementById("fechaTarea").value;
  const categoria = document.getElementById("categoriaTarea").value;

  if (!titulo || !descripcion || !fecha || !categoria) {
    mostrarMensaje("Completá todos los campos", "error");
    return;
  }

  const nuevaTarea = {
    id: Date.now(),
    titulo,
    descripcion,
    fecha,
    categoria,
    estado: "pendiente",
  };

  tareas.push(nuevaTarea);
  guardarTareasStorage(tareas);
  mostrarTareas();
  mostrarMensaje("Tarea agregada correctamente", "success");

  document.getElementById("tituloTarea").value = "";
  document.getElementById("descripcionTarea").value = "";
  document.getElementById("fechaTarea").value = "";
  document.getElementById("categoriaTarea").value = "";
}

function eliminarTarea(id) {
  tareas = tareas.filter((t) => t.id !== id);
  guardarTareasStorage(tareas);
  mostrarTareas();
  mostrarMensaje("Tarea eliminada", "info");
}

function cambiarEstado(id) {
  const tarea = tareas.find((t) => t.id === id);
  tarea.estado = tarea.estado === "pendiente" ? "realizada" : "pendiente";
  guardarTareasStorage(tareas);
  mostrarTareas();
  mostrarMensaje("Estado actualizado", "success");
}

function editarTarea(id) {
  const tarea = tareas.find((t) => t.id === id);

  Swal.fire({
    title: "Editar tarea",
    html: `
      <input id="editTitulo" class="swal2-input" value="${tarea.titulo}">
      <input id="editDesc" class="swal2-input" value="${tarea.descripcion}">
      <input id="editFecha" class="swal2-input" type="date" value="${tarea.fecha}">
      <input id="editFecha" class="swal2-input" type="value" value="${tarea.categoria}">
    `,
    confirmButtonText: "Guardar cambios",
    showCancelButton: true,
  }).then((res) => {
    if (res.isConfirmed) {
      tarea.titulo = document.getElementById("editTitulo").value;
      tarea.descripcion = document.getElementById("editDesc").value;
      tarea.fecha = document.getElementById("editFecha").value;
      guardarTareasStorage(tareas);
      mostrarTareas();
      mostrarMensaje("Tarea editada", "success");
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await cargarTareasPrecargadas();
  document
    .getElementById("agregarTareaBtn")
    .addEventListener("click", agregarTarea);
});
