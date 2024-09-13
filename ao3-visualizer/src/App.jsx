import React, {
    useState,
    useEffect,
    useRef,
} from "react";
// import UrlInput from "./components/UrlInput";
import Heatmap from "./components/Heatmap";
import Boxplot from "./components/Boxplot";
import Voronoi from "./components/Voronoi";
import "./App.css";
import axios from "axios";

function App() {
    const [url, setUrl] = useState(""); // Data to send with POST
    const [list, setList] =
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

            setList(postResponse.data);
        } catch (err) {
            setError(err.message); // Handle errors
        }
    };

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
            {list && (
                <div>
                    {/* <Heatmap
                        workList={
                            list.data
                        }
                    /> */}
                    {/* <Voronoi
                        workList={
                            list.data
                        }
                    /> */}
                    <Boxplot
                        workList={
                            list.data
                        }
                    />
                </div>
            )}
        </div>
    );
}

export default App;
