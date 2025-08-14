export const updateCart = (state) => {
  const cartData = {
    cartItems: state.cartItems,
    itemsPrice: state.cartItems.reduce((acc, item) => acc + item.qty * item.price, 0),
    shippingPrice: 0, // Customize as needed
    taxPrice: 0,
    totalPrice: 0, // Customize total calculation
  };

  cartData.totalPrice = cartData.itemsPrice + cartData.shippingPrice + cartData.taxPrice;

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (userInfo && userInfo._id) {
    localStorage.setItem(`cart_${userInfo._id}`, JSON.stringify(cartData));
  }

  // Optional: update state too
  state.itemsPrice = cartData.itemsPrice;
  state.shippingPrice = cartData.shippingPrice;
  state.taxPrice = cartData.taxPrice;
  state.totalPrice = cartData.totalPrice;
};
