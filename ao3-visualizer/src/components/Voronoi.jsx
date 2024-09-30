import React, {
    useRef,
    useEffect,
} from "react";
import * as d3 from "d3";
import { reduceToFandoms } from "../utils/conversion";
import "./Voronoi.css";

const Voronoi = (workList) => {
    const works =
        Object.values(workList)[0];

    let fandomCount =
        reduceToFandoms(works);

    const largestFandom = Object.keys(
        fandomCount
    )[0];

    const svgRef = useRef();
    useEffect(() => {
        const data = {
            name: "root",
            children: Object.entries(
                fandomCount
            ).map((d) => ({
                name: d[0],
                value: d[1],
            })),
        };

        const width = 400;
        const height = 400;

        const root = d3
            .hierarchy(data)
            .sum((d) => d.value)
            .sort(
                (a, b) =>
                    b.value - a.value
            );

        const treemapLayout = d3
            .treemap()
            .size([width, height]);

        treemapLayout(root); // Apply the layout to the root node

        // Compute the radius of the circular mask
        const radius =
            Math.min(width, height) / 2;

        // Select the SVG container and clear previous content
        const svg = d3.select(
            svgRef.current
        );
        svg.selectAll("*").remove();

        // Create a group for the circular boundary
        const g = svg
            .append("g")
            .attr(
                "transform",
                `translate(${
                    width / 2
                },${height / 2})`
            );

        // Define the circular clipping path
        g.append("clipPath")
            .attr(
                "id",
                "circular-treemap"
            )
            .append("circle")
            .attr("r", radius)
            .attr("cx", 0)
            .attr("cy", 0);

        // Create a group that will be clipped by the circular mask
        const nodes = g
            .append("g")
            .attr(
                "clip-path",
                "url(#circular-treemap)"
            )
            .selectAll("rect")
            .data(root.leaves())
            .enter()
            .append("rect")
            .attr(
                "x",
                (d) => d.x0 - width / 2
            ) // Center the treemap
            .attr(
                "y",
                (d) => d.y0 - height / 2
            )
            .attr(
                "width",
                (d) => d.x1 - d.x0
            )
            .attr(
                "height",
                (d) => d.y1 - d.y0
            )
            .attr(
                "fill",
                (d, i) =>
                    d3.schemeCategory10[
                        i % 10
                    ]
            );

        // Add text label for each circle
        nodes.each((d) => {
            const node = d3.select(
                this.parentNode
            );
            node.append("text")
                .attr(
                    "x",
                    d.x0 -
                        width / 2 +
                        (d.x1 - d.x0) /
                            2
                )
                .attr(
                    "y",
                    d.y0 -
                        height / 2 +
                        (d.y1 - d.y0) /
                            2
                )
                .attr(
                    "text-anchor",
                    "middle"
                )
                .attr("dy", "0.35em")
                .text(d.data.name)
                .style("fill", "white")
                .style(
                    "font-size",
                    Math.min(
                        (d.x1 - d.x0) /
                            5,
                        14
                    )
                ); // Adjust font size
        });

        // Draw the circular boundary
        g.append("circle")
            .attr("r", radius)
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("fill", "none");
    }, [fandomCount]);

    return (
        <div className="voronoi">
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
                <svg
                    ref={svgRef}
                    viewBox={`0 0 400 400`}
                    preserveAspectRatio="xMidYMid meet"
                ></svg>
            </div>
        </div>
    );
};

export default Voronoi;
