import React from "react";
import {
    reduceToFandoms,
    boxplotCaculator,
} from "../utils/conversion";

const Boxplot = (workList) => {
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

    const kudosBoxplot =
        boxplotCaculator(
            works,
            boxplotFandoms
        );

    console.log(kudosBoxplot);

    return (
        <div>
            <h1>Boxplot</h1>
        </div>
    );
};

export default Boxplot;
