import { error } from "console";
import productModel from "../models/productModel";

export const getAllProducts = async () => {
  return await productModel.find();
};

export const seedInitialProducts = async () => {
  try {
    const products = [
      {
        title: "Dell Laptop",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUJhk4ZyGuyhl0EB9_vkqYLVBmzRSrUfBY9CuYiny5ow&s=10",
        price: 25000,
        stock: 100,
      },
    ];

    const existingProducts = await getAllProducts();

    if (existingProducts.length === 0) {
      await productModel.insertMany(products);
    }
  } catch (error) {
    console.error("cannot see database:", error);
  }
};
