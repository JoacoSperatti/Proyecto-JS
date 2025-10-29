function crearTareaDOM(tarea, container) {
  const div = document.createElement("div");
  div.classList.add("tarea");
  if (tarea.estado === "realizada") div.classList.add("realizada");

  div.innerHTML = `
    <h3>${tarea.titulo}</h3>
    <p>${tarea.descripcion}</p>
    <p><strong>Categoría:</strong> ${tarea.categoria}</p>
    <p><strong>Fecha límite:</strong> ${tarea.fecha}</p>
    <button class="btn-estado" data-id="${tarea.id}">
      ${tarea.estado === "pendiente" ? "Marcar como realizada" : "Marcar como pendiente"}
    </button>
    <button class="btn-editar" data-id="${tarea.id}">Editar</button>
    <button class="btn-borrar" data-id="${tarea.id}">Borrar</button>
  `;
  container.appendChild(div);
}

function guardarTareasStorage(tareas) {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

function obtenerTareasStorage() {
  return JSON.parse(localStorage.getItem("tareas")) || [];
}

function mostrarMensaje(mensaje, tipo = "info") {
  const colores = {
    success: "#4CAF50",
    error: "#e74c3c",
    info: "#3498db"
  };
  Toastify({
    text: mensaje,
    duration: 2000,
    gravity: "top",
    position: "right",
    backgroundColor: colores[tipo] || "#333",
  }).showToast();
}