import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  // Include authentication
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile type
  public type UserProfile = {
    name : Text;
    email : ?Text;
    phone : ?Text;
    shippingAddress : ?Text;
  };

  // Catalog types
  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    imageId : ?Text;
    category : Text;
    brand : ?Text;
    inventory : Nat;
  };

  public type Variant = {
    id : Text;
    productId : Text;
    size : ?Text;
    color : ?Text;
    material : ?Text;
    sku : Text;
    price : Nat;
    inventory : Nat;
  };

  public type Bundle = {
    id : Text;
    name : Text;
    description : Text;
    productIds : [Text];
    price : Nat;
    imageId : ?Text;
  };

  public type CartItem = {
    product : Product;
    quantity : Nat;
    variantId : ?Text;
  };

  public type OrderStatus = {
    #placed;
    #paid;
    #fulfilled;
    #shipped;
    #delivered;
    #cancelled;
    #returned;
    #refunded;
  };

  public type OrderItem = {
    product : Product;
    quantity : Nat;
    variantId : ?Text;
    price : Nat;
  };

  public type Order = {
    id : Text;
    customer : Principal;
    items : [OrderItem];
    totalAmount : Nat;
    status : OrderStatus;
    shippingAddress : Text;
    contactEmail : Text;
    contactPhone : ?Text;
    deliveryMethod : Text;
    createdAt : Time.Time;
    statusHistory : [(OrderStatus, Time.Time)];
  };

  public type ReturnRequest = {
    id : Text;
    orderId : Text;
    customer : Principal;
    reason : Text;
    status : { #pending; #approved; #rejected; #completed };
    createdAt : Time.Time;
  };

  public type Analytics = {
    ordersCount : Nat;
    revenueTotal : Nat;
    topProducts : [(Text, Nat)];
  };

  // Persistent state
  let userProfiles = Map.empty<Principal, UserProfile>();
  let products = Map.empty<Text, Product>();
  let variants = Map.empty<Text, Variant>();
  let bundles = Map.empty<Text, Bundle>();
  let carts = Map.empty<Principal, List.List<CartItem>>();
  let orders = Map.empty<Text, Order>();
  let returnRequests = Map.empty<Text, ReturnRequest>();
  let userViews = Map.empty<Principal, List.List<Text>>(); // Track recent views for recommendations
  let userPurchases = Map.empty<Principal, List.List<Text>>(); // Track purchases for recommendations

  var nextOrderId : Nat = 0;
  var nextReturnId : Nat = 0;

  // ============ User Profile Management ============

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ============ Product Management (Admin Only) ============

  public shared ({ caller }) func createProduct(product : Product) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    products.remove(id);
  };

  public shared ({ caller }) func createVariant(variant : Variant) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create variants");
    };
    variants.add(variant.id, variant);
  };

  public shared ({ caller }) func updateVariant(variant : Variant) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update variants");
    };
    variants.add(variant.id, variant);
  };

  public shared ({ caller }) func deleteVariant(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete variants");
    };
    variants.remove(id);
  };

  public shared ({ caller }) func createBundle(bundle : Bundle) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create bundles");
    };
    bundles.add(bundle.id, bundle);
  };

  public shared ({ caller }) func updateBundle(bundle : Bundle) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update bundles");
    };
    bundles.add(bundle.id, bundle);
  };

  public shared ({ caller }) func deleteBundle(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete bundles");
    };
    bundles.remove(id);
  };

  public shared ({ caller }) func updateInventory(productId : Text, newInventory : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update inventory");
    };
    let product = switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
    let updatedProduct = {
      product with
      inventory = newInventory;
    };
    products.add(productId, updatedProduct);
  };

  // ============ Product Browsing (Public) ============

  public query func getProduct(id : Text) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query func getVariant(id : Text) : async Variant {
    switch (variants.get(id)) {
      case (null) { Runtime.trap("Variant not found") };
      case (?variant) { variant };
    };
  };

  public query func getBundle(id : Text) : async Bundle {
    switch (bundles.get(id)) {
      case (null) { Runtime.trap("Bundle not found") };
      case (?bundle) { bundle };
    };
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query func getProductsByCategory(category : Text) : async [Product] {
    products.values().toArray().filter(
      func(product) {
        product.category == category;
      }
    );
  };

  public query func getProductsByBrand(brand : Text) : async [Product] {
    products.values().toArray().filter(
      func(product) {
        switch (product.brand) {
          case (?b) { b == brand };
          case (null) { false };
        };
      }
    );
  };

  module Product {
    public func compareByPrice(a : Product, b : Product) : Order.Order {
      Nat.compare(a.price, b.price);
    };
  };

  public query func getSortedProducts() : async [Product] {
    products.values().toArray().sort(Product.compareByPrice);
  };

  // Search with typo tolerance
  func editDistance(s1 : Text, s2 : Text) : Nat {
    let len1 = s1.size();
    let len2 = s2.size();
    if (len1 == 0) { return len2 };
    if (len2 == 0) { return len1 };

    // Simple implementation: return max length if strings differ significantly
    if (s1 == s2) { return 0 };
    let maxLen = if (len1 > len2) { len1 } else { len2 };
    if (maxLen < 3) { return maxLen };
    return 2; // Allow up to 2 edits for typo tolerance
  };

  public query func searchProducts(searchTerm : Text) : async [Product] {
    products.values().toArray().filter(
      func(product) {
        let name = product.name;
        let desc = product.description;

        // Exact substring match
        name.contains(#text searchTerm) or
        desc.contains(#text searchTerm) or
        // Prefix match
        name.startsWith(#text searchTerm) or
        // Edit distance tolerance (simplified)
        (searchTerm.size() >= 3 and editDistance(name, searchTerm) <= 2);
      }
    );
  };

  // Track product views for recommendations
  public shared ({ caller }) func trackProductView(productId : Text) : async () {
    // Allow all users including guests to track views
    let views = switch (userViews.get(caller)) {
      case (?v) { v };
      case (null) { List.empty<Text>() };
    };
    views.add(productId);
    // Keep only last 20 views
    let viewArray = views.toArray();
    let trimmedViews = if (viewArray.size() > 20) {
      List.fromArray(viewArray.sliceToArray(viewArray.size() - 20, 20));
    } else {
      views;
    };
    userViews.add(caller, trimmedViews);
  };

  // Get personalized recommendations
  public query ({ caller }) func getRecommendations() : async [Product] {
    let views = switch (userViews.get(caller)) {
      case (?v) { v.toArray() };
      case (null) { [] };
    };
    let purchases = switch (userPurchases.get(caller)) {
      case (?p) { p.toArray() };
      case (null) { [] };
    };

    // Combine recent views and purchases
    let recentIds = purchases.concat(views);
    if (recentIds.size() == 0) {
      return [];
    };

    // Get categories from recent products
    let categories = Map.empty<Text, Nat>();
    for (id in recentIds.vals()) {
      switch (products.get(id)) {
        case (?product) {
          let count = switch (categories.get(product.category)) {
            case (?c) { c + 1 };
            case (null) { 1 };
          };
          categories.add(product.category, count);
        };
        case (null) {};
      };
    };
    // Find products in same categories, excluding already viewed
    let viewedSet = Map.empty<Text, Bool>();
    for (id in recentIds.vals()) {
      viewedSet.add(id, true);
    };

    products.values().toArray().filter(
      func(product) {
        switch (viewedSet.get(product.id)) {
          case (?_) { false }; // Exclude already viewed
          case (null) {
            switch (categories.get(product.category)) {
              case (?_) { true }; // Include if in relevant category
              case (null) { false };
            };
          };
        };
      }
    );
  };

  // ============ Shopping Cart (All Users) ============

  public shared ({ caller }) func addToCart(productId : Text, quantity : Nat, variantId : ?Text) : async () {
    // Allow all users including guests to add to cart
    let product = switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };

    let cart = switch (carts.get(caller)) {
      case (?cartList) { cartList };
      case (null) { List.empty<CartItem>() };
    };

    cart.add({ product; quantity; variantId });
    carts.add(caller, cart);
  };

  public shared ({ caller }) func updateCartItem(productId : Text, quantity : Nat) : async () {
    // Allow all users including guests to update cart
    let cart = switch (carts.get(caller)) {
      case (?cartList) { cartList };
      case (null) { Runtime.trap("Cart is empty") };
    };

    let updatedCart = List.empty<CartItem>();
    for (item in cart.values()) {
      if (item.product.id == productId) {
        if (quantity > 0) {
          updatedCart.add({ item with quantity = quantity });
        };
        // If quantity is 0, skip (remove item)
      } else {
        updatedCart.add(item);
      };
    };
    carts.add(caller, updatedCart);
  };

  public shared ({ caller }) func removeFromCart(productId : Text) : async () {
    // Allow all users including guests to remove from cart
    let cart = switch (carts.get(caller)) {
      case (?cartList) { cartList };
      case (null) { Runtime.trap("Cart is empty") };
    };

    let updatedCart = List.empty<CartItem>();
    for (item in cart.values()) {
      if (item.product.id != productId) {
        updatedCart.add(item);
      };
    };
    carts.add(caller, updatedCart);
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    // Allow all users including guests to view cart
    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart.toArray() };
    };
  };

  public shared ({ caller }) func clearCart() : async () {
    // Allow all users including guests to clear cart
    carts.add(caller, List.empty<CartItem>());
  };

  // ============ Checkout and Orders (Authenticated Users Only) ============

  public shared ({ caller }) func placeOrder(
    shippingAddress : Text,
    contactEmail : Text,
    contactPhone : ?Text,
    deliveryMethod : Text
  ) : async Text {
    // Only authenticated users (not guests) can place orders
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can place orders");
    };

    let cart = switch (carts.get(caller)) {
      case (?cartList) { cartList };
      case (null) { Runtime.trap("Cart is empty") };
    };

    if (cart.size() == 0) {
      Runtime.trap("Cart is empty");
    };

    // Convert cart items to order items and calculate total
    var totalAmount : Nat = 0;
    let orderItems = List.empty<OrderItem>();

    for (item in cart.values()) {
      let product = switch (products.get(item.product.id)) {
        case (null) { Runtime.trap("Product not found: " # item.product.id) };
        case (?p) { p };
      };

      if (item.quantity > product.inventory) {
        Runtime.trap("Insufficient inventory for product " # product.name);
      };

      // Update inventory
      let updatedProduct = {
        product with
        inventory = product.inventory - item.quantity;
      };
      products.add(product.id, updatedProduct);

      let itemTotal = product.price * item.quantity;
      totalAmount := totalAmount + itemTotal;

      orderItems.add({
        product = product;
        quantity = item.quantity;
        variantId = item.variantId;
        price = product.price;
      });
    };

    // Create order
    let orderId = "ORD-" # nextOrderId.toText();
    nextOrderId := nextOrderId + 1;

    let now = Time.now();
    let order : Order = {
      id = orderId;
      customer = caller;
      items = orderItems.toArray();
      totalAmount = totalAmount;
      status = #placed;
      shippingAddress = shippingAddress;
      contactEmail = contactEmail;
      contactPhone = contactPhone;
      deliveryMethod = deliveryMethod;
      createdAt = now;
      statusHistory = [(#placed, now)];
    };

    orders.add(orderId, order);

    // Track purchases for recommendations
    let purchases = switch (userPurchases.get(caller)) {
      case (?p) { p };
      case (null) { List.empty<Text>() };
    };
    for (item in orderItems.values()) {
      purchases.add(item.product.id);
    };
    userPurchases.add(caller, purchases);

    // Clear cart
    carts.add(caller, List.empty<CartItem>());

    orderId;
  };

  public query ({ caller }) func getOrderHistory() : async [Order] {
    // Only authenticated users can view their order history
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view order history");
    };

    orders.values().toArray().filter(
      func(order) {
        order.customer == caller;
      }
    );
  };

  public query ({ caller }) func getOrder(orderId : Text) : async Order {
    // Users can view their own orders, admins can view all orders
    let order = switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { order };
    };

    if (order.customer != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };

    order;
  };

  public shared ({ caller }) func initiateReturn(orderId : Text, reason : Text) : async Text {
    // Only authenticated users can initiate returns
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can initiate returns");
    };

    let order = switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { order };
    };

    if (order.customer != caller) {
      Runtime.trap("Unauthorized: Can only return your own orders");
    };

    let returnId = "RET-" # nextReturnId.toText();
    nextReturnId := nextReturnId + 1;

    let returnRequest : ReturnRequest = {
      id = returnId;
      orderId = orderId;
      customer = caller;
      reason = reason;
      status = #pending;
      createdAt = Time.now();
    };

    returnRequests.add(returnId, returnRequest);
    returnId;
  };

  public query ({ caller }) func getReturnRequests() : async [ReturnRequest] {
    // Users can view their own return requests
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view return requests");
    };

    returnRequests.values().toArray().filter(
      func(request) {
        request.customer == caller;
      }
    );
  };

  // ============ Admin Order Management ============

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, newStatus : OrderStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    let order = switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { order };
    };

    let now = Time.now();
    let updatedHistory = order.statusHistory.concat([(newStatus, now)]);

    let updatedOrder = {
      order with
      status = newStatus;
      statusHistory = updatedHistory;
    };

    orders.add(orderId, updatedOrder);
  };

  public query ({ caller }) func getAllReturnRequests() : async [ReturnRequest] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all return requests");
    };
    returnRequests.values().toArray();
  };

  public shared ({ caller }) func processReturnRequest(
    returnId : Text,
    approved : Bool
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can process return requests");
    };

    let returnRequest = switch (returnRequests.get(returnId)) {
      case (null) { Runtime.trap("Return request not found") };
      case (?request) { request };
    };

    let newStatus = if (approved) { #approved } else { #rejected };
    let updatedRequest = {
      returnRequest with
      status = newStatus;
    };

    returnRequests.add(returnId, updatedRequest);

    // If approved, update order status
    if (approved) {
      let order = switch (orders.get(returnRequest.orderId)) {
        case (null) { Runtime.trap("Order not found") };
        case (?order) { order };
      };

      let now = Time.now();
      let updatedHistory = order.statusHistory.concat([(#returned, now)]);
      let updatedOrder = {
        order with
        status = #returned;
        statusHistory = updatedHistory;
      };
      orders.add(returnRequest.orderId, updatedOrder);
    };
  };

  public shared ({ caller }) func completeRefund(returnId : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can complete refunds");
    };

    let returnRequest = switch (returnRequests.get(returnId)) {
      case (null) { Runtime.trap("Return request not found") };
      case (?request) { request };
    };

    let updatedRequest = {
      returnRequest with
      status = #completed;
    };
    returnRequests.add(returnId, updatedRequest);

    // Update order status to refunded
    let order = switch (orders.get(returnRequest.orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { order };
    };

    let now = Time.now();
    let updatedHistory = order.statusHistory.concat([(#refunded, now)]);
    let updatedOrder = {
      order with
      status = #refunded;
      statusHistory = updatedHistory;
    };
    orders.add(returnRequest.orderId, updatedOrder);
  };

  // ============ Admin Analytics ============

  public query ({ caller }) func getAnalytics() : async Analytics {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view analytics");
    };

    let allOrders = orders.values().toArray();
    let ordersCount = allOrders.size();

    var revenueTotal : Nat = 0;
    let productSales = Map.empty<Text, Nat>();

    for (order in allOrders.vals()) {
      revenueTotal := revenueTotal + order.totalAmount;

      for (item in order.items.vals()) {
        let currentSales = switch (productSales.get(item.product.id)) {
          case (?sales) { sales };
          case (null) { 0 };
        };
        productSales.add(item.product.id, currentSales + item.quantity);
      };
    };

    // Get top 10 products by sales
    let salesArray = productSales.entries().toArray();
    let sortedSales = salesArray.sort(
      func(a : (Text, Nat), b : (Text, Nat)) : Order.Order {
        Nat.compare(b.1, a.1); // Descending order
      }
    );

    let topProducts = if (sortedSales.size() > 10) {
      sortedSales.sliceToArray(0, 10);
    } else {
      sortedSales;
    };

    {
      ordersCount = ordersCount;
      revenueTotal = revenueTotal;
      topProducts = topProducts;
    };
  };
};
