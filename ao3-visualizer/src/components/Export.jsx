import React from "react";
import html2canvas from "html2canvas";

const Export = ({ graphRef }) => {
    const exportGraphs = async () => {
        if (!graphRef.current) return;

        // Capture the entire container with all graphs
        const canvas =
            await html2canvas(
                graphRef.current
            );

        // Convert the canvas to an image
        const image = canvas.toDataURL(
            "image/png"
        );
        const link =
            document.createElement("a");
        link.href = image;
        link.download =
            "visualization.png";
        link.click();
    };

    return (
        <div>
            <button
                onClick={exportGraphs}
            >
                Export All as Single
                Image
            </button>
        </div>
    );
};

export default Export;
