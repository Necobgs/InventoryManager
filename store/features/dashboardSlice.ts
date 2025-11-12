
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import dashboardService from "../../services/dashboardService";
import { DashboardInterface } from "@/interfaces/DashboardInterface";

interface DashboardState {
    dashboard: DashboardInterface | null;
    error: string | null;
    loading: boolean;
}

export const initDashboard = createAsyncThunk('dashboard/fetch', async () => {
    return await dashboardService.getDashboard();
});

const initialState: DashboardState = {
    dashboard: null,
    error: null,
    loading: false,
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(initDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(initDashboard.fulfilled, (state, action: PayloadAction<DashboardInterface>) => {
                state.dashboard = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(initDashboard.rejected, (state) => {
                state.error = "Erro ao carregar gráficos";
                state.loading = false;
                state.dashboard = null;
            })
    },
});


export const selectDashboard = (state: { dashboard: DashboardState }) => state.dashboard.dashboard;
export const selectDashboardError = (state: { dashboard: DashboardState }) => state.dashboard.error;
export const selectDashboardLoading = (state: { dashboard: DashboardState }) => state.dashboard.loading;
export const dashboardReducer = dashboardSlice.reducer;