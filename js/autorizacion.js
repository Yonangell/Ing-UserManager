import { db } from "./database.js";

const session = JSON.parse(localStorage.getItem("current_session"));
const page = window.location.pathname;

// Reglas de acceso

if (session) {
  // si esta logueado no entra a login ni registro
  if (
    page.endsWith("index.html") ||
    page.endsWith("registro.html") ||
    page === "/"
  ) {
    window.location.href = "perfil.html";
  }

  // Si no es admin no entra a admin.html
  if (session.rolc !== "administrador" && page.endsWith("admin.html")) {
    alert("Acceso denegado: Se requiere rol de administrador");
    window.location.href = "perfil.html";
  }
} else {
  // si no esta logueado no entra a paginas internas
  if (page.endsWith("perfil.html") || page.endsWith("admin.html")) {
    window.location.href = "index.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (session?.role == "administrador") {
    document.getElementById("nav-admin")?.classList.remove("hidden");
  }
  document.getElementById("btn-logout")?.addEventListener("click", () => {
    localStorage.removeItem("current_session");
    window.location.href = "index.html";
  });
});
