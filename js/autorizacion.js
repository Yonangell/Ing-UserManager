/**
 * @fileoverview Módulo de autorización y control de acceso (Middleware de cliente).
 * Se encarga de validar la sesión activa, gestionar permisos por roles y
 * proteger las rutas privadas del aplicativo.
 * @version 1.0.0
 * @author Ing. Yonangell Guillen
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
 * @constant
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
 * Ejecución inmediata para evitar el renderizado de contenido restringido.
 */

if (session) {
  /**
   * REGLA: Usuarios autenticados.
   * Redirección si el usuario intenta acceder a Login o Registro estando ya logueado.
   */

  if (
    page.endsWith("index.html") ||
    page.endsWith("registro.html") ||
    page === "/" ||
    page.endsWith("/")
  ) {
    window.location.href = "page/home.html";
  }

  /**
   * REGLA: Permisos de Administrador.
   * Redirige a la página de error 403 si el rol no es válido para la ruta actual.
   */
  if (session.rol !== "administrador" && page.endsWith("admin.html")) {
    window.location.href = "403.html";
  }
} else {
  /**
   * REGLA: Usuarios NO autenticados.
   * Redirección al index si intentan acceder a páginas privadas.
   */
  if (
    page.endsWith("perfil.html") ||
    page.endsWith("admin.html") ||
    page.endsWith("home.html")
  ) {
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
  /** @type {HTMLElement|null} */
  const adminNameElement = document.getElementById("admin-name");

  if (adminNameElement && session) {
    adminNameElement.innerText = `ADMIN: ${session.nombre.toUpperCase()}`;
  }
  /**
   * Gestiona el cierre de sesión.
   * Limpia la persistencia y retorna al índice del proyecto.
   */
  document.getElementById("btn-logout")?.addEventListener("click", () => {
    localStorage.removeItem("current_session");
    window.location.href = "../index.html";
  });
});
