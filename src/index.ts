import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRoute";
import productRouter from "./routes/ProductRoute";
import { seedInitialProducts } from "./services/productService";

const app = express();
const port = 3001;

app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/ecommerce")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Seed the products to database
seedInitialProducts();

app.use("/user", userRouter);
app.use("/product", productRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
