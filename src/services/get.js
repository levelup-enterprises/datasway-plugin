import http from "./http";
import { getJwt } from "./auth";
import { toast } from "react-toastify";
import session from "./session";

/**--------------------------------------
 ** Build GET Api string
 * --------------------------------------
 * @param {string} category
 * @returns {object}
 */
export const getAPI = async (path, values) => {
  if (values) {
    return getJwt()
      .then(() => http.get(`get/${path}.php`, { params: values }))
      .catch((e) => {
        if (e.response.data.error.message === "Token is not valid!") {
          getJwt(true);
          window.location.reload();
        } else {
          console.log(e.response);
          toast.error("Something went wrong!");
          return { data: { error: e } };
        }
      });
  } else
    return getJwt()
      .then(() => http.get(`get/${path}.php`))
      .catch((e) => {
        if (e.response.data.error.message === "Token is not valid!") {
          getJwt(true);
          window.location.reload();
        } else {
          console.log(e.response);
          toast.error("Something went wrong!");
          return { data: { error: e } };
        }
      });
};

/**----------------------------------
 ** Get Hay data
 * --------------------------------------
 * @param {string} category
 * @returns {object}
 */
export const getHay = async (values) => {
  const { data } = await getAPI("hay", values);
  data && !data.success && !data.error && console.log(data);
  return data;
};

/**----------------------------------
 ** Get Cattle on Feed Prices
 * --------------------------------------
 * @param {string} category
 * @returns {object}
 */
export const getCattleFeed = async (values) => {
  const { data } = await getAPI("cattle-feed", values);
  data && !data.success && !data.error && console.log(data);
  return data;
};

/**----------------------------------
 ** Get Hay Prices
 * --------------------------------------
 * @param {string} category
 * @returns {object}
 */
export const getHayPrices = async (values) => {
  const { data } = await getAPI("hay-prices", values);
  data && !data.success && !data.error && console.log(data);
  return data;
};

/**----------------------------------
 ** Get Hay Transaction
 * --------------------------------------
 * @param {string} category
 * @returns {object}
 */
export const getHayTransactions = async (values) => {
  const { data } = await getAPI("hay-transactions", values);
  data && !data.success && !data.error && console.log(data);
  return data;
};

/**----------------------------------
 ** Get Drought by region
 * --------------------------------------
 * @param {string} category
 * @returns {object}
 */
export const getDrought = async (values) => {
  const { data } = await getAPI("drought", values);
  data && !data.success && !data.error && console.log(data);
  return data;
};
