import React, {
    useState,
    useEffect,
    useRef,
} from "react";
import Heatmap from "./components/Heatmap";
import Boxplot from "./components/Boxplot";
import Nightingale from "./components/Nightingale";
import Loading from "./components/Loading";
import Export from "./components/Export";
import "./App.css";
import axios from "axios";

function App() {
    const [url, setUrl] = useState("");
    const [list, setList] =
        useState(null);
    const [error, setError] =
        useState(null);
    const [loading, setLoading] =
        useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

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
                    placeholder="Enter your work page url (like archiveofourown.org/users/yourusername/works):"
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

            {list == null &&
                loading && <Loading />}

            {list && (
                <div className="graph">
                    <Heatmap
                        workList={
                            list.data
                        }
                    />
                    <Nightingale
                        workList={
                            list.data
                        }
                    />
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
