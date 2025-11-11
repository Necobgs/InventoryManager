
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import supplierService from "../../services/supplierService";
import { SupplierFilter, SupplierForm, SupplierInterface } from "@/interfaces/SupplierInterface";

interface SupplierState {
    suppliers: SupplierInterface[];
    error: string | null;
    errorGet: string | null;
    loading: boolean;
}

export const initSuppliers = createAsyncThunk('supplier/fetch', async (filters: SupplierFilter) => {
    return await supplierService.getSuppliers(filters);
});

export const addSupplier = createAsyncThunk('supplier/add', async (payload: SupplierForm, { rejectWithValue }) => {
    try {
        return await supplierService.addSupplier(payload);
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Erro ao cadastrar fornecedor');
    }
});

export const editSupplier = createAsyncThunk('supplier/edit', async (payload: SupplierInterface, { rejectWithValue }) => {
    try {
        return await supplierService.editSupplier({ ...payload });
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Erro ao editar fornecedor');
    }
});

export const removeSupplier = createAsyncThunk('supplier/remove', async (payload: SupplierInterface, { rejectWithValue }) => {
    try {
        const response = await supplierService.removeSupplier(payload);
        return response;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Erro ao remover fornecedor');
    }
});

const initialState: SupplierState = {
    suppliers: [],
    error: null,
    errorGet: null,
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
                state.errorGet = null;
            })
            .addCase(initSuppliers.fulfilled, (state, action: PayloadAction<SupplierInterface[]>) => {
                state.suppliers = action.payload;
                state.loading = false;
                state.errorGet = null;
            })
            .addCase(initSuppliers.rejected, (state) => {
                state.errorGet = "Erro ao carregar lista de fornecedores";
                state.loading = false;
                state.suppliers = [];
            })
            .addCase(addSupplier.fulfilled, (state, action: PayloadAction<SupplierInterface>) => {
                state.suppliers.push(action.payload);
                state.error = null;
            })
            .addCase(addSupplier.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(removeSupplier.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeSupplier.fulfilled, (state, action: PayloadAction<SupplierInterface>) => {
                state.suppliers = state.suppliers.filter((t) => t.id !== action.payload.id);
                state.error = null;
                state.loading = false;
            })
            .addCase(removeSupplier.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(editSupplier.fulfilled, (state, action: PayloadAction<SupplierInterface>) => {
                state.suppliers = state.suppliers.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.error = null;
            })
            .addCase(editSupplier.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});


export const selectSuppliers = (state: { supplier: SupplierState }) => state.supplier.suppliers;
export const selectSuppliersEnabled = (state: { supplier: SupplierState }) => state.supplier.suppliers ? state.supplier.suppliers.filter(s => s.enabled) : [];
export const selectSupplierError = (state: { supplier: SupplierState }) => state.supplier.error;
export const selectSupplierErrorGet = (state: { supplier: SupplierState }) => state.supplier.errorGet;
export const selectSupplierLoading = (state: { supplier: SupplierState }) => state.supplier.loading;

export const { removeAllSuppliers } = supplierSlice.actions;
export const supplierReducer = supplierSlice.reducer;

