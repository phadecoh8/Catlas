import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { errorHandler } from "./middleware/error-handler.js";
import { requestId } from "./utils/logger.js";

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

const frontendUrl = process.env.FRONTEND_URL || "";

app.use(
  cors(
    frontendUrl
      ? {
          origin: frontendUrl.split(","),
          credentials: true,
        }
      : {},
  ),
);

app.use((request, response, next) => {
  request.id = requestId();
  response.setHeader("X-Request-Id", request.id);
  next();
});

app.get("/health", (_request, response) => {
  response.json({
    status: "ok",
  });
});

const v1 = express.Router();

app.use("/api/v1", v1);

app.use(errorHandler);

export default app;
