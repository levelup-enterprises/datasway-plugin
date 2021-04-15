import React, { useState, useEffect, useCallback, useContext } from "react";
import { LocationContext } from "./context/location";
import { getDrought, getAds } from "./services/get";
import zipCodes from "./assets/data/zipcodes.json";
// Components
import Loading from "./components/common/loading";
import SideNav from "./components/forms/side-nav";
import Ads from "./views/ads";
import Region from "./views/region";
import County from "./views/county";

// Pull map scripts
require("./assets/maps/mapdata.min.js");
require("./assets/maps/mapinfo.min.js");
require("./assets/maps/countymap.js");

function App() {
  // Context
  const { location, setLocation } = useContext(LocationContext);
  // States
  const [mapLoaded, updateMapLoaded] = useState(false);
  const [heatMapLoaded, setHeatMapLoaded] = useState(false);
  const [adsLoaded, setAdsLoaded] = useState(false);
  const [adData, updateAdData] = useState(null);
  const [droughtData, updateDroughtData] = useState(null);
  const [viewAds, toggleViewAds] = useState(false);

  // Map globals
  const mapdata = window.simplemaps_countymap_mapdata;
  const mapdataStates = window.simplemaps_countymap_mapdata.state_specific;
  const mapinfo = window.simplemaps_countymap_mapinfo;
  const map = window.simplemaps_countymap;

  //# Get region data on state change
  const updateApp = useCallback(() => {
    console.log(location);
    getAdData();
    getDroughtData();
  }, [location]);

  useEffect(() => {
    !mapLoaded && map.load();
  }, [mapLoaded, map]);

  //* Get Drought for map
  const getDroughtData = async () => {
    if (!droughtData) {
      const { success } = await getDrought({
        map: true,
      });
      if (success) {
        console.log("Drought:");
        console.log(success);
        updateHeatMap(success.data.map);
        updateDroughtData(success.data.map);
      }
    } else {
      map.refresh();
    }
  };

  //* Get Allhay.com ad data
  const getAdData = async (params) => {
    try {
      if (!adData) {
        const { data } = await getAds();
        if (data) {
          console.log("Ads:");
          console.log(data);
          if (data.entries) {
            updateLocations(data.entries);
          }
        }
      } else {
        map.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  //* Drought colors for map
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

  //# Update Ad Locations
  const updateLocations = (zips) => {
    if (adsLoaded) {
      map.refresh();
    } else {
      try {
        let locations = {};
        Object.values(zips).forEach((v) => {
          const img = v[24].length > 0 ? v[24].replace("|:||:||:|", "") : "";

          v[39] !== "" &&
            zipCodes[v[39]] &&
            (locations[v.post_id] = {
              name: v[4],
              state: v[3],
              type: v[42],
              description: v[8],
              url: process.env.REACT_APP_ALLHAY_POSTS + v.post_id,
              img_url: img,
              ...zipCodes[v[39]],
            });
        });
        console.log("Locations:");
        console.log(locations);
        mapdata.locations = locations;
        map.refresh();
        updateAdData(locations);
        setAdsLoaded(true);
      } catch (e) {
        console.log(e);
      }
    }
  };

  //# Update heat map
  const updateHeatMap = (data) => {
    if (heatMapLoaded) {
      map.refresh();
    } else {
      Object.values(data).forEach((v) => {
        if (typeof mapdataStates[v.fips] !== "undefined") {
          mapdataStates[v.fips].color = droughtColorChart(v.tier, v.influence);
        }
      });
      map.refresh();
      setHeatMapLoaded(true);
      updateMapLoaded(true);
    }
  };

  //# Map loaded
  map.hooks.complete = () => {
    console.log("Map has loaded");
    updateApp();
  };

  //# Back button
  map.hooks.back = () => {
    county
      ? setLocation({ county: null })
      : region && setLocation({ region: null });
  };

  //# Refresh on load complete
  map.hooks.zooming_complete = () => {
    console.log("Zooming complete!");
    map.refresh();
  };

  //# Handle state clicks
  map.hooks.zoomable_click_region = (id) => {
    console.log(id);
    id ? map.region_zoom(id) : map.back();
    setLocation({ region: id });
  };

  // //# Handle county clicks
  map.hooks.zoomable_click_state = (id) => {
    console.log(id);
    id ? map.state_zoom(id) : map.back();
    setLocation({ county: id });
  };

  console.log(mapdata.main_settings);

  const { region, county } = location;
  return (
    <div className="container-fluid">
      <section className="map">
        <Loading trigger={mapLoaded} message="Building map">
          <div id="map"></div>
        </Loading>
        <SideNav
          regions={mapinfo.default_regions}
          counties={mapinfo.names}
          updateRegion={map.hooks.zoomable_click_region}
          updateCounty={map.hooks.zoomable_click_state}
          ads={adData}
          showAds={() => toggleViewAds(!viewAds)}
        />
      </section>
      {adData && viewAds && <Ads data={adData} />}
      {county && <County county={county} refreshMap={() => map.refresh()} />}
      {region && (
        <Region
          region={region}
          county={county}
          refreshMap={() => map.refresh()}
        />
      )}
    </div>
  );
}

export default App;
