import React, { useState, useContext, useEffect, useCallback } from "react";
import { LocationContext } from "../../context/location";
import { sortValues } from "../../services/utilities";
import _ from "lodash";

const SideNav = ({
  regions,
  counties,
  updateRegion,
  updateCounty,
  ads,
  showAds,
  dimensions,
}) => {
  const { location, setLocation } = useContext(LocationContext);
  const [countyArray, updateCountyArray] = useState(null);
  const [showAd, toggleShowAd] = useState(false);

  let states = [];

  // Sort states
  if (regions) {
    states = Object.entries(regions).map((v) => [v[0], v[1].name]);
    sortValues(states);
  }

  const handleRegion = (e) => {
    e.preventDefault();
    const state = e.target.value;

    if (state !== "Select state") {
      updateRegion(state);
      setLocation({ region: state, county: null });
    } else {
      updateRegion(null);
      setLocation({ region: null, county: null });
    }
  };

  const handleCounty = (e) => {
    e.preventDefault();
    const county = e.target.value;
    setLocation({ county: county });
    updateCounty(county);
  };

  const countyDropdown = useCallback(
    (state) => {
      const array = [];

      regions[state].states.forEach((f) => {
        array.push(Object.entries(counties).filter((v) => v[0] === f));
      });

      // Sort counties
      sortValues(array);

      updateCountyArray(array);
    },
    [counties, regions]
  );

  useEffect(() => {
    location.region && countyDropdown(location.region);
  }, [location, countyDropdown]);

  const handleShowAds = (e) => {
    e.preventDefault();
    showAds();
    toggleShowAd(!showAd);
  };

  return (
    <form className="side-nav">
      {dimensions.width > 700 ? (
        <p>
          Use the map to choose your state and county or choose one from the
          following dropdown list.
        </p>
      ) : (
        <p>Choose your state and county from the following dropdown list.</p>
      )}

      <div className="form-group">
        <select
          name="region"
          id="region"
          value={location.region ? location.region : ""}
          onChange={(e) => handleRegion(e)}
        >
          <option>Select state</option>
          {regions &&
            states.map((v, i) => (
              <option value={v[0]} key={i}>
                {v[1]}
              </option>
            ))}
        </select>
      </div>

      {location.region && (
        <div className="form-group">
          <select
            name="county"
            id="county"
            value={location.county ? location.county : ""}
            onChange={(e) => handleCounty(e)}
          >
            <option value="">Select county</option>
            {countyArray &&
              countyArray.map((v, i) => (
                <option value={v[0][0]} key={i}>
                  {v[0][0]} : {v[0][1]}
                </option>
              ))}
          </select>
        </div>
      )}
      {ads && !_.isEmpty(ads) && (
        <button onClick={(e) => handleShowAds(e)}>
          {showAd ? "Hide ads" : "Display ads"}
        </button>
      )}
    </form>
  );
};

export default SideNav;
