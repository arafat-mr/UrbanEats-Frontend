import { DietaryPreference, OrderStatus, Status, UserRole } from "./enums";

export type User = {
  id: string;
  name: string;
  email: string;

  role: UserRole;
  image?: string | null;
  phone?: string | null;
  status: Status;

  emailVerified: boolean;

  createdAt: string;
  updatedAt: string;
};


export type Provider = {
  id: string;
  userId: string;

  restaurantName: string;
  description?: string | null;
  address?: string | null;
  phone?: string | null;

  isApproved: boolean;

  createdAt: string;
  updatedAt: string;
};
export type Category = {
  id: string;
  name: string;
  slug?: string | null;
  image?: string | null;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
};
export type Meal = {
  id: string;

  providerId?: string | null;
  categoryId?: string | null;

  name: string;
  description: string;
  price: number;
  image: string;

  isAvailable: boolean;

  dietaryTags: DietaryPreference[];

  createdAt: string;
  updatedAt: string;
};
export type MealDetails = Meal & {
  provider?: Provider;
  category?: Category;
  reviews?: Review[];
};
export type Order = {
  id: string;

  customerId: string;
  providerId: string;

  totalAmount: number;
  paymentMethod: string;
  orderStatus: OrderStatus;
  deliveryAddress: string;

  createdAt: string;
  updatedAt: string;
};
export type OrderItem = {
  id: string;
  orderId: string;
  mealId: string;

  quantity: number;
  price: number;

  meal?: Meal; 
};
export type Review = {
  id: string;
  mealId: string;
  customerId: string;
  orderId: string;

  rating: number;
  comment?: string | null;

  createdAt: string;
  updatedAt: string;
};
export interface MealsListProps {
  meals: Meal[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}