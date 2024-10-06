import React from "react";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";

const Export = ({
    containerRef,
    fileName = "dataviz.jpg",
}) => {
    const handleExport = () => {
        if (containerRef.current) {
            toPng(
                containerRef.current,
                { quality: 0.95 }
            )
                .then((dataUrl) => {
                    saveAs(
                        dataUrl,
                        fileName
                    );
                })
                .catch((error) => {
                    console.error(
                        "Export failed:",
                        error
                    );
                });
        } else {
            console.error(
                "Container ref is not defined"
            );
        }
    };

    return (
        <button
            onClick={handleExport}
            style={{ marginTop: 20 }}
        >
            Export as JPG
        </button>
    );
};

export default Export;
