import React from "react";
import {
    reduceToFandoms,
    boxplotCaculator,
    checkFandom,
} from "../utils/conversion";

const Boxplot = (workList) => {
    const works =
        Object.values(workList)[0];

    const fandoms =
        reduceToFandoms(works);

    const fandomsDesc = Object.entries(
        fandoms
    ).sort(
        ([, valueA], [, valueB]) =>
            valueB - valueA
    );

    const boxplotFandom = new Seet(
        Object.values(
            fandomsDesc
                .slice(0, 5)
                .map(([key]) => key)
        )
    );

    const boxplotWorks = works.filter(
        checkFandom
    );

    console.log(
        boxplotCaculator(
            boxplotWorks,
            boxplotFandom
        )
    );

    return <div>Boxplot</div>;
};

export default Boxplot;
