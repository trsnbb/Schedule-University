// redux/store.js
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {}, // або просто не вказуй reducer: {}
});

export default store;
