export interface User {
  email: string;
  id?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  shippingDetails: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  createdAt: string;
}