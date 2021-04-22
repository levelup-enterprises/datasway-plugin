import React, { useEffect, useState } from "react";
import { ResponsiveLine } from "@nivo/line";

const HayPriceLine = ({ data, dimensions }) => {
  const [values, updateValues] = useState({});
  const [types, setTypes] = useState(null);
  const [currentType, updateCurrentType] = useState({});
  const [config, setConfig] = useState({
    margin: 50,
    rotate: 0,
    offset: 36,
  });
  // Build data object
  const updateData = (data) => {
    if (!data[0]) {
      let prices = [];
      Object.entries(data.line).forEach((c) => {
        if (c[0] !== "config") {
          prices[c[0]] = Object.entries(c[1]).map((v) => {
            return { id: v[0], data: v[1].data };
          });
        }
      });
      return prices;
    }
  };

  const getTypes = (types) => {
    return Object.keys(types).map((v) => v);
  };

  // Modify based on screen width
  const modifyChart = (screen) => {
    screen.width < 750
      ? setConfig({
          margin: 60,
          rotate: -50,
          offset: 55,
        })
      : setConfig({
          margin: 50,
          rotate: 0,
          offset: 36,
        });
  };

  useEffect(() => {
    const prices = updateData(data);
    const types = getTypes(prices);

    dimensions && modifyChart(dimensions);
    setTypes(types);
    updateValues(prices);
    updateCurrentType(prices[types[0]]);
  }, [data, dimensions]);

  const buildDropdown = (types) => {
    return types.map((v, k) => (
      <option value={v} key={k}>
        {v}
      </option>
    ));
  };

  const handleChange = (e) => {
    e.preventDefault();
    updateCurrentType(values[e.target.value]);
  };

  //# USE hay-price table
  return (
    <>
      {types && (
        <select
          className="chart-dropdown"
          name="dropdown"
          id="dropdown"
          onChange={(e) => handleChange(e)}
        >
          {buildDropdown(types)}
        </select>
      )}
      <div className="chart-container wide">
        {currentType && (
          <ResponsiveLine
            key={currentType[0] && currentType[0].data[0].y + dimensions.width}
            data={currentType}
            margin={{ top: 50, right: 40, bottom: config.margin, left: 60 }}
            colors={data.config ? data.config : null}
            xScale={{
              type: "time",
              format: "%Y-%m-%d",
              useUTC: false,
              precision: "month",
            }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            xFormat="time:%Y-%m-%d"
            lineWidth={2}
            curve="natural"
            axisTop={null}
            axisRight={null}
            axisBottom={
              dimensions.width < 350
                ? null
                : {
                    orient: "bottom",
                    format: "%b %y",
                    tickValues: "every month",
                    tickPadding: 5,
                    tickRotation: config.rotate,
                    legend: "Date",
                    legendOffset: config.offset,
                    legendPosition: "middle",
                  }
            }
            axisLeft={{
              orient: "left",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Price",
              legendOffset: -40,
              legendPosition: "middle",
            }}
            // enableArea={true}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: "top-left",
                direction: "row",
                justify: false,
                translateX: -55,
                translateY: -50,
                itemsSpacing: 50,
                itemDirection: "left-to-right",
                itemWidth: 60,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        )}
      </div>
    </>
  );
};

export default HayPriceLine;
