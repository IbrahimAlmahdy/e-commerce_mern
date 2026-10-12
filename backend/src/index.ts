import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRoute";
import productRouter from "./routes/ProductRoute";
import cartRouter from "./routes/cartRoute";
import { seedInitialProducts } from "./services/productService";

const app = express();
const port = 3001;

app.use(express.json());

mongoose
  .connect(process.env.DATABASE_URL!)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

seedInitialProducts();

app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
