import { configureStore } from "@reduxjs/toolkit";
import { supplierReducer } from "./features/supplierSlice";
import { categoryReducer } from "./features/categorySlice";
import { userReducer } from "./features/userSlice";
import { inventoryReducer } from "./features/inventorySlice";

export const store = configureStore({
    reducer: {
        supplier: supplierReducer,
        category: categoryReducer,
        user: userReducer,
        inventory: inventoryReducer,
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;