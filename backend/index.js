import 'dotenv/config'
import express from "express"
import cors from "cors";
//const jwt = require('jsonwebtoken');

import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

import authRouter from "./routes/auth.js";

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use('/auth', authRouter)

app.get("/", (req, res) => {
    res.send("Blocked")
})

app.all("*", (req, res) => {
    res.send("error")
})

app.listen(port, () => console.log("Server on port:", port))


