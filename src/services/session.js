/* eslint-disable import/no-anonymous-default-export */

/**--------------------------------------
 ** Set session
 * --------------------------------------
 * @param {string} name
 * @param {mixed} session
 * @returns {object}
 */
export function set(name, session) {
  try {
    if (typeof session === "object") {
      session = JSON.stringify(session);
    }
    return sessionStorage.setItem(name, session);
  } catch (error) {
    console.log(error);
  }
}

/**--------------------------------------
 ** Get session values
 * --------------------------------------
 * @param {string} name
 * @returns {object}
 */
export function get(name) {
  try {
    let session = sessionStorage.getItem(name) || null;

    if (session !== null) {
      try {
        return JSON.parse(session);
      } catch (error) {
        return session;
      }
    }
    return session;
  } catch (error) {
    console.log(error);
  }
}

/**--------------------------------------
 ** Remove session
 * --------------------------------------
 * @param {string} name
 * @returns {object}
 */
export function remove(name) {
  try {
    return sessionStorage.removeItem(name) || false;
  } catch (error) {
    console.log(error);
  }
}

export default {
  set,
  get,
  remove,
};
