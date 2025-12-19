import { db } from "./database.js";

const session = JSON.parse(localStorage.getItem("current_session"));

// Manejo del formulario de login
document.getElementById("login-form")?.addEventListener("submit", (e) => {
  e.preventDefaul();

  const email = document.getElementById("correo").value;
  const pass = document.getElementById("passw").value;
  const user = db
    .getUsers()
    .find((u) => u.email === email && db.decrypt(u.pss) === pass);

  if (user) {
    localStorage.setItem("current_session", JSON.stringify(user));
    window.location.href =
      user.rol === "administrador" ? "admin.html" : "perfil.html";
  } else {
    alert("Credenciales Invalidas");
  }
});

// Manejo del formulario registro
document.getElementById("register-form")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("correo").value;
  if (db.getUsers().some((u) => u.email === email))
    return alert("El correo ya extiste");

  const newUser = {
    id: Date.now.toString(),
    nombre: document.getElementById("nombre").value,
    apellido: document.getElementById("apellido").value,
    email: email,
    pass: db.encrypt(document.getElementById("passw").value),
    rol: "usuario",
  };
  db.saveUsers([...db.getUsers(), newUser]);
  alert("Su registro ha sido exitoso");
  window.location.href = "index.html";
});

// Manejo del formulario del perfil
if (document.getElementById("profile-form")) {
  document.getElementById("p-nombre").value = session.nombre;
  document.getElementById("p-apellido").value = session.apellido;
  document.getElementById("p-correo").value = session.email;

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
  const renderTable = () => {
    const users = db.getUsers();
    table.innerHTML = users
      .map(
        (u) => `
                <tr class ="border-b">
                <td class="p-3">${nombre} ${u.apellido}</td>
                <td class="p-3">${u.email}</td>
                <td class="p-3 font-bold text-xs">${u.rol.toUpperCase()}</td>
                <td class="p-3 text-center">
                <button onclick="window.edit('${
                  u.id
                }')" class="text-blue-600 mr-2">Editar</button>
                    <button onclick="window.del('${
                      u.id
                    }')" class="text-red-600">Eliminar</button>
                    </td>
                    </tr>
                
                `
      )
      .join("");
  };

  window.del = (id) => {
    if (id === session.id) return alert("No Puedes eliminarte a ti mismo");
    if (confirm("¿Eliminar Usuario?")) {
      db.saveUsers(db.getUsers().filter((u) => u.id !== id));
      renderTable();
    }
  };

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

  document.getElementById("admin-add-user").onclick = () => {
    const email = prompt("Email del nuevo usuario:");
    if (email && !db.getUsers().some((u) => u.email === email)) {
      const newUser = {
        id: Date.now().toString(),
        nombre: "Nuevo",
        apellido: "Usuario",
        email,
        pass: db.encrypt("123456"),
        roles: "usuario",
      };
    }
  };

  renderTable();
}
