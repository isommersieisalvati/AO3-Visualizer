import React, { useState } from "react";
import axios from "axios";

const UrlInput = (
    {
        // sendListToApp,
    }
) => {
    const [url, setUrl] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (url) {
            try {
                await axios
                    .post(
                        "http://localhost:3001/work-page-url",
                        { url }
                    )
                    .then(
                        (response) => {
                            console.log(
                                response
                            );
                        }
                    );
            } catch (error) {
                console.error(
                    "Error creating data:",
                    error
                );
            }
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
