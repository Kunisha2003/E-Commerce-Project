import { createSlice } from "@reduxjs/toolkit";

// Initialize state from localStorage
const getInitialFavorites = () => {
  const storedFavorites = localStorage.getItem("favorites");
  return storedFavorites ? JSON.parse(storedFavorites) : [];
};

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: getInitialFavorites(),
  reducers: {
    addToFavorites: (state, action) => {
      const exists = state.some((product) => product.id === action.payload.id);
      if (!exists) {
        const newState = [...state, action.payload];
        localStorage.setItem("favorites", JSON.stringify(newState));
        return newState;
      }
      return state;
    },

    removeFromFavorites: (state, action) => {
      const newState = state.filter((product) => product.id !== action.payload.id);
      localStorage.setItem("favorites", JSON.stringify(newState));
      return newState;
    },

    setFavorites: (state, action) => {
      localStorage.setItem("favorites", JSON.stringify(action.payload));
      return action.payload;
    },
  },
});

export const { addToFavorites, removeFromFavorites, setFavorites } = favoriteSlice.actions;
export const selectFavoriteProduct = (state) => state.favorites;
export default favoriteSlice.reducer;
