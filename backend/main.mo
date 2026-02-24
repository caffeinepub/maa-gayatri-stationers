import Map "mo:core/Map";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Migration "migration";

(with migration = Migration.run)
actor {
  type ProductId = Nat;
  public type Category = {
    #writing;
    #paper;
    #artSupplies;
    #officeEssentials;
    #schoolSupplies;
  };

  module Category {
    public func toText(category : Category) : Text {
      switch (category) {
        case (#writing) { "Writing" };
        case (#paper) { "Paper" };
        case (#artSupplies) { "Art Supplies" };
        case (#officeEssentials) { "Office Essentials" };
        case (#schoolSupplies) { "School Supplies" };
      };
    };

    public func compare(category1 : Category, category2 : Category) : Order.Order {
      switch (category1, category2) {
        case (#writing, #writing) { #equal };
        case (#writing, #paper) { #less };
        case (#writing, #artSupplies) { #less };
        case (#writing, #officeEssentials) { #less };
        case (#writing, #schoolSupplies) { #less };

        case (#paper, #writing) { #greater };
        case (#paper, #paper) { #equal };
        case (#paper, #artSupplies) { #less };
        case (#paper, #officeEssentials) { #less };
        case (#paper, #schoolSupplies) { #less };

        case (#artSupplies, #writing) { #greater };
        case (#artSupplies, #paper) { #greater };
        case (#artSupplies, #artSupplies) { #equal };
        case (#artSupplies, #officeEssentials) { #less };
        case (#artSupplies, #schoolSupplies) { #less };

        case (#officeEssentials, #writing) { #greater };
        case (#officeEssentials, #paper) { #greater };
        case (#officeEssentials, #artSupplies) { #greater };
        case (#officeEssentials, #officeEssentials) { #equal };
        case (#officeEssentials, #schoolSupplies) { #less };

        case (_) { #greater };
      };
    };
  };

  public type Product = {
    id : ProductId;
    name : Text;
    description : Text;
    category : Category;
    price : Nat; // price in paise
    stockQuantity : Nat;
    imageUrl : Text;
  };

  module Product {
    public func compareByCategory(product1 : Product, product2 : Product) : Order.Order {
      switch (Category.compare(product1.category, product2.category)) {
        case (#equal) { compareByName(product1, product2) };
        case (order) { order };
      };
    };

    public func compareByName(product1 : Product, product2 : Product) : Order.Order {
      product1.name.compare(product2.name);
    };
  };

  public type OrderItem = {
    productId : ProductId;
    quantity : Nat;
    price : Nat;
  };

  public type OrderId = Nat;
  public type OrderStatus = {
    #pending;
    #processing;
    #dispatched;
    #delivered;
  };

  module OrderStatus {
    public func toText(status : OrderStatus) : Text {
      switch (status) {
        case (#pending) { "Pending" };
        case (#processing) { "Processing" };
        case (#dispatched) { "Dispatched" };
        case (#delivered) { "Delivered" };
      };
    };
  };

  public type Order = {
    orderId : OrderId;
    customerName : Text;
    phone : Text;
    address : Text;
    items : [OrderItem];
    totalAmount : Nat;
    status : OrderStatus;
    timestamp : Time.Time;
  };

  var nextProductId = 1;
  var nextOrderId = 1;

  let products = Map.empty<ProductId, Product>();
  let orders = Map.empty<OrderId, Order>();
  let categories = Set.empty<Category>();

  public query ({ caller }) func getProducts() : async [Product] {
    products.values().toArray();
  };

  public shared ({ caller }) func addProduct(
    name : Text,
    description : Text,
    category : Category,
    price : Nat,
    stockQuantity : Nat,
    imageUrl : Text,
  ) : async Product {
    let productId = nextProductId;
    nextProductId += 1;

    let product : Product = {
      id = productId;
      name;
      description;
      category;
      price;
      stockQuantity;
      imageUrl;
    };

    products.add(productId, product);
    categories.add(category);
    product;
  };

  public shared ({ caller }) func updateProduct(
    productId : ProductId,
    name : Text,
    description : Text,
    category : Category,
    price : Nat,
    stockQuantity : Nat,
    imageUrl : Text,
  ) : async Product {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?existingProduct) {
        let updatedProduct : Product = {
          id = productId;
          name;
          description;
          category;
          price;
          stockQuantity;
          imageUrl;
        };
        products.add(productId, updatedProduct);
        categories.add(category);
        updatedProduct;
      };
    };
  };

  public shared ({ caller }) func deleteProduct(productId : ProductId) : async () {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        products.remove(productId);
        categories.remove(product.category);
      };
    };
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray().sort(Product.compareByCategory);
  };

  public query ({ caller }) func getProductsByCategory(category : Category) : async [Product] {
    products.values().toArray().filter(
      func(p) {
        p.category == category;
      }
    ).sort(Product.compareByName);
  };

  public query ({ caller }) func getProductById(productId : ProductId) : async ?Product {
    products.get(productId);
  };

  public shared ({ caller }) func placeOrder(
    customerName : Text,
    phone : Text,
    address : Text,
    items : [OrderItem],
    totalAmount : Nat,
  ) : async Order {
    let orderId = nextOrderId;
    nextOrderId += 1;

    let order : Order = {
      orderId;
      customerName;
      phone;
      address;
      items;
      totalAmount;
      status = #pending;
      timestamp = Time.now();
    };

    orders.add(orderId, order);
    order;
  };

  public query ({ caller }) func getOrders() : async [Order] {
    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : OrderId, newStatus : OrderStatus) : async () {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder : Order = {
          order with
          status = newStatus;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public shared ({ caller }) func seedProducts() : async () {
    if (products.isEmpty()) {
      ignore await addProduct(
        "Ballpoint Pen",
        "Smooth writing pen in blue ink",
        #writing,
        2000,
        100,
        "https://example.com/images/pen.jpg",
      );
      ignore await addProduct(
        "Notepad",
        "Lined notepad for notes and lists",
        #paper,
        5000,
        50,
        "https://example.com/images/notepad.jpg",
      );
      ignore await addProduct(
        "Highlighter Set",
        "Set of 4 fluorescent highlighters",
        #writing,
        8000,
        30,
        "https://example.com/images/highlighters.jpg",
      );
      ignore await addProduct(
        "Sketchbook",
        "A4 size sketchbook with 80 pages",
        #artSupplies,
        15000,
        20,
        "https://example.com/images/sketchbook.jpg",
      );
      ignore await addProduct(
        "Stapler",
        "Compact desktop stapler",
        #officeEssentials,
        12000,
        25,
        "https://example.com/images/stapler.jpg",
      );
      ignore await addProduct(
        "Colored Pencils",
        "Box of 12 colored pencils",
        #artSupplies,
        6000,
        40,
        "https://example.com/images/colored_pencils.jpg",
      );
      ignore await addProduct(
        "Printer Paper",
        "A4 size bundle of 500 sheets",
        #paper,
        35000,
        15,
        "https://example.com/images/printer_paper.jpg",
      );
      ignore await addProduct(
        "Ruler",
        "12-inch plastic ruler",
        #schoolSupplies,
        3000,
        60,
        "https://example.com/images/ruler.jpg",
      );
      ignore await addProduct(
        "Pencils",
        "Box of 10 HB pencils",
        #writing,
        4000,
        80,
        "https://example.com/images/pencils.jpg",
      );
      ignore await addProduct(
        "Binder Clips",
        "Pack of 12 binder clips",
        #officeEssentials,
        5000,
        35,
        "https://example.com/images/binder_clips.jpg",
      );
      ignore await addProduct(
        "Scissors",
        "Multi-purpose scissors",
        #schoolSupplies,
        9000,
        22,
        "https://example.com/images/scissors.jpg",
      );
      ignore await addProduct(
        "Markers",
        "Set of 6 permanent markers",
        #artSupplies,
        11000,
        18,
        "https://example.com/images/markers.jpg",
      );
    };
  };
};
