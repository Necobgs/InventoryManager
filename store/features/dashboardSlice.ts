
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import dashboardService from "../../services/dashboardService";
import { DashboardInterface } from "@/interfaces/DashboardInterface";

interface DashboardState {
    dashboards: DashboardInterface[];
    error: string | null;
    loading: boolean;
}

export const initDashboards = createAsyncThunk('dashboard/fetch', async () => {
    return await dashboardService.getDashboards();
});

const initialState: DashboardState = {
    dashboards: [],
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
            .addCase(initDashboards.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(initDashboards.fulfilled, (state, action: PayloadAction<DashboardInterface[]>) => {
                state.dashboards = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(initDashboards.rejected, (state) => {
                state.error = "Erro ao carregar gráficos";
                state.loading = false;
                state.dashboards = [];
            })
    },
});


export const selectDashboards = (state: { dashboard: DashboardState }) => state.dashboard.dashboards;
export const dashboardReducer = dashboardSlice.reducer;