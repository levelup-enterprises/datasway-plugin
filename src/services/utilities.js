import { toast } from "react-toastify";

/** ------------------------------------
 ** Format phone number
 * ------------------------------------
 * @param n phone number
 * @return formatted number
 */
export function formatPhoneNum(n) {
  try {
    if (!n) return n;

    // only allows 0-9 inputs
    n = n.replace(/[^\d]/g, "");

    if (n.length < 4) return n;

    if (n.length < 7) return `${n.slice(0, 3)}-${n.slice(3)}`;

    return `${n.slice(0, 3)}-${n.slice(3, 6)}-${n.slice(6, 10)}`;
  } catch (error) {
    console.log(error);
  }
}

/** -------------------------------
 ** Mask and format zip code value
 * --------------------------------
 * @param {string} n value to be converted
 * @param {integer} max limit the length - default 5
 */
export function formatZipCode(n, max = null) {
  try {
    if (!n) return n;
    // Max limiter
    !max && (max = 5);
    // only allows 0-9 inputs
    n = n.replace(/[^\d]/g, "");
    // Prevent more than 8
    n = n.substring(0, max);
    if (n.length <= 5) return n;
    return n.slice(0, 5) + "-" + n.slice(5);
  } catch (error) {
    console.log(error);
  }
}

/** ---------------------------
 ** Update page title
 * ----------------------------
 * Gets location pathname
 *  cleans & formats it.
 * Appends site title to it.
 */
export function updateTitle(title = false) {
  try {
    if (!title) {
      const site = process.env.REACT_APP_TITLE;
      let page = window.location.pathname;
      page = page.split("/");
      page = page[page.length - 1];
      page = page.replace("/", "").replace("-", " ");
      document.title = capitalize(page) + " | " + site;
    } else {
      document.title = title;
    }
  } catch (error) {
    console.log(error);
  }
}

/** ------------------------------------
 ** Capitalize 1st letter of each word
 * ------------------------------------
 * @param string word or phrase
 * @return string formatted word or phrase
 */
export function capitalize(string) {
  try {
    const transform = (string) => {
      return string
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };
    return transform(string);
  } catch (error) {
    console.log(error);
  }
}

/** ------------------------------------
 ** Smooth scroll to top of page
 * ------------------------------------
 */
export function scrollToTop() {
  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}

/** ------------------------------------
 ** Copy value to clipboard
 * ------------------------------------
 * @param string word or phrase
 * @return toast alert
 */
export function copyClipboard(value) {
  navigator.clipboard.writeText(value).then(
    () => {
      console.log(value);
      toast.info("Added to clipboard!");
    },
    () => {
      console.log("failed");
    }
  );
}

/** ------------------------------------
 ** Convert object to POSTable values
 * ------------------------------------
 * @param object values
 * @return URLSearchParams POST format
 */
export function postify(values) {
  try {
    let params = new URLSearchParams();
    Object.entries(values).forEach((entry) => {
      const [key, value] = entry;
      params.append(key, value);
    });
    return params;
  } catch (error) {
    console.log(error);
  }
}

/** ------------------------------------
 ** Get and return url query
 * ------------------------------------
 * @return formatted query
 */
export function getQuery() {
  try {
    let search = window.location.search;

    // Remove ?
    search = search.substring(1);
    // Split values
    let values = search.split("&");
    var query = {};

    // Split values and keys
    if (values.length > 1) {
      query = [];

      // Set single pair to array of objects
      query.push(
        values.map((v) => {
          let value = v.split("=");
          let newValue = {};
          newValue[value[0]] = value[1];
          return newValue;
        })
      );
    } else {
      // Set single pair
      values = search.split("=");
      query[values[0]] = values[1];
    }
    return query;
  } catch (error) {
    console.log(error);
  }
}

/** ------------------------------------
 ** Filter query results
 * ------------------------------------
 * @param object query object
 * @param string filter
 * @return filtered value
 */
export function filterQuery(query, filter) {
  try {
    if (Object.prototype.toString.call(query) === "[object Array]") {
      const value = query[0].filter(
        (value) => typeof value[filter] !== undefined && value[filter]
      );
      return value[0][filter];
    } else {
      return query[filter];
    }
  } catch (error) {
    console.log(error);
  }
}

/** ------------------------------------
 ** Sort table data
 * ------------------------------------
 * @param object values
 * @param string column
 * @param string order
 * @return object
 */
export function sortValues(values, column = null, order) {
  function compare(a, b) {
    const A = column ? a[column] : a[0];
    const B = column ? b[column] : b[0];

    let comparison = 0;
    if (A > B) {
      comparison = 1;
    } else if (A < B) {
      comparison = -1;
    }
    return order === "desc" ? comparison * -1 : comparison;
  }

  return values.sort(compare);
}

/** ------------------------------------
 ** Remove item from object
 * ------------------------------------
 * @param {object} object
 * @param {string} id
 * @return object
 */
export function filter(object, id) {
  console.log(object);
  return object.filter((value) => value.id !== id);
}

/** ------------------------------------
 ** Search through array of objects
 * ------------------------------------
 * @param {object} array
 * @param {string} search
 * @return object
 */
export function searchFilter(array, search) {
  if (array.length !== 0) {
    return array.filter((obj) => {
      if (search) {
        let searched = [];
        Object.values(obj).forEach((value) => {
          if (value !== undefined && value !== null) {
            typeof value !== "number"
              ? (value = value.toLowerCase())
              : (value = value.toString());
            // searched.push(value.includes(search.toLowerCase()));
            searched.push(value === search.toLowerCase());
          } else searched.push(false);
        });
        return searched.find((v) => v === true) && obj;
      } else return obj;
    });
  } else return [];
}

/** ------------------------------------
 ** Prevent too many resize calls
 * ------------------------------------
 * @param {object} array
 * @param {string} search
 * @return object
 */
export function debounce(fn, ms) {
  let timer;
  return (_) => {
    clearTimeout(timer);
    timer = setTimeout((_) => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}

/** ------------------------------------
 ** Prevent too many resize calls
 * ------------------------------------
 * @param {string} message
 * @return console log
 */
export function clg(message) {
  process.env.NODE_ENV !== "production" && console.log(message);
}
