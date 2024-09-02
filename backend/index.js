import express from "express";
import cors from "cors";
import { getStatistics } from "./dataGetter.js";

const app = express();
const port = 3001;

const data = {};
const url = "";

// Middleware
app.use(cors());
app.use(express.json());

app.get(
    "/work-page-url",
    async (req, res) => {
        try {
            // Fetch data from frontend API
            const response =
                await fetch(
                    "http://localhost:3001/work-page-url"
                );
            url = await response.json();

            res.json({
                success: true,
                data,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
);

app.post(
    "/api/work-list",
    (req, res) => {
        data = getStatistics(url);
        try {
            res.json(data);
        } catch (error) {
            res.status(500).json({
                error: "Failed to process data",
            });
        }
    }
);

app.listen(port, async () => {
    console.log(
        `Server is running on http://localhost:${port}`
    );
});
