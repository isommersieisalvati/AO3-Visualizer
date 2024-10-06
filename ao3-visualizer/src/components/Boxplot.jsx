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
        const fixedBoxplotWidth =
            Math.min(
                80,
                500 / data.length
            );
        const paddingBetweenGroups = 20; // Padding between each group
        const numGroups = data.length;

        const margin = {
            top: 20,
            right: 30,
            bottom: 100,
            left: 50,
        };
        const height = 400;
        const totalWidth =
            numGroups *
                (fixedBoxplotWidth +
                    paddingBetweenGroups) +
            margin.left +
            margin.right;

        // Clear the SVG to ensure no overlap
        d3.select(svgRef.current)
            .selectAll("*")
            .remove();

        const svg = d3
            .select(svgRef.current)
            .attr("width", totalWidth)
            .attr("height", height)
            .append("g")
            .attr(
                "transform",
                `translate(${margin.left},${margin.top})`
            );

        // Y scale (vertical for number range)
        const yScale = d3
            .scaleLinear()
            .domain([
                1,
                d3.max(
                    data.flatMap(
                        (d) => d.values
                    )
                ),
            ])
            .range([
                height - margin.bottom,
                margin.top,
            ]);

        // X scale (horizontal for each category with dynamic spacing)
        const xScale = d3
            .scaleBand()
            .domain(
                data.map(
                    (d) => d.category
                )
            ) // Categories
            .range([
                0,
                numGroups *
                    (fixedBoxplotWidth +
                        paddingBetweenGroups),
            ]) // Adjust based on numGroups and fixed width
            .padding(0.2);

        // Add Y axis
        svg.append("g").call(
            d3.axisLeft(yScale)
        );

        // Add X axis
        const xAxis = svg
            .append("g")
            .attr(
                "transform",
                `translate(0, ${
                    height -
                    margin.bottom
                })`
            )
            .call(
                d3.axisBottom(xScale)
            );

        // Add X axis labels with multi-line support (same text wrapping logic as before)
        xAxis
            .selectAll("text")
            .attr(
                "text-anchor",
                "middle"
            )
            .each(function (d) {
                const label =
                    d3.select(this);
                const words =
                    d.split(/\s+/); // Split the label text into words
                let line = [];
                let lineNumber = 0;
                const lineHeight = 1.1; // Line height for tspan elements
                const y =
                    label.attr("y");
                const dy =
                    parseFloat(
                        label.attr("dy")
                    ) || 0;
                let tspan = label
                    .text(null)
                    .append("tspan")
                    .attr("x", 0)
                    .attr("y", y)
                    .attr(
                        "dy",
                        `${dy}em`
                    );

                words.forEach(
                    (word) => {
                        line.push(word);
                        tspan.text(
                            line.join(
                                " "
                            )
                        );
                        if (
                            tspan
                                .node()
                                .getComputedTextLength() >
                            fixedBoxplotWidth *
                                0.9
                        ) {
                            line.pop();
                            tspan.text(
                                line.join(
                                    " "
                                )
                            );
                            line = [
                                word,
                            ];
                            tspan =
                                label
                                    .append(
                                        "tspan"
                                    )
                                    .attr(
                                        "x",
                                        0
                                    )
                                    .attr(
                                        "y",
                                        y
                                    )
                                    .attr(
                                        "dy",
                                        `${
                                            ++lineNumber *
                                                lineHeight +
                                            dy
                                        }em`
                                    )
                                    .text(
                                        word
                                    );
                        }
                    }
                );
            });

        const colors = [
            "#264653",
            "#2a9d8f",
            "#e9c46a",
            "#f4a261",
            "#e76f51",
            "#ec8c74",
        ];

        // Draw the boxplots
        data.forEach((group, i) => {
            const [
                minValue,
                q1,
                median,
                q3,
                maxValue,
            ] = group.values;

            // X position for this group's boxplot (center it on the category band)
            const xPos =
                xScale(group.category) +
                (xScale.bandwidth() -
                    fixedBoxplotWidth) /
                    2;

            // Draw the box (Q1 to Q3)
            svg.append("rect")
                .attr("x", xPos)
                .attr("y", yScale(q3))
                .attr("rx", 2)
                .attr("ry", 2)
                .attr(
                    "width",
                    fixedBoxplotWidth
                )
                .attr(
                    "height",
                    yScale(q1) -
                        yScale(q3)
                ) // Height is the difference between Q1 and Q3
                .attr("stroke", "black")
                .style(
                    "fill",
                    colors[
                        i %
                            colors.length
                    ]
                )
                .attr("opacity", 0.8);

            // Draw the median line
            svg.append("line")
                .attr("x1", xPos)
                .attr(
                    "x2",
                    xPos +
                        fixedBoxplotWidth
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

            // Draw whiskers (min to Q1 and max to Q3)
            svg.append("line")
                .attr(
                    "x1",
                    xPos +
                        fixedBoxplotWidth /
                            2
                )
                .attr(
                    "x2",
                    xPos +
                        fixedBoxplotWidth /
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

            svg.append("line")
                .attr(
                    "x1",
                    xPos +
                        fixedBoxplotWidth /
                            2
                )
                .attr(
                    "x2",
                    xPos +
                        fixedBoxplotWidth /
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

            // Draw min and max whisker ticks
            svg.append("line")
                .attr(
                    "x1",
                    xPos +
                        fixedBoxplotWidth /
                            2 -
                        5
                )
                .attr(
                    "x2",
                    xPos +
                        fixedBoxplotWidth /
                            2 +
                        5
                )
                .attr(
                    "y1",
                    yScale(minValue)
                )
                .attr(
                    "y2",
                    yScale(minValue)
                )
                .attr(
                    "stroke",
                    "black"
                );

            svg.append("line")
                .attr(
                    "x1",
                    xPos +
                        fixedBoxplotWidth /
                            2 -
                        5
                )
                .attr(
                    "x2",
                    xPos +
                        fixedBoxplotWidth /
                            2 +
                        5
                )
                .attr(
                    "y1",
                    yScale(maxValue)
                )
                .attr(
                    "y2",
                    yScale(maxValue)
                )
                .attr(
                    "stroke",
                    "black"
                );
        });

        d3.selectAll("rect")
            .on(
                "mouseover",
                (event, d) => {
                    tooltip
                        .style(
                            "opacity",
                            1
                        )
                        .html(
                            `Median: ${d.median}<br>Q1: ${d.q1}<br>Q3: ${d.q3}`
                        )
                        .style(
                            "left",
                            `${
                                event.pageX +
                                5
                            }px`
                        )
                        .style(
                            "top",
                            `${
                                event.pageY -
                                5
                            }px`
                        );
                }
            )
            .on("mouseout", () =>
                tooltip.style(
                    "opacity",
                    0
                )
            );

        svg.selectAll(
            ".tick line"
        ).remove();
    }, []);

    return (
        Object.values(boxplotFandoms)
            .length > 0 && (
            <svg ref={svgRef}></svg>
        )
    );
};

export default Boxplot;
