
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import inventoryService from "../../services/inventoryService";
import InventoryInterface from "@/interfaces/InventoryInterface";
import { InventoryFormType } from "@/types/InventoryFormType";

interface InventoryState {
    inventorys: InventoryInterface[];
    error: string | null;
    loading: boolean;
}

export const initInventorys = createAsyncThunk('inventory/fetch', async () => {
    return await inventoryService.getInventorys();
});

export const addInventory = createAsyncThunk('inventory/add', async (payload: InventoryFormType) => {
    return await inventoryService.addInventory({ ...payload, enabled: true, stock_value: payload.price_per_unity * payload.qty_product });
});

export const editInventory = createAsyncThunk('inventory/edit', async (payload: InventoryInterface) => {
    return await inventoryService.editInventory({ ...payload,  stock_value: payload.price_per_unity * payload.qty_product });
});

export const removeInventory = createAsyncThunk('inventory/remove', async (payload: InventoryInterface) => {
    const response = await inventoryService.removeInventory(payload);
    return response;
});


const initialState: InventoryState = {
    inventorys: [],
    error: null,
    loading: false,
};

const inventorySlice = createSlice({
    name: "inventorys",
    initialState,
    reducers: {
        removeAllInventorys(state) {
            state.inventorys = [];
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(initInventorys.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(initInventorys.fulfilled, (state, action: PayloadAction<InventoryInterface[]>) => {
                state.inventorys = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(initInventorys.rejected, (state) => {
                state.error = "Erro ao carregar lista";
                state.loading = false;
                state.inventorys = [];
            })
            .addCase(addInventory.fulfilled, (state, action: PayloadAction<InventoryInterface>) => {
                state.inventorys.push(action.payload);
                state.error = null;
            })
            .addCase(addInventory.rejected, (state) => {
                state.error = "Erro ao adicionar fornecedor";
            })
            .addCase(removeInventory.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeInventory.fulfilled, (state, action: PayloadAction<InventoryInterface>) => {
                state.inventorys = state.inventorys.filter((t) => t.id !== action.payload.id);
                state.error = null;
                state.loading = false;
            })
            .addCase(removeInventory.rejected, (state) => {
                state.error = "Erro ao remover registro";
                state.loading = false;
            })
            .addCase(editInventory.fulfilled, (state, action: PayloadAction<InventoryInterface>) => {
                state.inventorys = state.inventorys.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.error = null;
            })
            .addCase(editInventory.rejected, (state) => {
                state.error = "Erro ao editar fornecedor";
            });
    },
});


export const selectInventorys = (state: { inventory: InventoryState }) => state.inventory.inventorys;
export const selectInventorysEnabled = (state: { inventory: InventoryState }) => state.inventory.inventorys ? state.inventory.inventorys.filter(i => i.enabled) : [];
export const selectInventoryError = (state: { inventory: InventoryState }) => state.inventory.error;
export const selectInventoryLoading = (state: { inventory: InventoryState }) => state.inventory.loading;

export const { removeAllInventorys } = inventorySlice.actions;
export const inventoryReducer = inventorySlice.reducer;