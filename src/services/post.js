import http from "./http";
import { getJwt } from "./auth";
import { postify } from "./utilities";
import { toast } from "react-toastify";

/**--------------------------------------
 ** Build POST Api string
 * --------------------------------------
 * @param {string} path
 * @returns {object}
 */
export async function postAPI(path, data) {
  return getJwt()
    .then(() => http.post(`post/${path}.php`, postify(data)))
    .catch((e) => {
      if (e.response.data.error) {
        const { error } = e.response.data;
        if (error.message === "Token is not valid!") window.location.reload();
        else {
          console.log(error.message);
          toast.error(error.message);
          return { data: { error: e } };
        }
      } else console.error(e);
      return { data: { error: e } };
    });
}
