import React, { useState, useEffect } from "react";
import { ResponsivePie } from "@nivo/pie";

const Cropland = ({ pie, dimensions }) => {
  const [configBottom, setConfigBottom] = useState("20px");
  const [showLabels, toggleShowLabels] = useState(true);
  if (pie && pie.data) {
    const { data } = pie;
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
      toggleShowLabels(false);
    } else {
      setConfigBottom("20px");
      toggleShowLabels(true);
    }
  }, [dimensions]);

  const CenteredMetric = ({ centerX }) => {
    const { data } = pie;
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
      {pie && values && (
        <ResponsivePie
          key={dimensions && dimensions.width}
          data={values}
          margin={{ top: 20, right: 20, bottom: 25, left: 20 }}
          sortByValue={true}
          innerRadius={0.8}
          padAngle={0}
          cornerRadius={0}
          valueFormat={(v) => `${v}%`}
          colors={pie.config ? pie.config : { scheme: "nivo" }}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          arcLabelsSkipAngle={5}
          arcLabelsTextXOffset={4}
          arcLabelsTextColor="#333333"
          arcLabelsLinkOffset={-13}
          arcLabelsLinkDiagonalLength={22}
          arcLabelsLinkHorizontalLength={17}
          arcLabelsLinkColor={{ from: "color" }}
          arcLabelsRadiusOffset={0.7}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          enableArcLabels={false}
          enableRadialLabels={showLabels}
          arcLinkLabel={(d) => `${d.id} (${d.formattedValue})`}
          layers={[
            "arcLinkLabels",
            "arcs",
            "arcLabels",
            "legends",
            CenteredMetric,
          ]}
        />
      )}
    </div>
  );
};

export default Cropland;
