import React, { useEffect, useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import _, { values } from "lodash";

const CattleFeedLine = ({ data }) => {
  const [values, updateValues] = useState({});

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

  useEffect(() => {
    updateValues(updateData(data));
  }, [data]);

  //# USE hay-price table
  return (
    <div className="chart-container wide">
      {values && (
        <ResponsiveLine
          data={values}
          margin={{ top: 50, right: 120, bottom: 50, left: 60 }}
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
          axisBottom={{
            orient: "bottom",
            format: "%b",
            tickValues: "every month",
            tickPadding: 5,
            tickRotation: 0,
            legend: "Date",
            legendOffset: 36,
            legendPosition: "middle",
          }}
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
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
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
