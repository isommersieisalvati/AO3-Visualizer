import React from "react";

const Boxplot = (workList) => {
    const works =
        Object.values(workList)[0];

    const kudos = works.map(
        (work) => work[3]
    );

    console.log(kudos);
    return <div>{kudos}</div>;
};

export default Boxplot;
