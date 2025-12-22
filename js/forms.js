/**
 * @file Módulo de gestión de usuarios y autenticación.
 * Maneja el flujo de login, registro, perfil y administración CRUD.
 */

import { db } from "./database.js";

/** @type {Object|null} Sesión del usuario actual almacenada en el navegador. */
const session = JSON.parse(localStorage.getItem("current_session"));

/**
 * Procesa el inicio de sesión del usuario.
 * Valida credenciales contra la base de datos y gestiona la redirección por roles.
 */
document.getElementById("login-form")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("correo").value;
  const pass = document.getElementById("passw").value;
  const user = db.getUsers().find((u) => {
    if (u.email !== email) return false;
    try {
      return db.decrypt(u.passw) === pass;
    } catch {
      return u.passw === pass; // Fallback si no está encriptada
    }
  });

  if (user) {
    localStorage.setItem("current_session", JSON.stringify(user));
    window.location.href =
      user.rol === "administrador" ? "page/admin.html" : "page/perfil.html";
  } else {
    alert("Credenciales Invalidas");
    document.getElementById("login-form").reset();
  }
});

/**
 * Registra un nuevo usuario en el sistema.
 * Verifica duplicidad de correo y asigna rol de "usuario" por defecto.
 */
document.getElementById("register-form")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("correo").value;
  if (db.getUsers().some((u) => u.email === email))
    return alert("El correo ya extiste");
  

  const newUser = {
    id: Date.now().toString(),
    nombre: document.getElementById("nombre").value,
    apellido: document.getElementById("apellido").value,
    email: email,
    passw: db.encrypt(document.getElementById("passw").value),
    rol: "usuario",
  };
  db.saveUsers([...db.getUsers(), newUser]);
  alert("Su registro ha sido exitoso");
  window.location.href = "/index.html";
});

/**
 * Inicializa y gestiona la actualización de datos del perfil de usuario.
 */
if (document.getElementById("profile-form")) {
  document.getElementById("p-nombre").value = session.nombre;
  document.getElementById("p-apellido").value = session.apellido;
  document.getElementById("p-correo").value = session.email;

  /**
   * Event listener para el formulario de perfil.
   * Actualiza la información del usuario en la base de datos y localStorage.
   */
  document.getElementById("profile-form").onsubmit = (e) => {
    e.preventDefault();
    const users = db.getUsers();
    const index = users.findIndex((u) => u.id === session.id);

    users[index].nombre = document.getElementById("p-nombre").value;
    users[index].apellido = document.getElementById("p-apellido").value;
    users[index].email = document.getElementById("p-correo").value;

    db.saveUsers(users);
    localStorage.setItem("current_session", JSON.stringify(users[index]));
    alert("Perfil Actualizado con exito");
  };
}

// ---CRUD ADMIN---

const table = document.getElementById("user-list-table");
if (table) {
  /**
   * Genera el HTML de la tabla de usuarios y lo inserta en el DOM.
   */
  const renderTable = () => {
    const users = db.getUsers();
    table.innerHTML = users
      .map(
        (u) => `
                <tr class ="border-b">
                <td class="p-3">${u.nombre} ${u.apellido}</td>
                <td class="p-3">${u.email}</td>
                <td class="p-3 font-bold text-xs">${u.rol.toUpperCase()}</td>
                <td class="p-3 text-center">
                <button onclick="window.edit('${
                  u.id
                }')" class="text-blue-600 mr-2 cursor-pointer">Editar</button>
                    <button onclick="window.del('${
                      u.id
                    }')" class="text-red-600 cursor-pointer">Eliminar</button>
                    </td>
                    </tr>
                
                `
      )
      .join("");
  };

  /**
   * Elimina un usuario del sistema por su ID.
   * @param {string} id - Identificador único del usuario.
   */
  window.del = (id) => {
    if (id === session.id) return alert("No Puedes eliminarte a ti mismo");
    if (confirm("¿Eliminar Usuario?")) {
      db.saveUsers(db.getUsers().filter((u) => u.id !== id));
      renderTable();
    }
  };

  /**
   * Permite editar el nombre de un usuario mediante un prompt.
   * @param {string} id - Identificador único del usuario.
   */
  window.edit = (id) => {
    const users = db.getUsers();
    const index = users.findIndex((u) => u.id === id);
    const nuevoNombre = prompt("Nuevo nombre: ", users[index].nombre);
    if (nuevoNombre) {
      users[index].nombre = nuevoNombre;
      db.saveUsers(users);
      renderTable();
    }
  };

  /**
   * Event listener para el botón de agregar usuario en el panel administrativo.
   * Crea un nuevo usuario con email proporcionado y contraseña por defecto.
   */
  document.getElementById("admin-add-user").onclick = () => {
    const email = prompt("Email del nuevo usuario:");
    if (email && !db.getUsers().some((u) => u.email === email)) {
      const newUser = {
        id: Date.now().toString(),
        nombre: "Nuevo",
        apellido: "Usuario",
        email,
        passw: db.encrypt("123456"),
        rol: "usuario",
      };
      db.saveUsers([...db.getUsers(), newUser]);
      renderTable();
    }
  };

  renderTable();
}
