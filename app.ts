import express, { Express, Request, Response } from 'express';
import bodyParser from "body-parser";
const app = express();
const apiRouter = require("./api/api.ts");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", apiRouter)

app.listen(8080)