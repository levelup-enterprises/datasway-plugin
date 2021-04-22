import React, { useEffect, useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import _ from "lodash";

const CattleFeedLine = ({ data, dimensions }) => {
  const [values, updateValues] = useState({});
  const [config, setConfig] = useState({
    rotate: 0,
    offset: 36,
  });

  // Build data object
  const updateData = (data) => {
    if (!_.isEmpty(data)) {
      let values = [];
      Object.entries(data).forEach((c) => {
        if (c[0] !== "config" && c[0] !== "count") {
          values[c[0]] = Object.entries(c[1]).map((v) => {
            return { id: v[0], data: v[1] };
          });
        }
      });
      return values.data;
    }
  };

  // Modify based on screen width
  const modifyChart = (screen) => {
    screen.width < 750
      ? setConfig({
          rotate: -50,
          offset: 40,
        })
      : setConfig({
          rotate: 0,
          offset: 36,
        });
  };

  useEffect(() => {
    dimensions && modifyChart(dimensions);
    updateValues(updateData(data));
  }, [data, dimensions]);

  //# USE hay-price table
  return (
    <div className="chart-container wide">
      {values && (
        <ResponsiveLine
          key={dimensions && dimensions.width}
          data={values}
          margin={{ top: 50, right: 30, bottom: 50, left: 60 }}
          colors={data.config ? data.config : null}
          xScale={{
            type: "time",
            format: "%m-%d",
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
          xFormat="time:%m-%d"
          lineWidth={2}
          curve="natural"
          axisTop={null}
          axisRight={null}
          axisBottom={
            dimensions.width < 350
              ? null
              : {
                  orient: "bottom",
                  format: "%b",
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
            legend: "Head",
            legendOffset: -50,
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
              itemsSpacing: 0,
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
  );
};

export default CattleFeedLine;
