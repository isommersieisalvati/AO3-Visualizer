import React, {
    useState,
    useEffect,
    useRef,
} from "react";
import UrlInput from "./components/UrlInput";
import Heatmap from "./components/Heatmap";
import "./App.css";
import axios from "axios";

function App() {
    const [data, setData] =
        useState(null);
    const dataRef = useRef(data);

    let response;

    useEffect(() => {
        const fetchData = async () => {
            try {
                response = await axios
                    .get(
                        "http://localhost:3001/work-list"
                    )
                    .then();
                setData(response.data);
                console.log(
                    dataRef.current
                );
            } catch (error) {
                console.error(
                    "Error fetching data:",
                    error
                );
            }
        };

        fetchData();
    }, [dataRef]);

    console.log("worklist", data);

    return (
        <div className="App">
            <h1>URL Fetcher</h1>
            <UrlInput />

            {/* <Heatmap list={data} /> */}
        </div>
    );
}

export default App;
