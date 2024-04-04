//Import dependencies
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

//Import functions
import { rateLimitResponse } from "./controller/error/rateLimitResponse";
import { routeDontExist } from "./controller/error/routeDontExist";

//Import routes
import { router as userRoutes } from "./routes/userRoutes";
import { router as adRoutes } from "./routes/adRoutes";

//Middleware
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: `10kb` }));
dotenv.config();

//Limiting number of requests from one IP, maximum 200 in 30 minutes
app.use(
  `/api`,
  rateLimit({
    max: 200,
    windowMs: 1800000,
    handler: rateLimitResponse,
  })
);

//Routes
app.use(`/api/v1/user`, userRoutes);
app.use(`/api/v1/car`, adRoutes);
app.all(`*`, routeDontExist);

//Connection to MongoDB
mongoose.connect(`${process.env.MONGO_CONNECTION}`).then(() => {
  console.log("Mongo DB connected!");
});

//Connection to server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
