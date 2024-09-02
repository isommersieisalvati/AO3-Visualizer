import React, { useState } from "react";
import { getStatistics } from "../utils/dataGetter"; // Adjust the import path as needed

const UrlInput = () => {
    const [url, setUrl] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (url) {
            try {
                const data =
                    await getStatistics(
                        url
                    );
                console.log(
                    "Data received:",
                    data
                );
            } catch (error) {
                console.error(
                    "Error fetching data:",
                    error
                );
            }
        } else {
            console.warn(
                "URL is required"
            );
        }
    };

    return (
        <div>
            <form
                onSubmit={handleSubmit}
            >
                <label>
                    Enter URL:
                    <input
                        type="text"
                        value={url}
                        onChange={(e) =>
                            setUrl(
                                e.target
                                    .value
                            )
                        }
                        placeholder="Enter the URL here"
                    />
                </label>
                <button type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default UrlInput;
