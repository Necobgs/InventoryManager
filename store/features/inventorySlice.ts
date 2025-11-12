
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import inventoryService from "../../services/inventoryService";
import InventoryInterface, { InventoryFilter } from "@/interfaces/InventoryInterface";
import { InventoryFormType } from "@/types/InventoryFormType";

interface InventoryState {
    inventorys: InventoryInterface[];
    inventorysComboBox: InventoryInterface[];
    error: string | null;
    errorGet: string | null;
    loading: boolean;
}

export const initInventorys = createAsyncThunk('inventory/fetch', async (filters: InventoryFilter) => {
    return await inventoryService.getInventorys(filters);
});

export const initInventorysComboBox = createAsyncThunk('inventory/fetchCB', async (filters: InventoryFilter) => {
    return await inventoryService.getInventorys(filters);
});

export const addInventory = createAsyncThunk('inventory/add', async (payload: InventoryFormType, { rejectWithValue }) => {
    try {
        return await inventoryService.addInventory({ ...payload, enabled: true, stock_value: payload.price_per_unity * payload.qty_product });
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Erro ao cadastrar item');
    }
});

export const editInventory = createAsyncThunk('inventory/edit', async (payload: InventoryInterface, { rejectWithValue }) => {
    try {
        return await inventoryService.editInventory({ ...payload,  stock_value: payload.price_per_unity * payload.qty_product });
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Erro ao editar item');
    }
});

export const removeInventory = createAsyncThunk('inventory/remove', async (payload: InventoryInterface, { rejectWithValue }) => {
    try {   
        const response = await inventoryService.removeInventory(payload);
        return response;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Erro ao remover item');
    }
});

const initialState: InventoryState = {
    inventorys: [],
    inventorysComboBox: [],
    error: null,
    errorGet: null,
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
                state.errorGet = null;
            })
            .addCase(initInventorys.fulfilled, (state, action: PayloadAction<InventoryInterface[]>) => {
                state.inventorys = action.payload;
                state.loading = false;
                state.errorGet = null;
            })
            .addCase(initInventorys.rejected, (state) => {
                state.errorGet = "Erro ao carregar lista de itens";
                state.loading = false;
                state.inventorys = [];
            })
            .addCase(initInventorysComboBox.pending, (state) => {
                state.loading = true;
                state.errorGet = null;
            })
            .addCase(initInventorysComboBox.fulfilled, (state, action: PayloadAction<InventoryInterface[]>) => {
                state.inventorysComboBox = action.payload;
                state.loading = false;
                state.errorGet = null;
            })
            .addCase(initInventorysComboBox.rejected, (state) => {
                state.errorGet = "Erro ao carregar lista de itens";
                state.loading = false;
                state.inventorysComboBox = [];
            })
            .addCase(addInventory.fulfilled, (state, action: PayloadAction<InventoryInterface>) => {
                state.inventorys.push(action.payload);
                state.inventorysComboBox.push(action.payload);
                state.error = null;
            })
            .addCase(addInventory.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(removeInventory.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeInventory.fulfilled, (state, action: PayloadAction<InventoryInterface>) => {
                state.inventorys = state.inventorys.filter((t) => t.id !== action.payload.id);
                state.inventorysComboBox = state.inventorysComboBox.filter((t) => t.id !== action.payload.id);
                state.error = null;
                state.loading = false;
            })
            .addCase(removeInventory.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(editInventory.fulfilled, (state, action: PayloadAction<InventoryInterface>) => {
                state.inventorys = state.inventorys.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.inventorysComboBox = state.inventorysComboBox.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.error = null;
            })
            .addCase(editInventory.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});


export const selectInventorys = (state: { inventory: InventoryState }) => state.inventory.inventorys;
export const selectInventorysComboBox = (state: { inventory: InventoryState }) => state.inventory.inventorysComboBox;
export const selectInventoryError = (state: { inventory: InventoryState }) => state.inventory.error;
export const selectInventoryErrorGet = (state: { inventory: InventoryState }) => state.inventory.errorGet;
export const selectInventoryLoading = (state: { inventory: InventoryState }) => state.inventory.loading;

export const { removeAllInventorys } = inventorySlice.actions;
export const inventoryReducer = inventorySlice.reducer;