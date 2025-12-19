export const db = {
  getUsers: () => JSON.parse(localStorage.getItem("repo_users")) || [],
  saveUsers: (users) =>
    localStorage.setItem("repo_users", JSON.stringify(users)),
  encrypt: (str) => btoa(str),
  decrypt: (str) => atob(str),
};

// Creamos el administrador por defecto si no existe

if (db.getUsers().length === 0) {
  db.saveUsers([
    {
      id: "1",
      nombre: "Admin",
      apellido: "Principal",
      email: "administrador@test.com",
      passw: db.encrypt("admin123"),
      rol: "administrador",
    },
  ]);
}
