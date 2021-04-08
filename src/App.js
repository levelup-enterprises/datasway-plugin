import React, { useState, useEffect, useCallback, useContext } from "react";
import { LocationContext } from "./context/location";
import { getHay, getDrought, getHayTransactions } from "./services/get";
import SideNav from "./components/forms/side-nav";
import Region from "./views/region";
import County from "./views/county";

// Pull map scripts
require("./assets/maps/mapdata.min.js");
require("./assets/maps/countymap.js");

function App() {
  const { location, setLocation } = useContext(LocationContext);
  // Map click states
  const [hayTrans, updateHayTrans] = useState(null);

  // Map globals
  const mapdata = window.simplemaps_countymap_mapdata.state_specific;
  const mapinfo = window.simplemaps_countymap_mapinfo;
  const map = window.simplemaps_countymap;

  //* Get all hay data

  //# Get region data on state change
  const updateApp = useCallback(() => {
    console.log(location);
    getHayTable(location.region);
  }, [location]);

  useEffect(() => {
    updateApp();
    // getHayData();
    getDroughtData();
  }, [updateApp]);

  //? Get hay transaction data
  const getHayTable = async (region) => {
    const { success, error } = await getHayTransactions({
      region: region,
    });
    if (success) {
      console.log("Hay Transactions:");
      console.log(success);
      success.data && updateHayTrans(success.data);
      updateHeatMap(success.data);
    }
    error && console.log(error);
  };

  //? Get hay data
  const getHayData = async () => {
    const { success, error } = await getHay({ map: true });
    if (success) {
      console.log("Hay:");
      console.log(success);
      updateHeatMap(success.data, "hay");
    }
    error && console.log(error);
  };

  //? Get Drought for map
  const getDroughtData = async (county) => {
    const { success } = await getDrought({
      map: true,
    });
    if (success) {
      console.log("Drought:");
      console.log(success);
      updateHeatMap(success.data.map, "drought");
    }
  };

  //? Hay colors for map
  const hayColorChart = (v) => {
    if (v < 100) {
      return "#a9daa4";
    } else if (v < 200) {
      return "#7fc778";
    } else if (v < 300) {
      return "#66ad5f";
    } else if (v < 400) {
      return "#559a4f";
    } else if (v < 500) {
      return "#458240";
    } else if (v < 600) {
      return "#31732b";
    } else if (v < 700) {
      return "#2a6d24";
    } else if (v < 800) {
      return "#1f5a19";
    } else if (v < 900) {
      return "#154e10";
    } else if (v < 1000) {
      return "#0b4606";
    } else {
      return "#0b4606";
    }
  };

  //? Drought colors for map
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

  //# Update heat map
  const updateHeatMap = (data, type) => {
    Object.values(data).forEach((v) => {
      if (typeof mapdata[v.fips] !== "undefined") {
        type === "hay" && (mapdata[v.fips].color = hayColorChart(v.hay));
        type === "drought" &&
          (mapdata[v.fips].color = droughtColorChart(v.tier, v.influence));
      }
    });
    map.refresh();
  };

  //# Map loaded
  map.hooks.complete = () => {
    console.log("Map has loaded");
  };

  //# Back button
  map.hooks.back = () => {
    county
      ? setLocation({ county: null })
      : region && setLocation({ region: null });
  };

  //# Handle state clicks
  map.hooks.zoomable_click_region = (id) => {
    console.log(id);
    setLocation({ region: id });
  };

  // //# Handle county clicks
  map.hooks.zoomable_click_state = (id) => {
    console.log(id);
    setLocation({ county: id });
  };

  const { region, county } = location;
  return (
    <div className="container-fluid">
      <section className="map">
        <div id="map"></div>
        <SideNav
          regions={mapinfo.default_regions}
          counties={mapinfo.names}
          updateRegion={map.hooks.zoomable_click_region}
          updateCounty={map.hooks.zoomable_click_state}
        />
      </section>
      {region && (
        <>
          <h1>Regional Section</h1>
          <section className="charts region">
            <Region region={region} county={county} hayTrans={hayTrans} />
          </section>

          {county && (
            <>
              <h1>County Section</h1>
              <section className="charts">
                <County region={region} county={county} hayTrans={hayTrans} />
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
