import React, { useState, useEffect, useCallback } from "react";
import { searchFilter } from "../services/utilities";
import _ from "lodash";
import {
  getCattleFeed,
  getHayPrices,
  getHayTransactions,
} from "../services/get";
import Loading from "../components/common/loading";
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
      console.log("Cattle on feed:");
      console.log(success);
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
      console.log("Hay Price:");
      console.log(success);
      success.data && updateHayPrices(success.data);
    }
  };

  //? Get hay transaction data
  const getHayTable = async (region, date = null) => {
    const search = date ? { region: region, date: date } : { region: region };
    const { success, error } = await getHayTransactions(search);
    if (success) {
      console.log("Hay Transactions:");
      console.log(success);
      if (success.data) {
        const { data } = success;
        updateHayTrans(data);
        data.table
          ? updateFilterableValues(data.table)
          : updateFilterableValues({});
        data.table ? buildFilters(data.table) : buildFilters({});
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
        valuesSorted ? valuesSorted : hayTrans.table,
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
    buildFilters(hayTrans.table);
    filterBars(null);
    updateFilterableValues(hayTrans.table);
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
      <section className="charts region">
        {!_.isEmpty(cattleData) && cattleData.line.count > 0 && (
          <div className="chart-wrapper w-75">
            <div className="chart">
              <h2>Cattle on Feed</h2>
              <p className="muted">
                Cattle placed on feed on 1000+ capacity feedlots. Unit is by
                1000 head.
              </p>
              <CattleFeedLine data={cattleData.line} dimensions={dimensions} />
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
        {dimensions.width <= 1200 && dimensions.width > 700 && (
          <div className="filler">
            <h2>Check out this info</h2>
            <p>
              This is a placeholder to display some kind of info to fill in this
              gap.
            </p>
          </div>
        )}
        {!_.isEmpty(hayPrices) && (
          <div className="chart-wrapper w-100">
            <div className="chart">
              <h2>Hay Prices</h2>
              <p className="muted">
                Predicted hay prices in relations with historical hay prices.
              </p>
              <HayPriceLine data={hayPrices} dimensions={dimensions} />
            </div>
          </div>
        )}
        <div className="chart-wrapper w-100">
          <div className="chart">
            <h2>Hay Transactions</h2>
            <p className="muted">
              Weekly reported hay transactions. Filter table for specific
              information to be summarized in the following charts.
            </p>
            <HayTable
              data={filterableValues}
              filters={filters}
              resetDate={resetDate}
              updateDate={updateDate}
              handleChange={handleChange}
              resetFilters={resetFilters}
              dimensions={dimensions}
            />
          </div>
        </div>
        {!_.isEmpty(hayTrans) && (
          <div className="chart-wrapper w-50">
            <div className="chart">
              <h2>Hay Quality</h2>
              <HayQuality data={filterableValues} dimensions={dimensions} />
            </div>
          </div>
        )}
        {!_.isEmpty(hayTrans) && (
          <div className="chart-wrapper w-50">
            <div className="chart">
              <h2>Hay Class</h2>
              <HayClass data={filterableValues} dimensions={dimensions} />
            </div>
          </div>
        )}
        {!_.isEmpty(hayTrans) && (
          <div className="chart-wrapper w-50">
            <div className="chart">
              <h2>Hay Quality</h2>
              <HayQualityBars
                data={barsSorted ? barsSorted : hayTrans.bars}
                dimensions={dimensions}
              />
            </div>
          </div>
        )}
      </section>
    </Loading>
  );
};

export default Region;
