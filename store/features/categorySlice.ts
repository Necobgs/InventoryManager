
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import categoryService from "../../services/categoryService";
import { CategoryForm, CategoryInterface } from "@/interfaces/CategoryInterface";

interface CategoryState {
    categories: CategoryInterface[];
    error: string | null;
    loading: boolean;
}

export const initCategories = createAsyncThunk('category/fetch', async () => {
    return await categoryService.getCategories();
});

export const addCategory = createAsyncThunk('category/add', async (payload: CategoryForm) => {
    return await categoryService.addCategory(payload);
});

export const editCategory = createAsyncThunk('category/edit', async (payload: CategoryInterface) => {
    return await categoryService.editCategory({ ...payload });
});

export const removeCategory = createAsyncThunk('category/remove', async (payload: CategoryInterface) => {
    const response = await categoryService.removeCategory(payload);
    return response;
});


const initialState: CategoryState = {
    categories: [],
    error: null,
    loading: false,
};

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        removeAllCategories(state) {
            state.categories = [];
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(initCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(initCategories.fulfilled, (state, action: PayloadAction<CategoryInterface[]>) => {
                state.categories = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(initCategories.rejected, (state) => {
                state.error = "Erro ao carregar lista";
                state.loading = false;
                state.categories = [];
            })
            .addCase(addCategory.fulfilled, (state, action: PayloadAction<CategoryInterface>) => {
                state.categories.push(action.payload);
                state.error = null;
            })
            .addCase(addCategory.rejected, (state) => {
                state.error = "Erro ao adicionar fornecedor";
            })
            .addCase(removeCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeCategory.fulfilled, (state, action: PayloadAction<CategoryInterface>) => {
                state.categories = state.categories.filter((t) => t.id !== action.payload.id);
                state.error = null;
                state.loading = false;
            })
            .addCase(removeCategory.rejected, (state) => {
                state.error = "Erro ao remover registro";
                state.loading = false;
            })
            .addCase(editCategory.fulfilled, (state, action: PayloadAction<CategoryInterface>) => {
                state.categories = state.categories.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.error = null;
            })
            .addCase(editCategory.rejected, (state) => {
                state.error = "Erro ao editar fornecedor";
            });
    },
});


export const selectCategories = (state: { category: CategoryState }) => state.category.categories;
export const selectCategoriesEnabled = (state: { category: CategoryState }) => state.category.categories ? state.category.categories.filter(c => c.enabled) : [];
export const selectCategoryError = (state: { category: CategoryState }) => state.category.error;
export const selectCategoryLoading = (state: { category: CategoryState }) => state.category.loading;

export const { removeAllCategories } = categorySlice.actions;
export const categoryReducer = categorySlice.reducer;

