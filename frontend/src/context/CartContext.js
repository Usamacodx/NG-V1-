import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Fetch cart from database when user logs in
  useEffect(() => {
    if (user && user._id) {
      setIsLoading(true);
      fetchCartFromDatabase(user._id);
    } else {
      // Load guest cart from localStorage
      const guestCart = localStorage.getItem("cart_guest");
      if (guestCart) {
        try {
          setCartItems(JSON.parse(guestCart));
        } catch (err) {
          console.error("Failed to parse guest cart:", err);
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
      setIsLoading(false);
    }
  }, [user]);

  // Fetch cart from database
  const fetchCartFromDatabase = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/cart/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cart || []);
        // Also save to localStorage for offline support
        localStorage.setItem(`cart_${userId}`, JSON.stringify(data.cart || []));
      } else {
        console.error("Failed to fetch cart from database");
        setCartItems([]);
      }
    } catch (err) {
      console.error("Error fetching cart from database:", err);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync cart to database
  const syncCartToDatabase = async (updatedCart) => {
    if (!user || !user._id) {
      // Save to localStorage for guest users
      localStorage.setItem("cart_guest", JSON.stringify(updatedCart));
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/cart/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart: updatedCart }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Cart synced to database:", data);
        // Also save to localStorage
        localStorage.setItem(`cart_${user._id}`, JSON.stringify(updatedCart));
      } else {
        console.error("Failed to sync cart to database");
      }
    } catch (err) {
      console.error("Error syncing cart to database:", err);
    }
  };

  const addToCart = (product, quantity, size, customization = null, customizationPrice = 0) => {
    // Check if product with same size and customization already exists
    const existingItem = cartItems.find(
      (item) =>
        item._id === product._id &&
        item.size === size &&
        item.customization === customization
    );

    let updatedCart;
    if (existingItem) {
      // Update quantity if item already exists
      updatedCart = cartItems.map((item) =>
        item._id === product._id &&
        item.size === size &&
        item.customization === customization
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // Add new item to cart
      const newItem = {
        _id: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
        size,
        customization,
        customizationPrice,
        // Preserve product front/back images if available for accurate preview
        frontImage: product.frontImage || null,
        backImage: product.backImage || null,
      };
      updatedCart = [...cartItems, newItem];
    }

    setCartItems(updatedCart);
    syncCartToDatabase(updatedCart);
  };

  const updateCartItem = (productId, size, oldCustomization, newItem) => {
    const updatedCart = cartItems.map((item) =>
      item._id === productId && item.size === size && item.customization === oldCustomization
        ? { ...item, ...newItem }
        : item
    );
    setCartItems(updatedCart);
    syncCartToDatabase(updatedCart);
  };

  const removeFromCart = (id, size, customization) => {
    const updatedCart = cartItems.filter(
      (item) =>
        !(
          item._id === id &&
          item.size === size &&
          item.customization === customization
        )
    );
    setCartItems(updatedCart);
    syncCartToDatabase(updatedCart);
  };

  const updateQuantity = (id, size, customization, newQuantity) => {
    if (newQuantity > 0) {
      const updatedCart = cartItems.map((item) =>
        item._id === id &&
        item.size === size &&
        item.customization === customization
          ? { ...item, quantity: newQuantity }
          : item
      );
      setCartItems(updatedCart);
      syncCartToDatabase(updatedCart);
    }
  };

  const clearCart = async () => {
    if (user && user._id) {
      try {
        await fetch(`http://localhost:5000/api/auth/cart/${user._id}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.error("Error clearing cart from database:", err);
      }
    } else {
      localStorage.removeItem("cart_guest");
    }
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
          updateCartItem,
        removeFromCart,
        updateQuantity,
        clearCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
