import React, { useEffect, useState } from "react";
import { linearGradientDef } from "@nivo/core";
import { ResponsiveLine } from "@nivo/line";

const DroughtLine = ({ drought, dimensions }) => {
  const { data } = drought;
  const [values, updateValues] = useState({});
  const [config, setConfig] = useState({
    margin: { top: 50, right: 20, bottom: 50, left: 60 },
    rotate: 0,
    offset: 36,
  });
  // Build data object
  const updateData = (data) => {
    if (data) {
      var droughtData = [];
      droughtData = data.map((v) => ({ x: v.x, y: parseInt(v.y) }));
      data = [{ id: "Drought", data: droughtData }];
      return data;
    }
  };

  // Modify based on screen width
  const modifyChart = (screen) => {
    screen.width < 750
      ? setConfig({
          margin: { top: 20, right: 20, bottom: 60, left: 60 },
          rotate: -40,
          offset: 55,
        })
      : setConfig({
          margin: { top: 50, right: 20, bottom: 50, left: 60 },
          rotate: 0,
          offset: 36,
        });
  };

  useEffect(() => {
    updateValues(updateData(data));
    dimensions && modifyChart(dimensions);
  }, [data, dimensions]);

  //# USE hay-price table
  return (
    <div className="chart-container">
      {values && (
        <ResponsiveLine
          key={dimensions && dimensions.width}
          data={values}
          margin={config.margin}
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
          axisBottom={
            dimensions.width < 400
              ? null
              : {
                  orient: "bottom",
                  format: "%y %b",
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
            legend: "DSCI",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          enableArea={true}
          defs={[
            linearGradientDef("gradientA", [
              { offset: 0, color: drought.config ? drought.config[0] : null },
              {
                offset: 200,
                color: drought.config ? drought.config[1] : null,
                opacity: 1,
              },
            ]),
          ]}
          fill={[{ match: "*", id: "gradientA" }]}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
        />
      )}
    </div>
  );
};

export default DroughtLine;
