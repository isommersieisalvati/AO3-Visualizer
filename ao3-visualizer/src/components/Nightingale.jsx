import React, {
    useRef,
    useEffect,
} from "react";
import * as d3 from "d3";
import {
    reduceToFandoms,
    lineFandom,
} from "../utils/conversion";
import "./Nightingale.css";

const Nightingale = (workList) => {
    const works =
        Object.values(workList)[0];

    let fandomCount =
        reduceToFandoms(works);

    const largestFandom = Object.keys(
        fandomCount
    )[0];

    // console.log(typeof fandomCount);

    const linedFandom =
        Object.fromEntries(
            Object.entries(
                fandomCount
            ).map(([key, value]) => {
                const newKey =
                    lineFandom(key); // Modify the key here
                return [newKey, value]; // Return the new key-value pair
            })
        );

    console.log(linedFandom);

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
            "#1f77b4", // Blue
            "#ff7f0e", // Orange
            "#2ca02c", // Green
            "#d62728", // Red
            "#9467bd", // Purple
            "#8c564b", // Brown
            "#e377c2", // Pink
            "#7f7f7f", // Gray
            "#bcbd22", // Yellow-green
            "#17becf", // Cyan
        ];

        // Map categories to the color pallette
        const colors = d3
            .scaleOrdinal(
                d3.schemeCategory10
            )
            .domain(
                data.map(
                    (d) => d.category
                )
            );
        // .range(
        //     d3.scaleOrdinal(
        //         d3.schemeCategory8
        //     )
        // );

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
            )
            .attr("stroke", "#778899	")
            .attr("stroke-width", "1px")
            .attr("opacity", 0.8);

        const slice = Object.keys(
            fandomCount
        ).length;

        console.log(slice);

        // The angle threshold to show the text label
        const angleThreshold =
            Math.PI / slice;

        const filteredLabels =
            arcs.filter((d) => {
                const angleDifference =
                    d.endAngle -
                    d.startAngle;
                return (
                    angleDifference <
                    angleThreshold
                );
            });

        const labels = Object.values(
            filteredLabels
        )[0][0][0];

        console.log(labels);

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
                (d) =>
                    d.data.category +
                    "\n(" +
                    d.data.value +
                    ")"
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
