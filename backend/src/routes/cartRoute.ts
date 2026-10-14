import express from "express";
import {
  addItemToCart,
  getActiveCartForUser,
  updateItemInCart,
  deleteItemInCart,
  clearCart,
  checkoutCart,
  getOrdersForUser,
} from "../services/cartService";
import { ExtendRequest } from "../extendedRequest";
import validateJWT from "../middlewares/validateJWT";

const router = express.Router();

router.get("/", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req?.user?._id;
    const cart = await getActiveCartForUser({ userId, populateProduct: true });
    res.status(200).send(cart);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.get("/orders", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).send({ error: "Unauthorized" });
      return;
    }

    const orders = await getOrdersForUser({
      userId: String(userId),
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Failed to fetch user orders:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.delete("/", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req?.user?._id;
    const response = await clearCart({ userId });
    res.status(response.statusCode).send(response.data);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.post("/items", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req?.user?._id;
    const { productId, quantity } = req.body;
    const response = await addItemToCart({ userId, productId, quantity });
    res.status(response.statusCode).send(response.data);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.put("/items", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req?.user?._id;
    const { productId, quantity } = req.body;
    const response = await updateItemInCart({ userId, productId, quantity });
    res.status(response.statusCode).send(response.data);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.delete(
  "/items/:productId",
  validateJWT,
  async (req: ExtendRequest, res) => {
    try {
      const userId = req?.user?._id;
      const { productId } = req.params;
      const response = await deleteItemInCart({ userId, productId });
      res.status(response.statusCode).send(response.data);
    } catch (error) {
      res.status(500).send({ error: "Internal Server Error" });
    }
  },
);

router.post("/checkout", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req?.user?._id;
    const { address } = req.body;
    const response = await checkoutCart({ userId, address });
    res.status(response.statusCode).send(response.data);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

export default router;
