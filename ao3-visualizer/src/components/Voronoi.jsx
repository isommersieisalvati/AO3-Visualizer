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

    // Create a dictionary to count the occurrences of each item
    const fandomCount =
        reduceToFandoms(works);

    const largestFandom = Object.keys(
        fandomCount
    ).reduce((a, b) =>
        fandomCount[a] > fandomCount[b]
            ? a
            : b
    );

    const svgRef = useRef();
    useEffect(() => {
        const points = Object.keys(
            fandomCount
        ).map((key, index) => ({
            key: key,
            count: fandomCount[key],
            angle:
                (index /
                    Object.keys(
                        fandomCount
                    ).length) *
                Math.PI *
                2,
        }));

        const width = 500;
        const height = 500;
        const radius = width / 2;

        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [
                0,
                0,
                width,
                height,
            ]);

        // Scale the distance from the center based on count
        const countScale = d3
            .scaleLinear()
            .domain([
                d3.min(
                    points,
                    (d) => d.count
                ),
                d3.max(
                    points,
                    (d) => d.count
                ),
            ])
            .range([
                radius / 4,
                radius,
            ]);

        // Adjust x, y coordinates based on count
        points.forEach((point) => {
            const r = countScale(
                point.count
            ); // Get radius based on count
            point.x =
                width / 2 +
                r *
                    Math.cos(
                        point.angle
                    ); // Polar to Cartesian
            point.y =
                height / 2 +
                r *
                    Math.sin(
                        point.angle
                    ); // Polar to Cartesian
        });

        // Voronoi layout
        const voronoi =
            d3.Delaunay.from(
                points.map((d) => [
                    d.x,
                    d.y,
                ])
            ).voronoi([
                0,
                0,
                width,
                height,
            ]);

        // Clear any existing content
        svg.selectAll("*").remove();

        // Create a circular clipping path
        svg.append("defs")
            .append("clipPath")
            .attr("id", "circle-clip")
            .append("circle")
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .attr("r", radius);

        // Group to hold the Voronoi cells
        const g = svg
            .append("g")
            .attr(
                "clip-path",
                "url(#circle-clip)"
            );

        // Draw each cell and clip it to fit inside the circle
        g.selectAll("path")
            .data(points)
            .enter()
            .append("path")
            .attr("class", "cell")
            .attr("d", (d, i) =>
                voronoi.renderCell(i)
            )
            .attr("fill", (d, i) =>
                d3.interpolateSpectral(
                    i / points.length
                )
            ) // Color based on index
            .attr("stroke", "#000");

        // Draw the circle boundary
        svg.append("circle")
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .attr("r", radius)
            .attr("fill", "none")
            .attr("stroke", "#000");

        // Add labels (key and count)
        const labels = svg
            .selectAll("g.label")
            .data(points)
            .enter()
            .append("g")
            .attr("class", "label")
            .attr(
                "transform",
                (d) =>
                    `translate(${d.x},${d.y})`
            );

        // Add the key (item name) above
        labels
            .append("text")
            .attr("dy", -5)
            .text((d) => d.key)
            .attr("font-size", "12px")
            .attr("fill", "#000")
            .attr(
                "text-anchor",
                "middle"
            );

        // Add the count number below the key
        labels
            .append("text")
            .attr("dy", 15) // Position count below the key
            .text((d) => d.count)
            .attr("font-size", "12px")
            .attr("fill", "#000")
            .attr(
                "text-anchor",
                "middle"
            );
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
            <div className="graph">
                <svg ref={svgRef}></svg>
            </div>
        </div>
    );
};

export default Voronoi;
