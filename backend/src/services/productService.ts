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
        stock: 10,
      },
      {
        title: "Asus Laptop",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSpj4JzrXSU2ZlszsUkJrMh-2kdzQgsL5XmTJZUMiXRA&s=10",
        price: 2000,
        stock: 20,
      },
      {
        title: "HP Laptop",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLFLQ1VR8UmEwqnwiuSm59nl-OmGWFAR9Jp3gjzsnRGg&s=10",
        price: 15000,
        stock: 18,
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
