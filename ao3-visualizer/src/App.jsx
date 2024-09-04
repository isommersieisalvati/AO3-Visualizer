import React, {
    useState,
    useEffect,
    useRef,
} from "react";
// import UrlInput from "./components/UrlInput";
// import Heatmap from "./components/Heatmap";
import "./App.css";
import axios from "axios";

function App() {
    const [url, setUrl] = useState(""); // Data to send with POST
    const [getList, setGetList] =
        useState(null); // Data to display after GET
    const [error, setError] =
        useState(null); // Error handling

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Step 1: Send data with POST request
            const postResponse =
                await axios.post(
                    "http://localhost:3001/work-page-url",
                    { url }
                );
            console.log(
                "POST Response:",
                postResponse.data
            );

            setGetList(
                postResponse.data
            );
        } catch (err) {
            setError(err.message); // Handle errors
        }
    };

    console.log(getList);

    return (
        <div>
            <form
                onSubmit={handleSubmit}
            >
                <input
                    type="text"
                    value={url}
                    onChange={(e) =>
                        setUrl(
                            e.target
                                .value
                        )
                    }
                    placeholder="Enter data"
                />
                <button type="submit">
                    Submit
                </button>
            </form>
            {error && (
                <p>Error: {error}</p>
            )}
            {/* {getData && (
                <pre>
                    {JSON.stringify(
                        getData,
                        null,
                        2
                    )}
                </pre>
            )} */}
        </div>
    );
}

export default App;
