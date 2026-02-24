import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface OrderItem {
    productId: ProductId;
    quantity: bigint;
    price: bigint;
}
export type ProductId = bigint;
export interface Order {
    customerName: string;
    status: OrderStatus;
    orderId: OrderId;
    totalAmount: bigint;
    address: string;
    timestamp: Time;
    phone: string;
    items: Array<OrderItem>;
}
export type OrderId = bigint;
export interface Product {
    id: ProductId;
    stockQuantity: bigint;
    name: string;
    description: string;
    imageUrl: string;
    category: Category;
    price: bigint;
}
export enum Category {
    artSupplies = "artSupplies",
    schoolSupplies = "schoolSupplies",
    writing = "writing",
    paper = "paper",
    officeEssentials = "officeEssentials"
}
export enum OrderStatus {
    pending = "pending",
    dispatched = "dispatched",
    delivered = "delivered",
    processing = "processing"
}
export interface backendInterface {
    addProduct(name: string, description: string, category: Category, price: bigint, stockQuantity: bigint, imageUrl: string): Promise<Product>;
    deleteProduct(productId: ProductId): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getOrders(): Promise<Array<Order>>;
    getProductById(productId: ProductId): Promise<Product | null>;
    getProducts(): Promise<Array<Product>>;
    getProductsByCategory(category: Category): Promise<Array<Product>>;
    placeOrder(customerName: string, phone: string, address: string, items: Array<OrderItem>, totalAmount: bigint): Promise<Order>;
    seedProducts(): Promise<void>;
    updateOrderStatus(orderId: OrderId, newStatus: OrderStatus): Promise<void>;
    updateProduct(productId: ProductId, name: string, description: string, category: Category, price: bigint, stockQuantity: bigint, imageUrl: string): Promise<Product>;
}
