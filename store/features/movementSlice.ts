
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import movementService from "../../services/movementService";
import { MovementForm, MovementInterface } from "@/interfaces/MovementInterface";

interface MovementState {
    movements: MovementInterface[];
    error: string | null;
    loading: boolean;
}

export const initMovements = createAsyncThunk('movement/fetch', async () => {
    return await movementService.getMovements();
});

export const addMovement = createAsyncThunk('movement/add', async (payload: MovementForm) => {
    return await movementService.addMovement(payload);
});

export const editMovement = createAsyncThunk('movement/edit', async (payload: MovementInterface) => {
    return await movementService.editMovement({ ...payload });
});

export const removeMovement = createAsyncThunk('movement/remove', async (payload: MovementInterface) => {
    const response = await movementService.removeMovement(payload);
    return response;
});

const initialState: MovementState = {
    movements: [],
    error: null,
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
                state.error = "Erro ao carregar lista";
                state.loading = false;
                state.movements = [];
            })
            .addCase(addMovement.fulfilled, (state, action: PayloadAction<MovementInterface>) => {
                state.movements.push(action.payload);
                state.error = null;
            })
            .addCase(addMovement.rejected, (state) => {
                state.error = "Erro ao adicionar fornecedor";
            })
            .addCase(removeMovement.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeMovement.fulfilled, (state, action: PayloadAction<MovementInterface>) => {
                state.movements = state.movements.filter((t) => t.id !== action.payload.id);
                state.error = null;
                state.loading = false;
            })
            .addCase(removeMovement.rejected, (state) => {
                state.error = "Erro ao remover registro";
                state.loading = false;
            })
            .addCase(editMovement.fulfilled, (state, action: PayloadAction<MovementInterface>) => {
                state.movements = state.movements.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.error = null;
            })
            .addCase(editMovement.rejected, (state) => {
                state.error = "Erro ao editar fornecedor";
            });
    },
});

export const selectMovements = (state: { movement: MovementState }) => state.movement.movements;
export const selectMovementError = (state: { movement: MovementState }) => state.movement.error;
export const selectMovementLoading = (state: { movement: MovementState }) => state.movement.loading;

export const { removeAllMovements } = movementSlice.actions;
export const movementReducer = movementSlice.reducer;

