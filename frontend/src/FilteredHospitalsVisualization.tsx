import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

interface Hospital {
  name: string;
  lat: number;
  lng: number;
  distance: number;
  suggestiveFactor: number;
  beds: number;
  patients: number;
  staff: number;
  trauma: number;
  helipad: number;
}

interface Props {
  hospitals: Hospital[];
  maxDistance: number;
}

const HospitalRadialChart: React.FC<Props> = ({ hospitals, maxDistance }) => {
  const [recommendedHospital, setRecommendedHospital] = useState<Hospital | null>(null);

  // Function to calculate recommendation score
  const calculateRecommendation = (hospital: Hospital, weightDistance = 0.5, weightSuggestiveFactor = 0.5) => {
    const { suggestiveFactor, distance } = hospital;
    return (weightSuggestiveFactor * suggestiveFactor) + (weightDistance * (1 / distance));
  };

  useEffect(() => {
    const width = 700, height = 550;  // Adjusted for a slightly more rectangular shape
    const svg = d3.select("#radial-chart")
      .attr("width", width)
      .attr("height", height)
      .style("background-color", "#f9f9f9")
      .style("border-radius", "15px")
      .style("padding", "40px 15px")
      .style("box-shadow", "0 4px 12px rgba(0, 0, 0, 0.1)");

    // Clear previous content
    svg.selectAll("*").remove();

    const radiusScale = d3.scaleLinear()
      .domain([0, maxDistance])
      .range([0, Math.min(width, height) / 2 - 40]);

    const colorScale = d3.scaleSequential<string>()
      .domain([1, 10])  // Adjusted for suggestive factor from 1 to 10
      .interpolator(d3.interpolateRdYlGn);

      const angleScale = d3.scaleLinear()
      .domain([0, hospitals.length - 1])  // Correct domain to map indices correctly
      .range([0, 2 * Math.PI]);  // Full circle (0 to 2π radians)
    
    const g = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Add a central circle in the chart
    g.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 5)
      .attr("fill", "black");

    // Calculate the recommended hospital
    const recommended = hospitals.reduce((best, hospital) => {
      const score = calculateRecommendation(hospital);
      return !best || score > calculateRecommendation(best) ? hospital : best;
    }, null as Hospital | null);

    setRecommendedHospital(recommended);
    
    hospitals.forEach((hospital, index) => {
      const angle = angleScale(index);
      const distance = radiusScale(hospital.distance);
      const color = colorScale(hospital.suggestiveFactor);

      const x = distance * Math.cos(angle);
      const y = distance * Math.sin(angle);

      const tooltip = d3.select("#radial-chart-tooltip");

      const isRecommended = recommended && hospital.name === recommended.name;

      g.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", isRecommended ? 12 : 8)
        .attr("fill", color)
        .attr("stroke", isRecommended ? "blue" : "black")
        .attr("stroke-width", isRecommended ? 3 : 1)
        .style("box-shadow", isRecommended ? "0 0 15px rgba(0, 0, 255, 0.4)" : "none")
        .on("mouseover", function (event) {
          d3.select(this).attr("stroke-width", 3);
          tooltip
            .style("opacity", 1)
            .html(`
              <strong>${hospital.name}</strong><br>
              Distance: ${hospital.distance.toFixed(1)} km<br>
              Suggestive Factor: ${hospital.suggestiveFactor.toFixed(2)}
            `)
            .style("left", event.pageX + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mousemove", function (event) {
          tooltip
            .style("left", event.pageX + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", function () {
          d3.select(this).attr("stroke-width", isRecommended ? 3 : 1);
          tooltip.style("opacity", 0);
        });
    });

    // Add radial grid lines (for distances)
    const distanceSteps = 5;
    const radiusStep = radiusScale(maxDistance) / distanceSteps;
    for (let i = 1; i <= distanceSteps; i++) {
      g.append("circle")
        .attr("r", radiusStep * i)
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("stroke-dasharray", "3,3");

      g.append("text")
        .attr("x", radiusStep * i)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .style("font-family", "Arial")
        .style("font-size", "10px")
        .text((maxDistance / distanceSteps) * i + " km");
    }

    // Add color legend, now at the bottom-right of the chart
    const legendData = [1, 5, 10];  // Adjusted for the 1-10 suggestive factor scale
    const legend = svg.append("g")
      .attr("transform", `translate(${width - 150}, ${height - 100})`);  // Move legend to the bottom-right

    legendData.forEach((d, i) => {
      legend.append("circle")
        .attr("cx", 0)
        .attr("cy", i * 30)
        .attr("r", 10)
        .attr("fill", colorScale(d));

      legend.append("text")
        .attr("x", 20)
        .attr("y", i * 30 + 5)
        .style("font-family", "Arial")
        .style("font-size", "12px")
        .text(`Suggestive Factor: ${d}`);
    });

  }, [hospitals, maxDistance]);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', paddingLeft: '50px' ,marginTop: '30px'}}>
        <svg id="radial-chart"></svg>
      </div>
      <div
        id="radial-chart-tooltip"
        style={{
          position: "absolute",
          textAlign: "center",
          width: "150px",
          padding: "5px",
          font: "12px sans-serif",
          background: "lightsteelblue",
          border: "0px",
          borderRadius: "8px",
          pointerEvents: "none",
          opacity: 0
        }}
      ></div>

      {recommendedHospital && (
        <div style={{ marginTop: "20px", textAlign: "center", fontFamily: "Arial", fontSize: "18px", padding: "20px 0" }}>
          <h3 style={{ color: '#2c3e50', fontSize: '24px', fontWeight: 'bold' }}>
            Recommended Hospital: {recommendedHospital.name}
          </h3>
          <p style={{ color: '#34495e', fontSize: '16px' }}>
            Based on distance and suggestive factor.
          </p>
        </div>
      )}
    </>
  );
};

export default HospitalRadialChart;
