/**
 * @fileoverview Módulo de autorización y control de acceso (Middleware de cliente).
 * Se encarga de validar la sesión activa, gestionar permisos por roles y
 * proteger las rutas privadas del aplicativo.
 * @version 1.0.0
 */

import { db } from "./database.js";

/**
 * Representa la sesión del usuario actual almacenada en el sistema.
 * @typedef {Object} Session
 * @property {string} id - ID único del usuario.
 * @property {string} nombre - Nombre del usuario en sesión.
 * @property {string} email - Correo electrónico del usuario.
 * @property {('administrador'|'usuario')} rol - Rol del usuario para permisos.
 */

/**
 * Datos de la sesión actual recuperados de localStorage.
 * @type {Session|null}
 */
const session = JSON.parse(localStorage.getItem("current_session"));

/**
 * Ruta de la página actual en el navegador.
 * @type {string}
 */
const page = window.location.pathname;

/**
 * LÓGICA DE CONTROL DE ACCESO (GUARD)
 * Ejecución inmediata para evitar parpadeos de contenido protegido.
 */

if (session) {
  /**
   * REGLA: Usuarios autenticados.
   * Redirección si el usuario intenta acceder a Login o Registro estando ya logueado.
   */

  if (
    page.endsWith("index.html") ||
    page.endsWith("registro.html") ||
    page === "/"
  ) {
    window.location.href = "page/perfil.html";
  }

  /**
   * REGLA: Permisos de Administrador.
   * Bloquea el acceso a admin.html si el rol de la sesión no es 'administrador'.
   */
  if (session.rol !== "administrador" && page.endsWith("admin.html")) {
    alert("Acceso denegado: Se requiere rol de administrador");
    window.location.href = "page/perfil.html";
  }
} else {
  /**
   * REGLA: Usuarios NO autenticados.
   * Redirección al index si intentan acceder a páginas privadas.
   */
  if (page.endsWith("perfil.html") || page.endsWith("admin.html")) {
    window.location.href = "/index.html";
  }
}

/**
 * Inicializa los componentes de la interfaz de usuario basados en el estado de
 * la sesión.
 * Se ejecuta una vez que el DOM está listo.
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", () => {
  /**
   * Muestra elementos exclusivos para administradores.
   */
  if (session?.rol === "administrador") {
    document.getElementById("nav-admin")?.classList.remove("hidden");
  }
  /**
   * Gestiona el cierre de sesión.
   * Elimina los datos de 'current_session' y redirige a la página de inicio.
   */
  document.getElementById("btn-logout")?.addEventListener("click", () => {
    localStorage.removeItem("current_session");
    window.location.href = "/index.html";
  });
});
