import express, { Request, Response } from "express";
import dotenv from "dotenv";

const app = express();
app.use(express.json({ limit: `10kb` }));

dotenv.config();

//Testing response
app.get("/", (req: Request, res: Response) =>
  res.status(200).json({ status: `success`, data: "Hello World" })
);

//Connecting to server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
