import React from "react";
import "./Loading.css";

const Loading = () => {
    return (
        <div className="loading">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 200 200"
                className="bouncing"
            >
                <rect
                    fill="#FFF"
                    width="100%"
                    height="100%"
                />
                <circle
                    fill="#00537A"
                    stroke="#00537A"
                    stroke-width="15"
                    r="15"
                    cx="40"
                    cy="65"
                >
                    <animate
                        attributeName="cy"
                        calcMode="spline"
                        dur="2"
                        values="65;135;65;"
                        keySplines=".5 0 .5 1;.5 0 .5 1"
                        repeatCount="indefinite"
                        begin="-.4"
                    ></animate>
                </circle>
                <circle
                    fill="#00537A"
                    stroke="#00537A"
                    stroke-width="15"
                    r="15"
                    cx="100"
                    cy="65"
                >
                    <animate
                        attributeName="cy"
                        calcMode="spline"
                        dur="2"
                        values="65;135;65;"
                        keySplines=".5 0 .5 1;.5 0 .5 1"
                        repeatCount="indefinite"
                        begin="-.2"
                    ></animate>
                </circle>
                <circle
                    fill="#00537A"
                    stroke="#00537A"
                    strokeWidth="15"
                    r="15"
                    cx="160"
                    cy="65"
                >
                    <animate
                        attributeName="cy"
                        calcMode="spline"
                        dur="2"
                        values="65;135;65;"
                        keySplines=".5 0 .5 1;.5 0 .5 1"
                        repeatCount="indefinite"
                        begin="0"
                    ></animate>
                </circle>
            </svg>
            <div className="text">
                You have created so many
                fanworks that it might
                take a while to show the
                graphs!
            </div>
        </div>
    );
};

export default Loading;
