import { configureStore } from "@reduxjs/toolkit";
import { supplierReducer } from "./features/supplierSlice";
import { categoryReducer } from "./features/categorySlice";
import { userReducer } from "./features/userSlice";
import { inventoryReducer } from "./features/inventorySlice";
import { movementReducer } from "./features/movementSlice";
import { dashboardReducer } from "./features/dashboardSlice";

export const store = configureStore({
    reducer: {
        supplier: supplierReducer,
        category: categoryReducer,
        user: userReducer,
        inventory: inventoryReducer,
        movement: movementReducer,
        dashboard: dashboardReducer,
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;