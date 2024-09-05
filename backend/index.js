import express from "express";
import cors from "cors";
import { getStatistics } from "./dataGetter.js";

const app = express();
const port = 3001;

let data = {};
let currentUrl = "";

// Middleware
app.use(cors());
app.use(express.json());

app.post(
    "/work-page-url",
    async (req, res) => {
        try {
            // Fetch data from frontend API
            const url = req.body.url;
            currentUrl = url;
            console.log(currentUrl);
            data = await getStatistics(
                currentUrl
            );
            // console.log(data);
            res.json({
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

app.get(
    "/work-list",
    async (req, res) => {
        try {
            console.log(
                "work list",
                data
            );
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
