import express from "express";
import { loggerMiddleware } from "./shared/middlewares/logger.middleware.js";
import { errorMiddleware } from "./shared/middlewares/error.middleware.js";
import { rateLimitMiddleware } from "./shared/middlewares/rateLimit.middleware.js";
import authRoute from "./modules/auth/auth.route.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(loggerMiddleware);
app.use(rateLimitMiddleware);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/auth", authRoute);

app.use(errorMiddleware);

export default app;
