import { cartModel, ICartItem } from "../models/cartModel";
import { IOrderItem, orderModel } from "../models/orderModel";
import productModel from "../models/productModel";

const MAX_CART_ITEM_QUANTITY = 10;

const exceedsCartItemQuantityLimit = (quantity: string) =>
  Number(quantity) > MAX_CART_ITEM_QUANTITY;

interface CreateCartForUser {
  userId: string;
}

const createCartForUser = async ({ userId }: CreateCartForUser) => {
  const cart = await cartModel.create({ userId, totalAmount: 0 });
  await cart.save();
  return cart;
};

interface GetActiveCartForUser {
  userId: string;
  populateProduct?: boolean;
}

export const getActiveCartForUser = async ({
  userId,
  populateProduct,
}: GetActiveCartForUser) => {
  let cart;

  if (populateProduct) {
    cart = await cartModel
      .findOne({ userId, status: "active" })
      .populate("items.product");
  } else {
    cart = await cartModel.findOne({ userId, status: "active" });
  }

  if (!cart) {
    cart = await createCartForUser({ userId });
  }

  return cart;
};

interface ClearCart {
  userId: string;
}

export const clearCart = async ({ userId }: ClearCart) => {
  const cart = await getActiveCartForUser({ userId });
  cart.items = [];
  cart.totalAmount = 0;
  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 200 };
};

interface AddItemToCart {
  userId: string;
  productId: any;
  quantity: string;
}

export const addItemToCart = async ({
  productId,
  quantity,
  userId,
}: AddItemToCart) => {
  const cart = await getActiveCartForUser({ userId });

  const existsInCart = cart.items.find(
    (p) => p.product.toString() === productId,
  );

  if (existsInCart) {
    return { data: "Item already exists in cart", statusCode: 400 };
  }

  const product = await productModel.findById(productId);

  if (!product) {
    return { data: "Product not found", statusCode: 404 };
  }

  if (exceedsCartItemQuantityLimit(quantity)) {
    return {
      data: `A cart item cannot exceed ${MAX_CART_ITEM_QUANTITY} items`,
      statusCode: 400,
    };
  }

  if (product.stock < Number(quantity)) {
    return { data: "Insufficient stock", statusCode: 400 };
  }

  cart.items.push({
    product,
    unitPrice: product.price,
    quantity: Number(quantity),
  });

  cart.totalAmount += product.price * Number(quantity);

  await cart.save();

  return {
    data: await getActiveCartForUser({ userId, populateProduct: true }),
    statusCode: 200,
  };
};

interface UpdateItemInCart {
  userId: string;
  productId: any;
  quantity: string;
}

export const updateItemInCart = async ({
  productId,
  quantity,
  userId,
}: UpdateItemInCart) => {
  const cart = await getActiveCartForUser({ userId });

  const existsInCart = cart.items.find(
    (p) => p.product.toString() === productId,
  );

  if (!existsInCart) {
    return { data: "Item does not exist in cart", statusCode: 400 };
  }

  const product = await productModel.findById(productId);

  if (!product) {
    return { data: "Product not found", statusCode: 404 };
  }

  if (exceedsCartItemQuantityLimit(quantity)) {
    return {
      data: `A cart item cannot exceed ${MAX_CART_ITEM_QUANTITY} items`,
      statusCode: 400,
    };
  }

  if (product.stock < Number(quantity)) {
    return { data: "Insufficient stock", statusCode: 400 };
  }

  const otherCartItems = cart.items.filter(
    (p) => p.product.toString() !== productId,
  );

  let total = calculateCartTotalItems({ cartItems: otherCartItems });

  existsInCart.quantity = Number(quantity);

  total += existsInCart.quantity * existsInCart.unitPrice;

  cart.totalAmount = total;

  await cart.save();

  return {
    data: await getActiveCartForUser({ userId, populateProduct: true }),
    statusCode: 200,
  };
};

interface DeleteItemInCart {
  productId: any;
  userId: string;
}

export const deleteItemInCart = async ({
  userId,
  productId,
}: DeleteItemInCart) => {
  const cart = await getActiveCartForUser({ userId });

  const existsInCart = cart.items.find(
    (p) => p.product.toString() === productId,
  );

  if (!existsInCart) {
    return { data: "Item does not exist in cart", statusCode: 400 };
  }

  const otherCartItems = cart.items.filter(
    (p) => p.product.toString() !== productId,
  );

  const total = calculateCartTotalItems({ cartItems: otherCartItems });

  cart.items = otherCartItems;
  cart.totalAmount = total;

  await cart.save();

  return {
    data: await getActiveCartForUser({ userId, populateProduct: true }),
    statusCode: 200,
  };
};

const calculateCartTotalItems = ({ cartItems }: { cartItems: ICartItem[] }) => {
  const total = cartItems.reduce((sum, product) => {
    sum += product.quantity * product.unitPrice;
    return sum;
  }, 0);

  return total;
};

interface Checkout {
  userId: string;
  address: string;
}

export const checkoutCart = async ({ userId, address }: Checkout) => {
  if (!address) {
    return { data: "Address is required for checkout", statusCode: 400 };
  }

  const cart = await getActiveCartForUser({ userId });

  const orderItems: IOrderItem[] = [];

  for (const item of cart.items) {
    const product = await productModel.findById(item.product);

    if (!product) {
      return { data: "Product not found", statusCode: 404 };
    }

    const orderItem = {
      productTitle: product.title,
      productImage: product.image,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
    } as IOrderItem;
    orderItems.push(orderItem);
  }
  const order = await orderModel.create({
    orderItems,
    userId,
    total: cart.totalAmount,
    address,
  });

  await order.save();

  cart.status = "completed";
  await cart.save();
  return { data: order, statusCode: 200 };
};

export const getOrdersForUser = async ({ userId }: { userId: string }) => {
  const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });

  return orders;
};
