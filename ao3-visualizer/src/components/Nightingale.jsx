import React, {
    useRef,
    useEffect,
} from "react";
import * as d3 from "d3";
import { reduceToFandoms } from "../utils/conversion";
import "./Nightingale.css";

const Nightingale = (workList) => {
    const works =
        Object.values(workList)[0];

    let fandomCount =
        reduceToFandoms(works);

    const largestFandom = Object.keys(
        fandomCount
    )[0];

    const svgRef = useRef();
    useEffect(() => {
        const rawData = fandomCount;

        const data = Object.entries(
            rawData
        ).map(([key, value]) => ({
            category: key,
            value: value,
        }));

        data.sort(
            (a, b) => a.value - b.value
        );

        // Set up chart dimensions
        const width = 500;
        const height = 500;
        const radius =
            Math.min(width, height) / 2;

        // Clear any existing SVG content before re-rendering
        d3.select(svgRef.current)
            .selectAll("*")
            .remove();

        // Select the SVG element and clear any existing content
        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr(
                "transform",
                `translate(${
                    width / 2
                }, ${height / 2})`
            );

        // Define a pie layout
        const pie = d3
            .pie()
            .sort(null)
            .value((d) => d.value);

        // Create relatively balanced pie slices
        const customScale = (value) => {
            return (
                (radius *
                    value ** 0.1) /
                2
            );
        };

        // Create arcs with variable outer radius based on the custom scaling function
        const arc = d3
            .arc()
            .innerRadius(0)
            .outerRadius((d) =>
                customScale(d.value)
            );

        const pieColors = [
            "#00296b",
            "#62b6cb",
            "#c1d3fe",
            "#b388eb",
            "#ff6392",
        ];

        // Map categories to the color pallette
        const colors = d3
            .scaleOrdinal()
            .domain(
                data.map(
                    (d) => d.category
                )
            )
            .range(pieColors);

        const arcs = svg
            .selectAll("arc")
            .data(pie(data))
            .enter()
            .append("g")
            .attr("class", "arc");

        // Draw slices and set different colors for each slice
        arcs.append("path")
            .attr("d", arc)
            .attr("fill", (d) =>
                colors(d.data.category)
            );

        // The angle threshold to show the text label
        const angleThreshold =
            Math.PI / 10;

        arcs.filter(
            (d) =>
                d.endAngle -
                    d.startAngle >
                angleThreshold
        )
            .append("text")
            .attr(
                "transform",
                (d) =>
                    `translate(${arc.centroid(
                        d
                    )})`
            )
            .attr(
                "text-anchor",
                "middle"
            )
            .style("font-size", "8px")
            .text(
                (d) => d.data.category
            );
    }, [fandomCount]);

    return (
        <div className="nightingale">
            <div className="text">
                You created{" "}
                {
                    fandomCount[
                        largestFandom
                    ]
                }{" "}
                fanworks for{" "}
                {largestFandom} in
                total, and you really
                love this fandom!
            </div>
            <div
                className="graph"
                style={{
                    position:
                        "relative",
                }}
            >
                <svg ref={svgRef}></svg>
            </div>
        </div>
    );
};

export default Nightingale;
