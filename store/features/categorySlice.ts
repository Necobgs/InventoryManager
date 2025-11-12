
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import categoryService from "../../services/categoryService";
import { CategoryFilter, CategoryForm, CategoryInterface } from "@/interfaces/CategoryInterface";

interface CategoryState {
    categories: CategoryInterface[];
    categoriesComboBox: CategoryInterface[];
    error: string | null;
    errorGet: string | null;
    loading: boolean;
}

export const initCategories = createAsyncThunk('category/fetch', async (filters: CategoryFilter) => {
    return await categoryService.getCategories(filters);
});

export const initCategoriesComboBox = createAsyncThunk('category/fetchCB', async (filters: CategoryFilter) => {
    return await categoryService.getCategories(filters);
});

export const addCategory = createAsyncThunk('category/add', async (payload: CategoryForm, { rejectWithValue }) => {
    try {
        return await categoryService.addCategory(payload);
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Erro ao cadastrar categoria');
    }
});

export const editCategory = createAsyncThunk('category/edit', async (payload: CategoryInterface, { rejectWithValue }) => {
    try {
        return await categoryService.editCategory({ ...payload });
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Erro ao editar categoria');
    }
});

export const removeCategory = createAsyncThunk('category/remove', async (payload: CategoryInterface, { rejectWithValue }) => {
    try {
        const response = await categoryService.removeCategory(payload);
        return response;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Erro ao remover categoria');
    }
});

const initialState: CategoryState = {
    categories: [],
    categoriesComboBox: [],
    error: null,
    errorGet: null,
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
                state.errorGet = null;
            })
            .addCase(initCategories.fulfilled, (state, action: PayloadAction<CategoryInterface[]>) => {
                state.categories = action.payload;
                state.loading = false;
                state.errorGet = null;
            })
            .addCase(initCategories.rejected, (state) => {
                state.errorGet = "Erro ao carregar lista de categorias";
                state.loading = false;
                state.categories = [];
            })
            .addCase(initCategoriesComboBox.pending, (state) => {
                state.loading = true;
                state.errorGet = null;
            })
            .addCase(initCategoriesComboBox.fulfilled, (state, action: PayloadAction<CategoryInterface[]>) => {
                state.categoriesComboBox = action.payload;
                state.loading = false;
                state.errorGet = null;
            })
            .addCase(initCategoriesComboBox.rejected, (state) => {
                state.errorGet = "Erro ao carregar lista de categorias";
                state.loading = false;
                state.categoriesComboBox = [];
            })
            .addCase(addCategory.fulfilled, (state, action: PayloadAction<CategoryInterface>) => {
                state.categories.push(action.payload);
                state.categoriesComboBox.push(action.payload);
                state.error = null;
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(removeCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeCategory.fulfilled, (state, action: PayloadAction<CategoryInterface>) => {
                state.categories = state.categories.filter((t) => t.id !== action.payload.id);
                state.categoriesComboBox = state.categoriesComboBox.filter((t) => t.id !== action.payload.id);
                state.error = null;
                state.loading = false;
            })
            .addCase(removeCategory.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(editCategory.fulfilled, (state, action: PayloadAction<CategoryInterface>) => {
                state.categories = state.categories.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.categoriesComboBox = state.categoriesComboBox.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.error = null;
            })
            .addCase(editCategory.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});


export const selectCategories = (state: { category: CategoryState }) => state.category.categories;
export const selectCategoriesComboBox = (state: { category: CategoryState }) => state.category.categoriesComboBox;
export const selectCategoryError = (state: { category: CategoryState }) => state.category.error;
export const selectCategoryErrorGet = (state: { category: CategoryState }) => state.category.errorGet;
export const selectCategoryLoading = (state: { category: CategoryState }) => state.category.loading;

export const { removeAllCategories } = categorySlice.actions;
export const categoryReducer = categorySlice.reducer;

