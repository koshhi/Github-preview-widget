const { AUTH_KINDS, AUTH_UI_CODES } = require("./types.ts");

const AUTH_COPY = Object.freeze({
  [AUTH_KINDS.MISSING_PAT]: {
    code: AUTH_UI_CODES.MISSING_PAT,
    message:
      "El fichero que intentas visualiza es privado. Crea un personal access token para acceder a este fichero.",
  },
  [AUTH_KINDS.EXPIRED_PAT]: {
    code: AUTH_UI_CODES.EXPIRED_PAT,
    message: "Tu personal access token es invalido o ha expirado (Expired Pat)",
  },
  [AUTH_KINDS.CURRENT_PAT]: {
    code: AUTH_UI_CODES.CURRENT_PAT,
    message: "Tu personal access no tiene los permisos/scope suficiente (Current Pat)",
  },
});

function getAuthUxMessage(kind) {
  const fallback = AUTH_COPY[AUTH_KINDS.MISSING_PAT];
  const selected = AUTH_COPY[kind] || fallback;

  return {
    code: selected.code,
    message: selected.message,
    action: "Actualiza o reemplaza tu PAT para este fichero.",
  };
}

module.exports = {
  getAuthUxMessage,
};
