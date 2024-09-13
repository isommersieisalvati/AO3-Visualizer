import React from "react";
import { reduceToFandoms } from "../utils/conversion";

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

    const boxplotFandom = Object.values(
        fandomsDesc
            .slice(0, 5)
            .map(([key]) => key)
    );

    const checkFandom = (work) => {
        const fandoms = work[2].flat();
        let set1 = new Set(fandoms);
        let set2 = new Set(
            boxplotFandom
        );

        return (
            [...set1].filter((value) =>
                set2.has(value)
            ).length > 0
        );
    };

    const boxplotWorks = works.filter(
        checkFandom
    );

    return <div>Boxplot</div>;
};

export default Boxplot;
