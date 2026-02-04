export enum UserRole {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
  PROVIDER = "PROVIDER",
}

export enum Status {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
}

export enum OrderStatus {
  CART = "CART",
  PLACED = "PLACED",
  PREPARING = "PREPARING",
  READY = "READY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum DietaryPreference {
  VEGETARIAN = "VEGETARIAN",
  HALAL = "HALAL",
  VEGAN = "VEGAN",
  GLUTEN_FREE = "GLUTEN_FREE",
  DAIRY_FREE = "DAIRY_FREE",
}
