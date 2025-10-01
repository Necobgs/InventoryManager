
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import supplierService from "../../services/supplierService";
import { SupplierForm, SupplierInterface } from "@/interfaces/SupplierInterface";

interface SupplierState {
    suppliers: SupplierInterface[];
    error: string | null;
    loading: boolean;
}

export const initSuppliers = createAsyncThunk('supplier/fetch', async () => {
    return await supplierService.getSuppliers();
});

export const addSupplier = createAsyncThunk('supplier/add', async (payload: SupplierForm) => {
    return await supplierService.addSupplier(payload);
});

export const editSupplier = createAsyncThunk('supplier/edit', async (payload: SupplierInterface) => {
    return await supplierService.editSupplier({ ...payload });
});

export const removeSupplier = createAsyncThunk('supplier/remove', async (payload: SupplierInterface) => {
    const response = await supplierService.removeSupplier(payload);
    return response;
});

const initialState: SupplierState = {
    suppliers: [],
    error: null,
    loading: false,
};

const supplierSlice = createSlice({
    name: "suppliers",
    initialState,
    reducers: {
        removeAllSuppliers(state) {
            state.suppliers = [];
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(initSuppliers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(initSuppliers.fulfilled, (state, action: PayloadAction<SupplierInterface[]>) => {
                state.suppliers = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(initSuppliers.rejected, (state) => {
                state.error = "Erro ao carregar lista";
                state.loading = false;
                state.suppliers = [];
            })
            .addCase(addSupplier.fulfilled, (state, action: PayloadAction<SupplierInterface>) => {
                state.suppliers.push(action.payload);
                state.error = null;
            })
            .addCase(addSupplier.rejected, (state) => {
                state.error = "Erro ao adicionar fornecedor";
            })
            .addCase(removeSupplier.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeSupplier.fulfilled, (state, action: PayloadAction<SupplierInterface>) => {
                state.suppliers = state.suppliers.filter((t) => t.id !== action.payload.id);
                state.error = null;
                state.loading = false;
            })
            .addCase(removeSupplier.rejected, (state) => {
                state.error = "Erro ao remover registro";
                state.loading = false;
            })
            .addCase(editSupplier.fulfilled, (state, action: PayloadAction<SupplierInterface>) => {
                state.suppliers = state.suppliers.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.error = null;
            })
            .addCase(editSupplier.rejected, (state) => {
                state.error = "Erro ao editar fornecedor";
            });
    },
});


export const selectSuppliers = (state: { supplier: SupplierState }) => state.supplier.suppliers;
export const selectSuppliersEnabled = (state: { supplier: SupplierState }) => state.supplier.suppliers ? state.supplier.suppliers.filter(s => s.enabled) : [];
export const selectSupplierError = (state: { supplier: SupplierState }) => state.supplier.error;
export const selectSupplierLoading = (state: { supplier: SupplierState }) => state.supplier.loading;

export const { removeAllSuppliers } = supplierSlice.actions;
export const supplierReducer = supplierSlice.reducer;

