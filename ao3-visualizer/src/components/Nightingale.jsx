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
        const data = fandomCount;

        const formattedData =
            Object.entries(data).map(
                ([key, value]) => ({
                    category: key,
                    value: value,
                })
            );

        formattedData.sort(
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
                customScale(
                    d.data.value
                )
            ); // Use custom scaling function

        const pieColors = [
            "#000000",
            "#111111",
            "#222222",
            "#333333",
            "#444444",
            "#F3BAB4",
            "#F6CACA",
            "#4D1B0A",
            "#F3BAB4",
            "#F6CACA",
            "#4D1B0A",
        ];

        // Create color scale
        const colors = d3
            .scaleOrdinal()
            .domain(
                formattedData.map(
                    (d) => d.category
                )
            )
            .range(pieColors);

        // Bind data to pie chart segments
        const path = svg
            .selectAll("path")
            .data(pie(formattedData))
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", (d) =>
                colors(d.data.category)
            );

        // arc.append("text")
        //     .filter(
        //         (d) => d.data.value > 3
        //     ) // Add condition here
        //     .attr(
        //         "transform",
        //         (d) =>
        //             `translate(${arc.centroid(
        //                 d
        //             )})`
        //     )
        //     .attr(
        //         "text-anchor",
        //         "middle"
        //     )
        //     .text(
        //         (d) => d.data.category
        //     )
        //     .style("fill", "white")
        //     .style("font-size", "12px");

        // Add labels
        svg.selectAll("text")
            .data(pie(formattedData))
            .enter()
            .append("text")
            .attr(
                "transform",
                (d) =>
                    `translate(${arc.centroid(
                        d
                    )})`
            )
            .attr("dy", "0.35em")
            .style(
                "text-anchor",
                "middle"
            )
            .style("font-size", "12px")
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
