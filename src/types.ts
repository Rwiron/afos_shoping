export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  discount?: number // Discount percentage (e.g., 10 for 10% off)
  category: Category
  image: string
  stock: number
  tags: string[]
}

export type Category =
  | 'All'
  | 'Food & Groceries'
  | 'Cooking & Gas'
  | 'Hygiene & Care'
  | 'Kitchen Items'
  | 'Appliances'
  | 'Household'

export interface CartItem extends MenuItem {
  quantity: number;
  cartId: string;
  notes?: string;
}

export interface UserProfile {
  name: string;
  rank: string;
  unit: string;
  balance: number;
  serviceNumber?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}