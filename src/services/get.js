import http from "./http";
import axios from "axios";
import { getJwt } from "./auth";
import { toast } from "react-toastify";

/**--------------------------------------
 ** Build GET Api string
 * --------------------------------------
 * @param {string} category
 * @returns {object}
 */
export const getAPI = async (path, values) => {
  try {
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
  } catch (e) {
    console.log(e);
    return {};
  }
};

/**----------------------------------
 ** Get Hay data
 * --------------------------------------
 * @param {string} category
 * @returns {object}
 */
export const getHay = async (values) => {
  try {
    const { data } = await getAPI("hay", values);
    data && !data.success && !data.error && console.log(data);
    return data;
  } catch (e) {
    console.log(e);
    return {};
  }
};

/**----------------------------------
 ** Get Cattle on Feed Prices
 * --------------------------------------
 * @param {string} category
 * @returns {object}
 */
export const getCattleFeed = async (values) => {
  try {
    const { data } = await getAPI("cattle-feed", values);
    data && !data.success && !data.error && console.log(data);
    return data;
  } catch (e) {
    console.log(e);
    return {};
  }
};

/**----------------------------------
 ** Get Hay Prices
 * --------------------------------------
 * @param {string} category
 * @returns {object}
 */
export const getHayPrices = async (values) => {
  try {
    const { data } = await getAPI("hay-prices", values);
    data && !data.success && !data.error && console.log(data);
    return data;
  } catch (e) {
    console.log(e);
    return {};
  }
};

/**----------------------------------
 ** Get Hay Transaction
 * --------------------------------------
 * @param {string} category
 * @returns {object}
 */
export const getHayTransactions = async (values) => {
  try {
    const { data } = await getAPI("hay-transactions", values);
    data && !data.success && !data.error && console.log(data);
    return data;
  } catch (e) {
    console.log(e);
    return {};
  }
};

/**----------------------------------
 ** Get Drought by region
 * --------------------------------------
 * @param {string} category
 * @returns {object}
 */
export const getDrought = async (values) => {
  try {
    const { data } = await getAPI("drought", values);
    data && !data.success && !data.error && console.log(data);
    return data;
  } catch (e) {
    console.log(e);
    return {};
  }
};

/**----------------------------------
 ** Get Ad data
 * --------------------------------------
 * @param {string} category
 * @returns {object}
 */
export const getAds = async (values) => {
  try {
    const instance = axios.create({
      baseURL: process.env.REACT_APP_ALLHAY_AD_ENDPOINT,
    });
    instance.defaults.headers.common = {};
    instance.defaults.headers.common.accept = "application/json";
    const data = await instance.get(
      "entries?form_id=16&_field_ids=3,4,39,post_id,8,24,42",
      {
        auth: {
          username: process.env.REACT_APP_ALLHAY_KEY,
          password: process.env.REACT_APP_ALLHAY_SECRET,
        },
      }
    );
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return {};
  }
};
