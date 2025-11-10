
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import movementService from "../../services/movementService";
import { MovementFilter, MovementForm, MovementInterface } from "@/interfaces/MovementInterface";

interface MovementState {
    movements: MovementInterface[];
    error: string | null;
    errorGet: string | null;
    loading: boolean;
}

export const initMovements = createAsyncThunk('movement/fetch', async (filters: MovementFilter) => {
    return await movementService.getMovements(filters);
});

export const addMovement = createAsyncThunk('movement/add', async (payload: MovementForm, { rejectWithValue }) => {
    try {
        return await movementService.addMovement(payload);
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Erro ao cadastrar movimentação');
    }
});

export const editMovement = createAsyncThunk('movement/edit', async (payload: MovementInterface, { rejectWithValue }) => {
    try {
        return await movementService.editMovement({ ...payload });
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Erro ao editar movimentação');
    }
});

export const removeMovement = createAsyncThunk('movement/remove', async (payload: MovementInterface, { rejectWithValue }) => {
    try {   
        const response = await movementService.removeMovement(payload);
        return response;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Erro ao remover movimentação');
    }
});

const initialState: MovementState = {
    movements: [],
    error: null,
    errorGet: null,
    loading: false,
};

const movementSlice = createSlice({
    name: "movements",
    initialState,
    reducers: {
        removeAllMovements(state) {
            state.movements = [];
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(initMovements.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(initMovements.fulfilled, (state, action: PayloadAction<MovementInterface[]>) => {
                state.movements = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(initMovements.rejected, (state) => {
                state.errorGet = "Erro ao carregar lista de movimentações";
                state.loading = false;
                state.movements = [];
            })
            .addCase(addMovement.fulfilled, (state, action: PayloadAction<MovementInterface>) => {
                state.movements.push(action.payload);
                state.error = null;
            })
            .addCase(addMovement.rejected, (state, action) => {
                state.error = action.payload as string;;
            })
            .addCase(removeMovement.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeMovement.fulfilled, (state, action: PayloadAction<MovementInterface>) => {
                state.movements = state.movements.filter((t) => t.id !== action.payload.id);
                state.error = null;
                state.loading = false;
            })
            .addCase(removeMovement.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(editMovement.fulfilled, (state, action: PayloadAction<MovementInterface>) => {
                state.movements = state.movements.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.error = null;
            })
            .addCase(editMovement.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const selectMovements = (state: { movement: MovementState }) => state.movement.movements;
export const selectMovementError = (state: { movement: MovementState }) => state.movement.error;
export const selectMovementErrorGet = (state: { movement: MovementState }) => state.movement.errorGet;
export const selectMovementLoading = (state: { movement: MovementState }) => state.movement.loading;

export const { removeAllMovements } = movementSlice.actions;
export const movementReducer = movementSlice.reducer;

