import express, { Response } from "express";
import "dotenv/config.js";
import userRoute from "./routes/user.routes.js";
import sightRoute from "./routes/sightSeeing.routes.js";


const app = express();
app.use(express.json());


import "./connection.js";

app.get("/", (_, res: Response) => {
  res.send("Hello World");
});

app.use("/",userRoute)
app.use("/api/",sightRoute);


export default app;
