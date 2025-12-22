/**
 * Módulo de base de datos para manejar usuarios en localStorage.
 * Proporciona funciones para obtener, guardar, encriptar y desencriptar datos
 * de usuarios.
 * También crea un usuario administrador por defecto si no existen usuarios.
 */

/**
 * Representa un usuario dentro del sistema.
 * @typedef {Object} User
 * @property {string} id - Identificador único del usuario (UUID o numérico).
 * @property {string} nombre - Nombre de pila del usuario.
 * @property {string} apellido - Apellido del usuario.
 * @property {string} email - Correo electrónico único.
 * @property {string} passw - Contraseña codificada en Base64.
 * @property {('administrador'|'usuario')} rol - Rol asignado para el control
 * de acceso.
 */

/**
 * Objeto que contiene las funciones de base de datos para usuarios.
 * @typedef {Object} Database
 * @property {Function} getUsers - Obtiene la lista de usuarios desde
 * localStorage.
 * @property {Function} saveUsers - Guarda la lista de usuarios en localStorage.
 * @property {Function} encrypt - Codifica una cadena usando base64.
 * @property {Function} decrypt - Decodifica una cadena desde base64.
 */

/**
 * Motor de base de datos local para la gestión de usuarios.
 * @type {Database}
 */
export const db = {
  /**
   * Obtiene la lista de usuarios desde localStorage con manejo de errores de
   * parsing.
   * @returns {User[]} Lista de objetos de usuario. Retorna un array vacío si
   * no hay datos o hay error.
   */
  getUsers: () => {
    try {
      return JSON.parse(localStorage.getItem("repo_users")) || [];
    } catch (e) {
      console.error("Error al leer usuarios desde localStorage:", e);
      return [];
    }
  },

  /**
   * Serializa y guarda la lista completa de usuarios en el almacenamiento
   * local.
   * @param {User[]} users - Array de objetos de usuario a persistir.
   * @throws {Error} Si el almacenamiento local está lleno o deshabilitado.
   */
  saveUsers: (users) => {
    try {
      localStorage.setItem("repo_users", JSON.stringify(users));
    } catch (e) {
      console.error("Error al guardar usuarios en localStorage:", e);
    }
  },

  /**
   * Codifica una cadena de texto a formato Base64.
   * @param {string} str - Texto plano a codificar.
   * @returns {string} Cadena resultante en Base64.
   * @example db.encrypt("miPassword123") // Retorna "bWlQYXNzd29yZDEyMw=="
   */
  encrypt: (str) => btoa(str),

  /**
   * Decodifica una cadena de texto desde formato Base64.
   * @param {string} str - Cadena en Base64 a decodificar.
   * @returns {string} Texto plano resultante.
   * @example db.decrypt("bWlQYXNzd29yZDEyMw==") // Retorna "miPassword123"
   */
  decrypt: (str) => atob(str),
};

/**
 * Inicialización: Crea el usuario administrador por defecto si la base de
 * datos está vacía.
 * Se ejecuta al importar el módulo.
 */
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
