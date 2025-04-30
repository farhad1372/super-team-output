import express from "express";
import HTTP from 'http';
import { fileURLToPath } from 'url';
import path from 'path';
import { getThreatConsiderations } from "./app/controller/webacy/index.js";
import expressConfig from "./webserver/express.js";
import { GetBubbleMap } from "./app/controller/bubble/index.js";
import { MakeTokenData } from "./app/controller/coingecko/index.js";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
const server = HTTP.createServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, '../public')));
expressConfig(app, express);
const Router = express.Router();
Router.get("/", (req, res) => {
    res.send("Express is Running");
});
Router.get("/threat/considerations/:address", getThreatConsiderations);
Router.get("/bubble-map/:address", GetBubbleMap);
Router.get("/token-info/:address", MakeTokenData);
app.use('/api', Router);
// await mongoConnection(mongoose).connectToMongo();
server.listen(PORT, () => {
    console.log("server starting...");
});
