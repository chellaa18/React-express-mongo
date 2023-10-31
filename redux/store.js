// store.js

import { configureStore } from "@reduxjs/toolkit";
import { usersApi } from "./api";
import { productsApi } from "./productApi";

const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(usersApi.middleware)
      .concat(productsApi.middleware),
});

export default store;
