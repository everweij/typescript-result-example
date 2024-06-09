import express from "express";
import { routes } from "./routes.js";

const app = express();
app.use(express.json());
app.use(routes);
app.listen(4444, () => console.log("App listening on port 4444"));
