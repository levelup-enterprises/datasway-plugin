import React, { useState, useEffect } from "react";
import { ResponsivePie } from "@nivo/pie";

const Cropland = ({ data, dimensions }) => {
  const [configBottom, setConfigBottom] = useState("20px");
  const [showLabels, toggleShowLables] = useState(true);
  if (data) {
    var values = [
      {
        id: "Hay",
        label: "Hay",
        value: data.hay_percent,
      },
      {
        id: "Crop",
        label: "Crop",
        value: data.percent_crop,
      },
    ];
  }

  useEffect(() => {
    if (dimensions && dimensions.width < 400) {
      setConfigBottom("4vw");
      toggleShowLables(false);
    } else {
      setConfigBottom("20px");
      toggleShowLables(true);
    }
  }, [dimensions]);

  const CenteredMetric = ({ dataWithArc, centerX, centerY }) => {
    return (
      <>
        <text
          x={centerX}
          y={120}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: "70px",
            fontWeight: "600",
          }}
        >
          {data.hay_prod}
        </text>
        <text
          x={centerX}
          y={170}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: configBottom,
            fontWeight: "600",
          }}
        >
          Hay Production
        </text>
      </>
    );
  };

  return (
    <div className="chart-container">
      {values && (
        <ResponsivePie
          key={dimensions && dimensions.width}
          data={values}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          sortByValue={true}
          innerRadius={0.8}
          padAngle={0}
          cornerRadius={0}
          valueFormat={(v) => `${v}%`}
          colors={["#fcd909", "#377931"]}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          radialLabelsSkipAngle={5}
          radialLabelsTextXOffset={4}
          radialLabelsTextColor="#333333"
          radialLabelsLinkOffset={-13}
          radialLabelsLinkDiagonalLength={22}
          radialLabelsLinkHorizontalLength={17}
          radialLabelsLinkColor={{ from: "color" }}
          sliceLabelsRadiusOffset={0.7}
          sliceLabelsSkipAngle={10}
          sliceLabelsTextColor="#333333"
          enableSliceLabels={false}
          enableRadialLabels={showLabels}
          radialLabel={(d) => `${d.id} (${d.formattedValue})`}
          layers={[
            "slices",
            "sliceLabels",
            "radialLabels",
            "legends",
            CenteredMetric,
          ]}
        />
      )}
    </div>
  );
};

export default Cropland;
