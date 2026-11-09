export interface OrderProduct {
  productId?: string;
  title: string;
  image?: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  _id: string;
  createdAt?: string;
  status?: string;
  address?: string;
  orderItems?: {
    productTitle: string;
    productImage?: string;
    quantity: number;
    unitPrice: number;
  }[];
  items?: OrderProduct[];
  total?: number;
  totalAmount?: number;
}
