import express from "express";
import { loggerMiddleware } from "./shared/middlewares/logger.middleware.js";
import { errorMiddleware } from "./shared/middlewares/error.middleware.js";
import { rateLimitMiddleware } from "./shared/middlewares/rateLimit.middleware.js";
import { authMiddleware } from "./shared/middlewares/auth.middleware.js";
import authRoute from "./modules/auth/auth.route.js";
import userRoute from "./modules/users/user.route.js";
import uploadRoute from "./modules/uploads/upload.route.js";
import postRoute from "./modules/posts/post.route.js";
import friendRoute from "./modules/friends/friend.route.js";
import chatRoute from "./modules/chats/chat.route.js";
import likeRoute from "./modules/likes/like.route.js";
import commentRoute from "./modules/comments/comment.route.js";
import notificationRoute from "./modules/notifications/notification.route.js";
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

app.use(authMiddleware);

app.use("/api/v1/uploads", uploadRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/friends", friendRoute);
app.use("/api/v1/chats", chatRoute);
app.use("/api/v1", likeRoute);
app.use("/api/v1", commentRoute);
app.use("/api/v1/notifications", notificationRoute);

app.use(errorMiddleware);

export default app;
