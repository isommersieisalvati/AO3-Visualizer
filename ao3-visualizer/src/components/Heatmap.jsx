import React from "react";

const Heatmap = (list) => {
    return (
        <div>
            {JSON.stringify(
                list,
                null,
                2
            )}
        </div>
    );
};

export default Heatmap;
