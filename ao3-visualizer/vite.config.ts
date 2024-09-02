import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
    base: "/",
    plugins: [react()],
    esbuild: {
        loader: "tsx", // OR "jsx"
        include: [
            "src/**/*.js",
            "node_modules/**/*.js",
        ],
    },
});
