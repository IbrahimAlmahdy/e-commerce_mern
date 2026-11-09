export interface CartItem {
  productId: string;
  title: string;
  quantity: number;
  unitPrice: number;
  image: string;
}

export interface ApiCartItem {
  product: {
    _id: string;
    title: string;
    image: string;
    unitPrice?: number;
  };
  quantity: number;
  unitPrice?: number;
}

export interface ApiCart {
  items: ApiCartItem[];
  totalAmount?: number;
}
