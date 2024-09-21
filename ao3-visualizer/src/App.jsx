import React, {
    useState,
    useEffect,
    useRef,
} from "react";
import Heatmap from "./components/Heatmap";
import Boxplot from "./components/Boxplot";
import Voronoi from "./components/Voronoi";
import "./App.css";
import axios from "axios";

function App() {
    const [url, setUrl] = useState("");
    const [list, setList] =
        useState(null);
    const [error, setError] =
        useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
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
            <h1>AO3 Visualizer</h1>
            <form
                className="url"
                onSubmit={handleSubmit}
            >
                <input
                    className="urlInput"
                    type="text"
                    value={url}
                    onChange={(e) =>
                        setUrl(
                            e.target
                                .value
                        )
                    }
                    placeholder="Enter your work page url (like archiveofourown.org/users/Ilsistemaperiodico/yourusername/works):"
                />
                <button
                    className="submit"
                    type="submit"
                >
                    View your works in
                    graphs!
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
