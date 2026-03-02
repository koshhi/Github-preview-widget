const ERROR_COPY = Object.freeze({
  INVALID_FORMAT: {
    message: "La URL no tiene un formato válido.",
    action: "Pega una URL HTTPS completa de GitHub.",
  },
  UNSUPPORTED_HOST: {
    message: "El host no está soportado.",
    action: "Usa github.com o raw.githubusercontent.com.",
  },
  UNSUPPORTED_ROUTE: {
    message: "La ruta de GitHub no está soportada.",
    action: "Usa una URL de fichero en formato blob o raw.",
  },
  NOT_A_FILE: {
    message: "La URL no apunta a un fichero.",
    action: "Selecciona una URL que termine en un archivo concreto.",
  },
  UNSUPPORTED_EXTENSION: {
    message: "La extensión del fichero no está soportada en v1.",
    action: "Usa .md, .txt, .json, .js o .ts.",
  },
});

function toUserFacingUrlError(error) {
  const fallback = ERROR_COPY.INVALID_FORMAT;
  const copy = ERROR_COPY[error?.code] || fallback;

  return {
    code: error?.code || "INVALID_FORMAT",
    message: copy.message,
    action: copy.action,
    details: error?.details || "",
  };
}

module.exports = {
  toUserFacingUrlError,
};
