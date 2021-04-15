/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import session from "./session";

// Root url
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

// Handle 400 & 500 errors
axios.interceptors.response.use(null, (errors) => {
  const expectedError =
    errors.response &&
    errors.response.status >= 400 &&
    errors.response.status < 500;

  if (expectedError) {
    // Handle bad token
    if (errors.response.status === 401) {
      session.remove("token");
      console.log(errors.response.data);
      // window.location.reload();
    }
    // Handle all other errors
    if (errors.response.data) {
      const { error } = errors.response.data;
      console.error(error.message);
    }
    console.error(errors.response.message);
  }

  return Promise.reject(errors);
});

// Set X Auth in outbound headers
const setJwt = (jwt) => {
  axios.defaults.headers.common["X-Auth-Token"] = jwt;
};

!axios.defaults.headers.common["X-Auth-Token"] && setJwt(session.get("token"));

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt,
};
