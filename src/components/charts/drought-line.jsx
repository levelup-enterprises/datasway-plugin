import React, { useEffect, useState } from "react";
import { linearGradientDef } from "@nivo/core";
import { ResponsiveLine } from "@nivo/line";

const DroughtLine = ({ data }) => {
  const [values, updateValues] = useState({});
  // Build data object
  const updateData = (data) => {
    if (data) {
      var droughtData = [];
      droughtData = data.map((v) => ({ x: v.x, y: parseInt(v.y) }));
      data = [{ id: "Drought", data: droughtData }];
      return data;
    }
  };

  useEffect(() => {
    updateValues(updateData(data));
  }, [data]);

  //# USE hay-price table
  return (
    <div className="chart-container">
      {values && (
        <ResponsiveLine
          data={values}
          margin={{ top: 50, right: 20, bottom: 50, left: 60 }}
          colors={["transparent"]}
          xScale={{
            type: "time",
            format: "%Y-%m-%d",
            useUTC: false,
            precision: "day",
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
            format: "%y %b",
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
            legend: "DSIC",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          enableArea={true}
          defs={[
            linearGradientDef("gradientA", [
              { offset: 0, color: "red" },
              { offset: 200, color: "orange", opacity: 1 },
            ]),
          ]}
          fill={[{ match: "*", id: "gradientA" }]}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
          // legends={[
          //   {
          //     anchor: "bottom-right",
          //     direction: "column",
          //     justify: false,
          //     translateX: 100,
          //     translateY: 0,
          //     itemsSpacing: 0,
          //     itemDirection: "left-to-right",
          //     itemWidth: 80,
          //     itemHeight: 20,
          //     itemOpacity: 0.75,
          //     symbolSize: 12,
          //     symbolShape: "circle",
          //     symbolBorderColor: "rgba(0, 0, 0, .5)",
          //     effects: [
          //       {
          //         on: "hover",
          //         style: {
          //           itemBackground: "rgba(0, 0, 0, .03)",
          //           itemOpacity: 1,
          //         },
          //       },
          //     ],
          //   },
          // ]}
        />
      )}
    </div>
  );
};

export default DroughtLine;
