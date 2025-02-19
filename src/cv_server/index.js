import express from "express";
import cors from "cors";
import config from "./config/config.js";
import routes from "./routes/routes.js"

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(202).send("Successful response")
});

app.use('/cv/start', routes)

// Start the backend server
app.listen(config.port, () =>
    console.log(`Server is live at ${config.hostUrl}`)
);

export default app;