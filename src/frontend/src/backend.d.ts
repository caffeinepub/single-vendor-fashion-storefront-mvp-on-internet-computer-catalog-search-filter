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
    variantId?: string;
    quantity: bigint;
    price: bigint;
    product: Product;
}
export interface Bundle {
    id: string;
    productIds: Array<string>;
    name: string;
    description: string;
    imageId?: string;
    price: bigint;
}
export interface Variant {
    id: string;
    sku: string;
    inventory: bigint;
    color?: string;
    size?: string;
    productId: string;
    price: bigint;
    material?: string;
}
export interface ReturnRequest {
    id: string;
    status: Variant_pending_completed_approved_rejected;
    customer: Principal;
    createdAt: Time;
    orderId: string;
    reason: string;
}
export interface Order {
    id: string;
    status: OrderStatus;
    customer: Principal;
    createdAt: Time;
    statusHistory: Array<[OrderStatus, Time]>;
    deliveryMethod: string;
    totalAmount: bigint;
    contactEmail: string;
    shippingAddress: string;
    items: Array<OrderItem>;
    contactPhone?: string;
}
export interface Analytics {
    revenueTotal: bigint;
    topProducts: Array<[string, bigint]>;
    ordersCount: bigint;
}
export interface CartItem {
    variantId?: string;
    quantity: bigint;
    product: Product;
}
export interface Product {
    id: string;
    inventory: bigint;
    name: string;
    description: string;
    category: string;
    brand?: string;
    imageId?: string;
    price: bigint;
}
export interface UserProfile {
    name: string;
    email?: string;
    shippingAddress?: string;
    phone?: string;
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    placed = "placed",
    fulfilled = "fulfilled",
    paid = "paid",
    refunded = "refunded",
    delivered = "delivered",
    returned = "returned"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_pending_completed_approved_rejected {
    pending = "pending",
    completed = "completed",
    approved = "approved",
    rejected = "rejected"
}
export interface backendInterface {
    addToCart(productId: string, quantity: bigint, variantId: string | null): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    completeRefund(returnId: string): Promise<void>;
    createBundle(bundle: Bundle): Promise<void>;
    createProduct(product: Product): Promise<void>;
    createVariant(variant: Variant): Promise<void>;
    deleteBundle(id: string): Promise<void>;
    deleteProduct(id: string): Promise<void>;
    deleteVariant(id: string): Promise<void>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getAllReturnRequests(): Promise<Array<ReturnRequest>>;
    getAnalytics(): Promise<Analytics>;
    getBundle(id: string): Promise<Bundle>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getOrder(orderId: string): Promise<Order>;
    getOrderHistory(): Promise<Array<Order>>;
    getProduct(id: string): Promise<Product>;
    getProductsByBrand(brand: string): Promise<Array<Product>>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getRecommendations(): Promise<Array<Product>>;
    getReturnRequests(): Promise<Array<ReturnRequest>>;
    getSortedProducts(): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVariant(id: string): Promise<Variant>;
    initiateReturn(orderId: string, reason: string): Promise<string>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(shippingAddress: string, contactEmail: string, contactPhone: string | null, deliveryMethod: string): Promise<string>;
    processReturnRequest(returnId: string, approved: boolean): Promise<void>;
    removeFromCart(productId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProducts(searchTerm: string): Promise<Array<Product>>;
    trackProductView(productId: string): Promise<void>;
    updateBundle(bundle: Bundle): Promise<void>;
    updateCartItem(productId: string, quantity: bigint): Promise<void>;
    updateInventory(productId: string, newInventory: bigint): Promise<void>;
    updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<void>;
    updateProduct(product: Product): Promise<void>;
    updateVariant(variant: Variant): Promise<void>;
}
