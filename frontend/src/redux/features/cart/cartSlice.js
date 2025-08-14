import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../../../Utils/cartUtils"; // your updateCart function if any

const savedCart = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : {};

  const initialState = {
  cartItems: savedCart.cartItems || [],
  itemsPrice: savedCart.itemsPrice || 0,
  shippingPrice: savedCart.shippingPrice || 0,
  taxPrice: savedCart.taxPrice || 0,
  totalPrice: savedCart.totalPrice || 0,
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
  const incoming = action.payload;

  const newItem = {
    _id: incoming._id || incoming.id,
    name: incoming.name,
    image: incoming.image,
    price: Number(incoming.price),
    countInStock: incoming.countInStock,
    qty: Number(incoming.qty), // force conversion
  };

  const existIndex = state.cartItems.findIndex(
    (item) => item._id === newItem._id
  );

  if (existIndex >= 0) {
    state.cartItems[existIndex].qty = newItem.qty;
  } else {
    state.cartItems.push(newItem);
  }

  updateCart(state);
} ,


    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );
      updateCart(state);
    },
    clearCart: (state) => {
      state.cartItems = [];
      updateCart(state);
    },
  },

  loadCartFromLocalStorage: (state, action) => {
  const cart = action.payload;
  state.cartItems = cart.cartItems || [];
  state.itemsPrice = cart.itemsPrice || 0;
  state.shippingPrice = cart.shippingPrice || 0;
  state.taxPrice = cart.taxPrice || 0;
  state.totalPrice = cart.totalPrice || 0;
}
});

export const { addToCart, removeFromCart, clearCart , loadCartFromLocalStorage} = cartSlice.actions;
export default cartSlice.reducer;
