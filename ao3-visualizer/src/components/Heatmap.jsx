import React, {
    useRef,
    useEffect,
} from "react";
import * as d3 from "d3";
import { processDates } from "../utils/conversion";
import "./Heatmap.css";

const Heatmap = (workList) => {
    const works =
        Object.values(workList)[0];

    const svgRef = useRef();

    const dates = works.map(
        (work) => work[1]
    );

    const data = processDates(dates);
    const highest = data.reduce(
        (max, item) =>
            item.count > max.count
                ? item
                : max,
        data[0]
    );

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
                data.map((d) => +d.year)
            )
        );

        const margin = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 40,
        };

        let gridHeight =
            years.length > 10 ? 30 : 40;

        let gridWidth = gridHeight;

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
            .style("padding", "36px")
            .attr(
                "transform",
                `translate(${margin.left},${margin.top})`
            );

        svg.selectAll("*").remove();

        const colorScale = d3
            .scaleSequential()
            .interpolator(
                d3.interpolateRgbBasis([
                    "#f0f0f0",
                    "#f2efbb",
                    "#C5D86D",
                    "#82AA57",
                    "#618943",
                ])
            )
            .domain([
                0,
                d3.max(
                    data,
                    (d) => d.count
                ),
            ]);

        let x = d3
            .scaleBand()
            .range([0, width])
            .domain(months)
            .padding(0.08);

        svg.append("g")
            .attr(
                "transform",
                "translate(0," +
                    height +
                    ")"
            )
            .call(d3.axisBottom(x))
            .select(".domain")
            .remove();

        let y = d3
            .scaleBand()
            .range([height, 0])
            .domain(years)
            .padding(0.08);

        svg.append("g")
            .call(d3.axisLeft(y))
            .select(".domain")
            .remove();

        svg.selectAll(
            ".tick line"
        ).remove();

        svg.selectAll(".cell")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "cell")
            .attr("x", (d) =>
                x(d.month)
            )
            .attr("y", (d) => y(d.year))
            .attr(
                "width",
                x.bandwidth()
            )
            .attr(
                "height",
                y.bandwidth()
            )
            .attr("rx", "5px")
            .attr("ry", "5px")
            .style("fill", (d) =>
                colorScale(d.count)
            )
            .attr("opacity", 0.75);
    }, [data]);

    return (
        <div className="heatmap">
            <div className="graph">
                <svg ref={svgRef}></svg>
            </div>
            <div className="text">
                In {highest.month}{" "}
                {highest.year} you
                created {highest.count}{" "}
                fanworks! What a
                productive month!
            </div>
        </div>
    );
};

export default Heatmap;
