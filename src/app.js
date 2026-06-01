import express from "express";
import { loggerMiddleware } from "./shared/middlewares/logger.middleware.js";
import { errorMiddleware } from "./shared/middlewares/error.middleware.js";

const app = express();
app.use(loggerMiddleware);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(errorMiddleware);

export default app;
