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
  }, [county, currentCounty]);

  useEffect(() => {
    updateRegion();
  }, [updateRegion]);

  //? Get Drought data
  const getDroughtData = async (county) => {
    const { success } = await getDrought({
      county: county,
    });
    if (success) {
      // console.log("Drought data:");
      // console.log(success);
      success.data && updateDroughtData(success.data.graph);
      success.data && updateDroughtDSIC(success.data.current);
      updateCurrentCounty(county);
      toggleLoaded(true);
    }
  };

  //? Get Hay data
  const getHayData = async (county) => {
    const { success } = await getHay({
      county: county,
    });
    if (success) {
      // console.log("Hay data:");
      // console.log(success);
      updateHayProd(success);
    }
  };

  return (
    <Loading trigger={loaded} message="Gathering county data">
      <h1 className="mt-2">County information</h1>
      <section className="charts">
        {!_.isEmpty(droughtData) && (
          <div className="chart-wrapper w-100">
            <div className="chart">
              <h2>Historical Drought</h2>
              <DroughtLine drought={droughtData} dimensions={dimensions} />
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

              <p className="muted">
                <span className="info">&#9432;</span> The Drought Severity and
                Coverage Index (DSCI) is a method for converting drought levels
                from the U.S. Drought Monitor map to a single value for an area.
                Drought severity is classified into 5 categories and our DSCI
                graphs are colored accordingly as shown in the table.
              </p>
              <p>
                Source: <b>United States Drought Monitor</b>
              </p>
            </div>
          </div>
        )}

        {!_.isEmpty(hayProd) && hayProd.count > 0 && (
          <div className="chart-wrapper w-50 h-auto">
            <div className="chart">
              <h2>Cropland</h2>
              <p className="muted">
                Percent of cropland used for hay production
              </p>
              <Cropland pie={hayProd} dimensions={dimensions} />
              <p className="muted">
                <span className="info">&#9432;</span> Hay production value is in
                ton per year. Data is from 2017 Census of Agriculture performed
                by National Agricultural Statistics Service.
              </p>
              <p>
                Source: <b>USDA</b>
              </p>
            </div>
          </div>
        )}
      </section>
    </Loading>
  );
};

export default County;
