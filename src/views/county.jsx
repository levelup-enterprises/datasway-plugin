import React, { useState, useEffect, useCallback } from "react";
import { getDrought, getHay } from "../services/get";
import _ from "lodash";
import Loading from "../components/common/loading";
// Charts
import DroughtLine from "../components/charts/drought-line";
import Cropland from "../components/charts/cropland-pie";
import DroughtDSIC from "../components/charts/drought-pie";

const County = ({ county, refreshMap, dimensions }) => {
  // States
  const [currentCounty, updateCurrentCounty] = useState(null);
  const [droughtData, updateDroughtData] = useState(null);
  const [droughtDSIC, updateDroughtDSIC] = useState(null);
  const [hayProd, updateHayProd] = useState(null);
  const [loaded, toggleLoaded] = useState(false);

  //# Get region data on state change
  const updateRegion = useCallback(() => {
    if (currentCounty !== county) {
      toggleLoaded(false);
      getDroughtData(county);
      getHayData(county);
    } else refreshMap();
  }, [county]);

  useEffect(() => {
    updateRegion();
  }, [updateRegion]);

  //? Get Drought data
  const getDroughtData = async (county) => {
    const { success } = await getDrought({
      county: county,
    });
    if (success) {
      console.log("Drought data:");
      console.log(success);
      success.data && updateDroughtData(success.data.graph);
      success.data && updateDroughtDSIC(success.data.current);
      updateCurrentCounty(county);
    }
  };

  //? Get Hay data
  const getHayData = async (county) => {
    const { success } = await getHay({
      county: county,
    });
    if (success) {
      console.log("Hay data:");
      console.log(success);
      const { data } = success;
      console.log(data);
      updateHayProd(data);
    }
    toggleLoaded(true);
  };

  return (
    <Loading trigger={loaded} message="Gathering county data">
      <h1 className="mt-2">County information</h1>
      <section className="charts">
        {!_.isEmpty(droughtData) && (
          <div className="chart-wrapper w-100">
            <div className="chart">
              <h2>Historical Drought</h2>
              <DroughtLine data={droughtData} dimensions={dimensions} />
            </div>
          </div>
        )}

        {!_.isEmpty(droughtDSIC) && (
          <div className="chart-wrapper w-50">
            <div className="chart">
              <h2>DSCI</h2>
              <p className="muted">
                The Drought Severity and Coverage Index represents drought
                levels for the county.
              </p>
              <DroughtDSIC data={droughtDSIC} dimensions={dimensions} />
            </div>
          </div>
        )}

        {!_.isEmpty(hayProd) && (
          <div className="chart-wrapper w-50">
            <div className="chart">
              <h2>Cropland</h2>
              <p className="muted">
                Illustrates the percentage of cropland that is hay in the
                county. The hay production value is total yearly production of
                hay in tons.
              </p>
              <Cropland data={hayProd} dimensions={dimensions} />
            </div>
          </div>
        )}
      </section>
    </Loading>
  );
};

export default County;
