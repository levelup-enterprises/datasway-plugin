import React, { useState, useEffect, useCallback } from "react";
import { searchFilter, clg } from "../services/utilities";
import _ from "lodash";
import {
  getCattleFeed,
  getHayPrices,
  getHayTransactions,
} from "../services/get";
import Loading from "../components/common/loading";
import TabHeader from "../components/common/tab-header";
import TabContainer from "../components/common/tab-container";
// Charts
import CattleFeedLine from "../components/charts/cattle-feed-line";
import CattleFeedBars from "../components/charts/cattle-feed-bars";
import HayPriceLine from "../components/charts/hay-price-line";
import HayTable from "../components/hay-table";
import HayQuality from "../components/charts/hay-quality-pie";
import HayClass from "../components/charts/hay-class-pie";
import HayQualityBars from "../components/charts/hay-quality-bars";

const Region = ({ region, refreshMap, dimensions }) => {
  const [currentRegion, updateCurrentRegion] = useState(null);
  const [cattleData, updateCattleData] = useState({});
  const [hayPrices, updateHayPrices] = useState({});
  const [hayTrans, updateHayTrans] = useState({});
  const [loaded, toggleLoaded] = useState(false);
  const [resetDate, setResetDate] = useState(false);
  const [tab, changeTab] = useState(0);

  // Filterable
  const [filterableValues, updateFilterableValues] = useState(null);
  const [valuesSorted, updateValuesSorted] = useState(null);
  const [barsSorted, updateBarsSorted] = useState(null);
  const [filters, setFilters] = useState(null);

  //# Get region data on state change
  const updateRegion = useCallback(() => {
    if (currentRegion !== region) {
      getCattle(region);
      getPrices(region);
      getHayTable(region);
      setResetDate(true);
    } else {
      refreshMap();
      toggleLoaded(true);
    }
  }, [region]);

  useEffect(() => {
    toggleLoaded(false);
    updateRegion();
  }, [updateRegion]);

  //? Get cattle on feed data
  const getCattle = async (region) => {
    const { success } = await getCattleFeed({
      region: region,
    });
    if (success) {
      clg("Cattle on feed:");
      clg(success);
      success.data && updateCattleData(success.data);
      updateCurrentRegion(region);
    }
  };

  //? Get hay price data
  const getPrices = async (region) => {
    const { success } = await getHayPrices({
      region: region,
    });
    if (success) {
      clg("Hay Price:");
      clg(success);
      success.data && updateHayPrices(success.data);
    }
  };

  //? Get hay transaction data
  const getHayTable = async (region, date = null) => {
    const search = date ? { region: region, date: date } : { region: region };
    const { success, error } = await getHayTransactions(search);
    if (success) {
      clg("Hay Transactions:");
      clg(success);
      if (success.data) {
        const { data } = success;
        updateHayTrans(data);
        data.table
          ? updateFilterableValues(data.table.data)
          : updateFilterableValues({});
        data.table ? buildFilters(data.table.data) : buildFilters({});
      }
    }
    error && console.log(error);
    refreshMap();
    toggleLoaded(true);
  };

  //? Update hay transaction data by date
  const updateDate = (date) => {
    toggleLoaded(false);
    updateFilterableValues(null);
    buildFilters({});
    getHayTable(currentRegion, date);
  };

  //# Set filters
  const buildFilters = (values) => {
    let filters = {};
    Object.values(values).forEach((row) => {
      Object.entries(row).forEach((v, i) => {
        if (i > 0 && i < 6) {
          filters[i] ? filters[i].push(v[1]) : (filters[i] = ["Select", v[1]]);
          filters[i] = [...new Set(filters[i])];
        }
      });
    });
    setFilters(filters);
  };

  //# Handle Filter changes
  const handleChange = (value) => {
    if (value !== "Select") {
      const sorted = searchFilter(
        valuesSorted ? valuesSorted : hayTrans.table.data,
        value
      );
      filterBars(sorted);
      buildFilters(sorted);
      updateValuesSorted(sorted);
      updateFilterableValues(sorted);
    }
  };

  //# Reset FIlters
  const resetFilters = (e) => {
    e.preventDefault();
    updateValuesSorted(null);
    buildFilters(hayTrans.table.data);
    filterBars(null);
    updateFilterableValues(hayTrans.table.data);
  };

  //# Filter Hay Quality Bars
  const filterBars = (sorted) => {
    if (sorted) {
      let bars = {};
      Object.values(sorted).forEach((v) => {
        bars[v.Quality]
          ? (bars[v.Quality] = {
              sum: bars[v.Quality].sum + parseFloat(v["Min Price"]),
              count: bars[v.Quality].count + 1,
            })
          : (bars[v.Quality] = { sum: parseFloat(v["Min Price"]), count: 1 });
      });
      Object.entries(bars).forEach((v) => {
        bars[v[0]] = Math.round(v[1].sum / v[1].count, 2);
      });
      // console.log(hayTrans.bars);
      updateBarsSorted(bars);
    } else updateBarsSorted(null);
  };

  return (
    <Loading trigger={loaded} message="Gathering state data">
      <h1 className="mt-2">Regional information</h1>
      <TabHeader
        headers={["Cattle", "Prices", "Transactions"]}
        updateTab={(e) => changeTab(e)}
      />
      <section className="charts region">
        <TabContainer active={tab === 0}>
          {!_.isEmpty(cattleData) && cattleData.line.count > 0 && (
            <div className="chart-wrapper w-75">
              <div className="chart">
                <h2>Cattle on Feed</h2>
                <p className="muted">
                  Cattle placed on feed on 1000+ capacity feedlots. Unit is by
                  1000 head.
                </p>
                <CattleFeedLine
                  data={cattleData.line}
                  dimensions={dimensions}
                />
              </div>
            </div>
          )}
          {!_.isEmpty(cattleData) && cattleData.bars.count > 0 && (
            <div className="chart-wrapper w-25">
              <div className="chart">
                <h2>Cattle on Feed</h2>
                <p className="muted">&nbsp;</p>
                <CattleFeedBars bars={cattleData.bars} />
              </div>
            </div>
          )}
        </TabContainer>
        <TabContainer active={tab === 1}>
          {!_.isEmpty(hayPrices) ? (
            <div className="chart-wrapper w-100">
              <div className="chart">
                <h2>Hay Prices</h2>
                <p className="muted">
                  Predicted hay prices in relations with historical hay prices.
                </p>
                <HayPriceLine data={hayPrices} dimensions={dimensions} />

                <p className="muted">
                  <span className="info">&#9432;</span> Price prediction is
                  based on more than 150 variables. Inputs range from drought
                  conditions, diesel prices, to cattle on feed. Due to
                  limitation in historical price data, not all states are
                  available at this moment. The graph shows the upper and lower
                  bound of our predicted hay prices.
                </p>
                <p>
                  Source: <b>DataSway Consulting</b>
                </p>
              </div>
            </div>
          ) : (
            <div className="chart-wrapper w-100">
              <div className="chart">
                <h2>No Price data available</h2>
              </div>
            </div>
          )}
        </TabContainer>
        <TabContainer active={tab === 2}>
          <div className="chart-wrapper w-100">
            <div className="chart">
              <h2>Hay Transactions</h2>
              <p className="muted">
                Weekly reported hay transactions. Filter table for specific
                information to be summarized in the following charts.
              </p>
              <HayTable
                data={filterableValues}
                config={hayTrans.table && hayTrans.table.config}
                filters={filters}
                resetDate={resetDate}
                updateDate={updateDate}
                handleChange={handleChange}
                resetFilters={resetFilters}
                dimensions={dimensions}
              />

              <p className="muted">
                <span className="info">&#9432;</span> The table displays hay
                transactions collected by the USDA. Most recent records are
                displayed by default. Use filtering features to narrow data by
                interest. All graphs are summary of all records displayed in the
                table.
              </p>
              <p>
                Source: <b>USDA</b>
              </p>
            </div>
          </div>
          {!_.isEmpty(hayTrans) && (
            <div className="chart-wrapper w-50">
              <div className="chart">
                <h2>Hay Quality</h2>
                <HayQuality
                  data={filterableValues}
                  config={hayTrans.config && hayTrans.config.quality}
                  dimensions={dimensions}
                />
              </div>
            </div>
          )}
          {!_.isEmpty(hayTrans) && (
            <div className="chart-wrapper w-50">
              <div className="chart">
                <h2>Hay Class</h2>
                <HayClass
                  data={filterableValues}
                  config={hayTrans.config && hayTrans.config.class}
                  dimensions={dimensions}
                />
              </div>
            </div>
          )}
          {!_.isEmpty(hayTrans) && (
            <div className="chart-wrapper w-50">
              <div className="chart">
                <h2>Hay Quality</h2>
                <HayQualityBars
                  bars={barsSorted ? { data: barsSorted } : hayTrans.bars}
                  dimensions={dimensions}
                />
              </div>
            </div>
          )}
        </TabContainer>
      </section>
    </Loading>
  );
};

export default Region;
