import React from "react";

const Heatmap = (workList) => {
    const works =
        Object.values(workList)[0];

    const dates = works.map(
        (work) => work[1]
    );

    console.log(dates);
    return <div>Heatmap:</div>;
};

export default Heatmap;
