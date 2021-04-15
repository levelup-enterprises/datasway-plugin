/* eslint-disable import/no-anonymous-default-export */
import http from "./http";
import session from "./session";
import { postify } from "./utilities";

const tokenKey = "token";

// Set headers and token
// getJwt();

/**--------------------------------
 ** POST to Login
 * --------------------------------
 * Attempts to login with
 *  credentials
 *
 * @param {string} values
 * @returns {json} data
 */
export async function login(values) {
  return http.post(`post/authenticate`, postify(values));
}

/**--------------------------------
 ** Logout
 * --------------------------------
 * Removes token, affiliates and
 *  user data from storage and
 *  redirects to root.
 */
export async function logout(inactive = null) {
  try {
    session.remove(tokenKey);

    if (inactive) {
      // Set continue values
      const continueSession = {
        exp: new Date(),
        url: window.location.pathname,
      };
      session.set("inactive", "You have been logged out due to inactivity");
      session.set("continue", continueSession);
    } else session.remove("continue");
    window.location.href = "/";
  } catch (error) {
    console.log(error);
  }
}

/**--------------------------------
 ** Check for Expired Token
 * --------------------------------
 * Checks object for errors and
 *  if starts with Expires logout
 *
 * @param {object} data
 * @returns {string}
 */
export function isExpired(data) {
  try {
    if (typeof data.errors !== "undefined") {
      data.errors.startsWith("Expired") && logout();
    }
  } catch (error) {
    console.log(error);
  }
}

/**--------------------------------
 ** Remove Token
 * --------------------------------
 */
export function reset() {
  try {
    session.remove(tokenKey);
  } catch (error) {
    console.log(error);
  }
}

/**--------------------------------
 ** Get Token
 * --------------------------------
 * Gets token from localStorage
 *  if exists.
 * - Sets token from jwt.js if not
 * @returns {string}
 */
export async function getJwt(clear = null) {
  try {
    let token = session.get(tokenKey) || null;
    if (!token || clear) {
      const { data } = await http.post(
        "post/authenticate.php",
        postify({
          password: "password",
        })
      );
      session.set(tokenKey, data.success.token);
      token = data.success.token;
    }
    http.setJwt(token);
  } catch (error) {
    console.log(error);
  }
}

export default {
  login,
  logout,
  reset,
  isExpired,
  getJwt,
};
