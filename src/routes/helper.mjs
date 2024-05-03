/**
 * Retourne un objet contenant le message et les données.
 * @param {*} message
 * @param {*} data
 */
const success = (message, data) => {
  return {
    message: message,
    data: data,
  };
};

export { success };
