import React, {
    useRef,
    useEffect,
} from "react";
import * as d3 from "d3";
import { processDates } from "../utils/conversion";

const Heatmap = (workList) => {
    const works =
        Object.values(workList)[0];

    const svgRef = useRef();

    const dates = works.map(
        (work) => work[1]
    );

    const data = processDates(dates);

    useEffect(() => {
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        const years = Array.from(
            new Set(
                data.map((d) => d.year)
            )
        );

        const margin = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
        };
        const gridWidth = 50;
        const gridHeight = 50;
        const width =
            gridWidth * months.length;
        const height =
            gridHeight * years.length;

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

        const xScale = d3
            .scaleBand()
            .domain(months)
            .range([0, width])
            .padding(0.05);

        const yScale = d3
            .scaleBand()
            .domain(years)
            .range([height, 0])
            .padding(0.05);

        const colorScale = d3
            .scaleSequential()
            .interpolator(
                d3.interpolateBlues
            )
            .domain([
                0,
                d3.max(
                    data,
                    (d) => d.count
                ),
            ]);

        svg.selectAll()
            .data(
                data,
                (d) =>
                    `${d.month}:${d.year}`
            )
            .enter()
            .append("rect")
            .attr("x", (d) =>
                xScale(d.month)
            )
            .attr("y", (d) =>
                yScale(d.year)
            )
            .attr(
                "width",
                xScale.bandwidth()
            )
            .attr(
                "height",
                yScale.bandwidth()
            )
            .attr("width", gridWidth) // Ensure uniform grid width
            .attr("height", gridHeight) // Ensure uniform grid height
            .style("fill", (d) =>
                colorScale(d.count)
            );

        svg.append("g")
            .attr(
                "transform",
                `translate(0,${height})`
            )
            .call(
                d3.axisBottom(xScale)
            );

        svg.append("g").call(
            d3.axisLeft(yScale)
        );
    }, [data]);

    return (
        <div>
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default Heatmap;
