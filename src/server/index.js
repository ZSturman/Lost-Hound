import express from "express";
import swaggerUI from "swagger-ui-express";
import swaggerSpec from "./swagger.js";
import cors from "cors";
import config from "./config/config.js";
import accountRoute from "./routes/accountRoute.js";
import lostPetRoute from "./routes/lostPetRoute.js";
import spottedPetRoute from "./routes/spottedPetRoute.js";
import postsRoute from "./routes/postsRoute.js";
import otpRoute from "./routes/otpRoute.js";
import messageRoute from "./routes/messageRoute.js";
import bodyParser from "body-parser";

const app = express();
// const upload = multer({ dest: 'uploads/' }); // Temporary folder to store files

// Serve Swagger documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Middleware setup
app.use(cors());
app.use(bodyParser.json({ limit: "100mb" })); // setting upload limit to 100mb maximum for express
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true })); // setting upload limit to 100mb maximum for express
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Successful response");
});

app.use("/api/account", accountRoute);
app.use("/api/posts", postsRoute);
app.use("/api/lostPet", lostPetRoute);
app.use("/api/spottedPet", spottedPetRoute);
app.use("/api/account/register", otpRoute);
app.use("/api/chats", messageRoute);

// Start the backend server
app.listen(config.port, () =>
  console.log(`Server is live at ${config.hostUrl}`)
);

export default app;
