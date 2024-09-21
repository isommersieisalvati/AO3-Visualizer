import React, {
    useEffect,
    useRef,
} from "react";
import {
    reduceToFandoms,
    boxplotCaculator,
} from "../utils/conversion";
import * as d3 from "d3";

const Boxplot = (workList) => {
    const svgRef = useRef();
    const works =
        Object.values(workList)[0];

    let fandoms =
        reduceToFandoms(works);

    let boxplotFandoms =
        Object.fromEntries(
            Object.entries(
                fandoms
            ).filter(
                ([key, value]) =>
                    value >= 10
            )
        );

    let data = boxplotCaculator(
        works,
        boxplotFandoms
    );

    useEffect(() => {
        const width = 500;
        const height = 400;
        const margin = {
            top: 20,
            right: 30,
            bottom: 40,
            left: 50,
        };

        // Clear the SVG
        d3.select(svgRef.current)
            .selectAll("*")
            .remove();

        // Create an SVG container
        const svg = d3
            .select(svgRef.current)
            .attr(
                "width",
                width +
                    margin.left +
                    margin.right
            )
            .attr(
                "height",
                height +
                    margin.top +
                    margin.bottom
            )
            .append("g")
            .attr(
                "transform",
                `translate(${margin.left},${margin.top})`
            );

        // Y scale (vertical for the number range)
        const yScale = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(
                    data.flatMap((d) =>
                        d.values.filter(
                            (v) =>
                                v !==
                                null
                        )
                    )
                ),
            ])
            .range([height, 0]); // Values go from bottom (0) to top (max)

        // X scale (horizontal for each category)
        const xScale = d3
            .scaleBand()
            .domain(
                data.map(
                    (d) => d.category
                )
            )
            .range([0, width])
            .padding(0.2); // Space between the groups

        // Add Y axis (on the left with numbers)
        svg.append("g").call(
            d3.axisLeft(yScale)
        );

        // Add X axis (on the bottom with category names)
        svg.append("g")
            .attr(
                "transform",
                `translate(0, ${height})`
            ) // Move axis to the bottom
            .call(
                d3.axisBottom(xScale)
            );

        // Loop through each group and draw a boxplot
        data.forEach((group) => {
            // Filter out null values for this group
            const filteredValues =
                group.values.filter(
                    (v) => v !== null
                );

            // Calculate quartiles, median, min, and max
            const q1 = d3.quantile(
                filteredValues,
                0.25
            );
            const median = d3.quantile(
                filteredValues,
                0.5
            );
            const q3 = d3.quantile(
                filteredValues,
                0.75
            );
            const minValue = d3.min(
                filteredValues
            );
            const maxValue = d3.max(
                filteredValues
            );

            // X position for this group's boxplot
            const xPos = xScale(
                group.category
            );

            // Draw the box (from Q1 to Q3)
            svg.append("rect")
                .attr("x", xPos)
                .attr("y", yScale(q3)) // Top of the box is at Q3
                .attr(
                    "width",
                    xScale.bandwidth()
                )
                .attr(
                    "height",
                    yScale(q1) -
                        yScale(q3)
                ) // Height is the difference between Q3 and Q1
                .attr("stroke", "black")
                .attr(
                    "fill",
                    "#69b3a2"
                );

            // Draw median line
            svg.append("line")
                .attr("x1", xPos)
                .attr(
                    "x2",
                    xPos +
                        xScale.bandwidth()
                )
                .attr(
                    "y1",
                    yScale(median)
                )
                .attr(
                    "y2",
                    yScale(median)
                )
                .attr(
                    "stroke",
                    "black"
                );

            // Draw min line
            svg.append("line")
                .attr(
                    "x1",
                    xPos +
                        xScale.bandwidth() /
                            2
                ) // Center it on the box
                .attr(
                    "x2",
                    xPos +
                        xScale.bandwidth() /
                            2
                )
                .attr(
                    "y1",
                    yScale(minValue)
                )
                .attr("y2", yScale(q1))
                .attr(
                    "stroke",
                    "black"
                );

            // Draw max line
            svg.append("line")
                .attr(
                    "x1",
                    xPos +
                        xScale.bandwidth() /
                            2
                )
                .attr(
                    "x2",
                    xPos +
                        xScale.bandwidth() /
                            2
                )
                .attr(
                    "y1",
                    yScale(maxValue)
                )
                .attr("y2", yScale(q3))
                .attr(
                    "stroke",
                    "black"
                );
        });
    }, []);

    return <svg ref={svgRef}></svg>;
};

export default Boxplot;
