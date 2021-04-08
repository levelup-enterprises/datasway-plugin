/* eslint-disable import/no-anonymous-default-export */
import { logout } from "./auth";

/** ----------------------------------
 ** Start activity timer
 * -----------------------------------
 * Takes time value in milliseconds and
 *  starts timer. Timer is reset on
 *  mouse activity and key presses.
 *
 * @parm integer override - override default time (5 mins)
 */
export default (override = null) => {
  try {
    let time = process.env.REACT_APP_ACTIVITY_TIMER;
    override && (time = override);

    let timer = setTimeout(() => logout(true), time);

    document.addEventListener("mousemove", () => {
      reset();
    });
    document.addEventListener("keypress", () => {
      reset();
    });

    function reset() {
      clearTimeout(timer);
      timer = setTimeout(() => logout(true), time);
    }
  } catch (error) {
    console.log(error);
  }
};
