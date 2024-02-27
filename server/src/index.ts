//Import dependencies
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

//Import routes
import { router as userRoutes } from "./routes/userRoutes";
import { router as adRoutes } from "./routes/adRoutes";

//Middleware
const app = express();
app.use(cors());
app.use(express.json({ limit: `10kb` }));
dotenv.config();

//Routes
app.use(`/api/v1/user`, userRoutes);
app.use(`/api/v1/ad`, adRoutes);

//Connection to MongoDB
mongoose.connect(`${process.env.MONGO_CONNECTION}`).then(() => {
  console.log("Mongo DB connected!");
});

//Connection to server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
