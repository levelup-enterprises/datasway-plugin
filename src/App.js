import React, { useState, useEffect, useCallback, useContext } from "react";
import { LocationContext } from "./context/location";
import { getDrought, getAds, getHayTransactionsMap } from "./services/get";
import zipCodes from "./assets/data/zipcodes.json";
import { debounce } from "./services/utilities";
// Components
import Loading from "./components/common/loading";
import SideNav from "./components/forms/side-nav";
import Ads from "./views/ads";
import Region from "./views/region";
import County from "./views/county";
import Disclaimer from "./components/disclaimer";

function App() {
  // Context
  const { location, setLocation } = useContext(LocationContext);
  // States
  const [mapLoaded, updateMapLoaded] = useState(false);
  const [heatMapLoaded, setHeatMapLoaded] = useState(false);
  const [adsLoaded, setAdsLoaded] = useState(false);
  const [adData, updateAdData] = useState(null);
  const [droughtData, updateDroughtData] = useState(null);
  const [transactionData, updateTransactionData] = useState(null);
  const [adButton, toggleAdButton] = useState(false);
  const [viewAds, toggleViewAds] = useState(false);
  const [showDroughtText, toggleShowDroughtText] = useState(false);
  const [showTransactionText, toggleShowTransactionText] = useState(false);
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  // Map globals
  const mapdata = window.simplemaps_countymap_mapdata;
  const mapdataStates = mapdata.state_specific;
  const map = window.simplemaps_countymap;
  const mapinfo = window.simplemaps_countymap_mapinfo;

  //# Get region data on state change
  const updateApp = useCallback(() => {
    !adData && getAdData();
  }, [adData]);

  useEffect(() => {
    !mapLoaded && map && map.load();

    // Update the location pins
    mapdata.main_settings.location_image_url =
      process.env.REACT_APP_API_URL + "public/images/location-pin-blue.png";

    // Screen size handling
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }, 1000);
    window.addEventListener("resize", debouncedHandleResize);
    return (_) => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, [mapLoaded, map, mapdata.main_settings]);

  //* Get Drought for map
  const getDroughtData = async () => {
    if (!droughtData) {
      const { success } = await getDrought({
        map: true,
      });
      if (success) {
        // console.log("Drought:");
        // console.log(success);
        updateHeatMap(success.data.map);
        updateDroughtData(success.data.map);
      }
    } else {
      map && map.refresh();
    }
  };

  //* Get Allhay.com ad data
  const getAdData = async () => {
    try {
      if (!adData) {
        const { data } = await getAds();
        if (data) {
          // console.log("Ads:");
          // console.log(data);
          data && updateLocations(data);
        }
      } else {
        console.log("Map refresh");
        map && map.refresh();
        updateMapLoaded(true);
      }
      // updateMapLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  //* Get Transactions for map
  const getStateTransactions = async () => {
    if (!transactionData) {
      const { success } = await getHayTransactionsMap();
      if (success) {
        // console.log("Map Transactions:");
        // console.log(success);
        updateTransactionData(success.data);
        updateTransactionsMap(success.data.states, success.data.max);
      }
    } else {
      console.log("Map refresh");
      map && map.refresh();
    }
  };

  //! Drought colors for map
  const droughtColorChart = (t, i) => {
    if (t === 1) {
      if (i > 100 && i < 300) {
        return "beige";
      } else if (i < 500) {
        return "#bfbf67";
      } else if (i < 800) {
        return "#adad4b";
      } else if (i < 1000) {
        return "#b1b107";
      } else if (i >= 1000) {
        return "#989800";
      }
    }
    if (t === 2) {
      if (i < 300) {
        return "gold";
      } else if (i < 500) {
        return "#d2b209";
      } else if (i < 800) {
        return "#ad9207";
      } else if (i < 1000) {
        return "#a28800";
      } else if (i >= 1000) {
        return "8a7400";
      }
    }
    if (t === 3) {
      if (i < 300) {
        return "#f7b570";
      } else if (i < 500) {
        return "#f5a756";
      } else if (i < 800) {
        return "#f59838";
      } else if (i < 1000) {
        return "#f58a1d";
      } else if (i >= 1000) {
        return "#f98005";
      }
    }
    if (t === 4) {
      if (i < 300) {
        return "#ef9898";
      } else if (i < 500) {
        return "#f17777";
      } else if (i < 800) {
        return "#f15757";
      } else if (i < 1000) {
        return "#f33a3a";
      } else if (i >= 1000) {
        return "red";
      }
    }
    if (t === 5) {
      if (i < 300) {
        return "#d01f1f";
      } else if (i < 500) {
        return "#b31313";
      } else if (i < 800) {
        return "#920a0a";
      } else if (i < 1000) {
        return "#710202";
      } else if (i >= 1000) {
        return "#4e0000";
      }
    }
  };

  //! Transaction colors for map
  const transactionColorChart = (t, max) => {
    const step = max / 20;

    if (t <= step) {
      return "#85e7f2";
    } else if (t <= step * 2) {
      return "#7fe0f2";
    } else if (t <= step * 3) {
      return "#7dddf4";
    } else if (t <= step * 4) {
      return "#76d1f6";
    } else if (t <= step * 5) {
      return "#72c6f9";
    } else if (t <= step * 6) {
      return "#71c1f9";
    } else if (t <= step * 7) {
      return "#6dbafa";
    } else if (t <= step * 8) {
      return "#6ab3fc";
    } else if (t <= step * 9) {
      return "#69affd";
    } else if (t <= step * 10) {
      return "#0bc0f8";
    } else if (t <= step * 11) {
      return "#02baf6";
    } else if (t <= step * 12) {
      return "#01b1f3";
    } else if (t <= step * 13) {
      return "#07a7f4";
    } else if (t <= step * 14) {
      return "#0b99f3";
    } else if (t <= step * 15) {
      return "#0894f1";
    } else if (t <= step * 16) {
      return "#028ef0";
    } else if (t <= step * 17) {
      return "#0786ef";
    } else if (t <= step * 18) {
      return "#0677ed";
    } else if (t <= step * 19) {
      return "#086feb";
    } else if (t === max) {
      return "#0868ea";
    }
  };

  //? Update Ad Locations
  const updateLocations = (zips) => {
    if (adsLoaded) {
      map.refresh();
    } else {
      try {
        let locations = {};
        Object.values(zips).forEach((v) => {
          const grassType = v.listing_hay_type.toLowerCase();
          const path =
            process.env.REACT_APP_API_URL + "public/images/location-pin";
          let pin = "";

          const variety =
            v.listing_hay_variety !== "" ? " - " + v.listing_hay_variety : "";

          //# Grass types
          grassType === "alfalfa" && (pin = `${path}-alfalfa.png`);
          grassType === "hay" && (pin = `${path}-hay.png`);
          grassType === "wheat" && (pin = `${path}-wheat.png`);
          grassType === "bermuda grass" && (pin = `${path}-bermuda.png`);
          grassType === "sorghum" && (pin = `${path}-sorghum.png`);
          grassType === "alfalfa/grass mix" && (pin = `${path}-mix.png`);

          v.listing_zipcode !== "" &&
            zipCodes[v.listing_zipcode] &&
            (locations[v.id] = {
              name: v.listing_city,
              state: v.listing_state,
              city: v.listing_city,
              typeOf: v.listing_hay_type + variety,
              description: v.listing_description,
              url: v.link,
              img_url: v.listing_image_url,
              image_url: pin,
              ...zipCodes[v.listing_zipcode],
            });
        });
        // console.log("Locations:");
        // console.log(locations);
        mapdata.locations = locations;
        updateAdData(locations);
        setAdsLoaded(true);
        map && map.refresh();
        updateMapLoaded(true);
      } catch (e) {
        console.log(e);
      }
    }
  };

  //? Update heat map
  const updateHeatMap = (data) => {
    //* Wipe existing colors
    Object.values(mapdataStates).forEach((v) => {
      if (v.color) {
        delete v.color;
      }
    });
    //* Set colors
    Object.values(data).forEach((v) => {
      if (typeof mapdataStates[v.fips] !== "undefined") {
        mapdataStates[v.fips].color = droughtColorChart(v.tier, v.influence);
      }
    });
    map && map.refresh();
    toggleShowDroughtText(true);
    setHeatMapLoaded(true);
    updateMapLoaded(true);
  };

  //? Update transactions map
  const updateTransactionsMap = (data, max) => {
    let fips = [];
    //* Get counties
    Object.values(data).forEach((v) => {
      if (typeof mapinfo.default_regions[v.state] !== "undefined") {
        fips.push({
          total: v.total,
          fips: mapinfo.default_regions[v.state].states,
        });
      }
    });
    //* Wipe existing colors
    Object.values(mapdataStates).forEach((v) => {
      if (v.color) {
        delete v.color;
      }
    });
    //* Set colors
    fips &&
      Object.values(fips).forEach((v) => {
        v.fips.forEach((fips) => {
          mapdataStates[fips].color = transactionColorChart(v.total, max);
        });
      });
    map && map.refresh();
    toggleShowTransactionText(true);
    setHeatMapLoaded(true);
    updateMapLoaded(true);
  };

  //? Toggle drought map
  const toggleDroughtMap = (e) => {
    updateMapLoaded(false);
    showTransactionText && toggleShowTransactionText(false);
    if (e && !droughtData) {
      getDroughtData();
    } else if (e && droughtData) {
      updateHeatMap(droughtData);
    } else {
      clearMap();
    }
  };

  //? Toggle drought map
  const toggleTransactionMap = (e) => {
    updateMapLoaded(false);
    showDroughtText && toggleShowDroughtText(false);
    if (e && !transactionData) {
      getStateTransactions();
    } else if (e && transactionData) {
      updateTransactionsMap(transactionData.states, transactionData.max);
    } else {
      clearMap();
    }
  };

  //? Reset map colors
  const clearMap = () => {
    Object.values(mapdataStates).forEach((v) => {
      delete v.color;
    });
    map && map.refresh();
    toggleShowDroughtText(false);
    toggleShowTransactionText(false);
    updateMapLoaded(true);
  };

  //# Map loaded
  map.hooks.complete = () => {
    updateApp();
  };

  //# Back button
  map.hooks.back = () => {
    county
      ? setLocation({ county: null })
      : region && setLocation({ region: null });
  };

  //# Handle state clicks
  map.hooks.zoomable_click_region = (id) => {
    id ? map.region_zoom(id) : map.back();
    setLocation({ region: id });
  };

  // //# Handle county clicks
  map.hooks.zoomable_click_state = (id) => {
    id ? map.state_zoom(id) : map.back();
    setLocation({ county: id });
  };

  const { region, county } = location;
  return (
    <div className="container-fluid">
      <section className="map">
        {dimensions.width > 800 ? (
          <Loading trigger={mapLoaded} message="Building map">
            <div>
              <div id="map"></div>
              {showDroughtText && heatMapLoaded && (
                <>
                  <div className="drought-scale">
                    <div style={{ backgroundColor: "beige" }}></div>
                    <div style={{ backgroundColor: "#bfbf67" }}></div>
                    <div style={{ backgroundColor: "#adad4b" }}></div>
                    <div style={{ backgroundColor: "#b1b107" }}></div>
                    <div style={{ backgroundColor: "#989800" }}></div>
                    <div style={{ backgroundColor: "gold" }}></div>
                    <div style={{ backgroundColor: "#d2b209" }}></div>
                    <div style={{ backgroundColor: "#ad9207" }}></div>
                    <div style={{ backgroundColor: "#a28800" }}></div>
                    <div style={{ backgroundColor: "#8a7400" }}></div>
                    <div style={{ backgroundColor: "#f7b570" }}></div>
                    <div style={{ backgroundColor: "#f5a756" }}></div>
                    <div style={{ backgroundColor: "#f59838" }}></div>
                    <div style={{ backgroundColor: "#f58a1d" }}></div>
                    <div style={{ backgroundColor: "#f98005" }}></div>
                    <div style={{ backgroundColor: "#ef9898" }}></div>
                    <div style={{ backgroundColor: "#f17777" }}></div>
                    <div style={{ backgroundColor: "#f15757" }}></div>
                    <div style={{ backgroundColor: "#f33a3a" }}></div>
                    <div style={{ backgroundColor: "red" }}></div>
                    <div style={{ backgroundColor: "#d01f1f" }}></div>
                    <div style={{ backgroundColor: "#b31313" }}></div>
                    <div style={{ backgroundColor: "#920a0a" }}></div>
                    <div style={{ backgroundColor: "#710202" }}></div>
                    <div style={{ backgroundColor: "#4e0000" }}></div>
                  </div>
                  <div className="drought-scale-legend">
                    <h6>Low drought</h6>
                    <h6>Extreme drought</h6>
                  </div>
                  <p className="muted">
                    <span className="info">&#9432;</span> The Drought Impact
                    Index identifies the areas of high hay production currently
                    impacted by drought conditions.​
                  </p>
                </>
              )}
              {showTransactionText && heatMapLoaded && (
                <>
                  <div className="drought-scale">
                    <div style={{ backgroundColor: "#85e7f2" }}></div>
                    <div style={{ backgroundColor: "#7fe0f2" }}></div>
                    <div style={{ backgroundColor: "#7dddf4" }}></div>
                    <div style={{ backgroundColor: "#76d1f6" }}></div>
                    <div style={{ backgroundColor: "#72c6f9" }}></div>
                    <div style={{ backgroundColor: "#71c1f9" }}></div>
                    <div style={{ backgroundColor: "#6dbafa" }}></div>
                    <div style={{ backgroundColor: "#6ab3fc" }}></div>
                    <div style={{ backgroundColor: "#69affd" }}></div>
                    <div style={{ backgroundColor: "#6baefd" }}></div>
                    <div style={{ backgroundColor: "#02baf6" }}></div>
                    <div style={{ backgroundColor: "#01b1f3" }}></div>
                    <div style={{ backgroundColor: "#07a7f4" }}></div>
                    <div style={{ backgroundColor: "#0b99f3" }}></div>
                    <div style={{ backgroundColor: "#0894f1" }}></div>
                    <div style={{ backgroundColor: "#028ef0" }}></div>
                    <div style={{ backgroundColor: "#0786ef" }}></div>
                    <div style={{ backgroundColor: "#0677ed" }}></div>
                    <div style={{ backgroundColor: "#086feb" }}></div>
                    <div style={{ backgroundColor: "#0868ea" }}></div>
                  </div>
                  <div className="drought-scale-legend">
                    <h6>Cool market</h6>
                    <h6>Hot market</h6>
                  </div>
                  <p className="muted">
                    <span className="info">&#9432;</span> Index is the count of
                    all hay transactions in each state. Color range is between
                    lowest to highest​ count for the month.
                  </p>
                </>
              )}
            </div>
          </Loading>
        ) : (
          <div className="hide" id="map"></div>
        )}
        <SideNav
          regions={mapinfo.default_regions}
          counties={mapinfo.names}
          updateRegion={map.hooks.zoomable_click_region}
          updateCounty={map.hooks.zoomable_click_state}
          toggleDroughtMap={(e) => toggleDroughtMap(e)}
          toggleTransactionMap={(e) => toggleTransactionMap(e)}
          displayButton={adButton}
          showAds={() => toggleViewAds(!viewAds)}
          loading={mapLoaded}
          dimensions={dimensions}
        />
      </section>
      <Ads
        data={adData}
        region={region}
        showAds={viewAds}
        displayAdButton={(e) => toggleAdButton(e)}
      />
      {county && (
        <County
          county={county}
          refreshMap={() => map && map.refresh()}
          dimensions={dimensions}
        />
      )}
      {region && (
        <Region
          region={region}
          refreshMap={() => map && map.refresh()}
          dimensions={dimensions}
        />
      )}
      <Disclaimer />
    </div>
  );
}

export default App;
