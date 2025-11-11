
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import userService from "../../services/userService";
import { UserFilter, UserForm, UserInterface } from "@/interfaces/UserInterface";
import { UserLoggedInterface } from "@/interfaces/UserLoggedInterface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authService from "@/services/authService";
import { LoginCredentials, LoginInterface } from "@/interfaces/LoginInterface";

interface UserState {
    users: UserInterface[];
    userLogged: UserLoggedInterface | null;
    error: string | null;
    errorGet: string | null;
    loading: boolean;
    token: string,
}

export const initUsers = createAsyncThunk('user/fetch', async (filters: UserFilter) => {
    return await userService.getUsers(filters);
});

export const addUser = createAsyncThunk('user/add', async (payload: UserForm, { rejectWithValue }) => {
    try {
        return await userService.addUser(payload);
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Erro ao castastrar usuário');
    }
});

export const editUser = createAsyncThunk('user/edit', async (payload: UserInterface, { rejectWithValue }) => {
    try {
        return await userService.editUser({ ...payload });
    } catch (error: any) {
        console.log(error)
        return rejectWithValue(error.response?.data?.message || 'Erro ao alterar usuário');
    }
});

export const removeUser = createAsyncThunk('user/remove', async (payload: UserInterface, { rejectWithValue }) => {
    try {
        const response = await userService.removeUser(payload);
        return response;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Erro ao remover usuário');
    }
});

export const validateTokenUser = createAsyncThunk('user/validateToken', async (_, { rejectWithValue }) => {
    try {
        const response = await userService.validateToken();
        return response;
    } catch (error: any) {
        localStorage.removeItem('token');
        return rejectWithValue(error.response?.data?.message || 'Erro ao validar token');
    }
});

export const loginUser = createAsyncThunk('user/login', async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
        const response = await authService.login(credentials);
        return response;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Erro no login');
    }
});
export const logoutUser = createAsyncThunk('user/logout', async () => {
    await AsyncStorage.removeItem("userLogged");
    return null;
});

const initialState: UserState = {
    users: [],
    userLogged: null,
    error: null,
    errorGet: null,
    loading: false,
    token: ""
};

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
      removeAllUsers(state) {
        state.users = [];
        state.token = "";
        state.userLogged = null;
        state.error = null;
        state.loading = false;
      },
    },
    extraReducers: (builder) => {
        builder
            .addCase(initUsers.pending, (state) => {
                state.loading = true;
                state.errorGet = null;
            })
            .addCase(initUsers.fulfilled, (state, action: PayloadAction<UserInterface[]>) => {
                state.users = action.payload;
                state.loading = false;
                state.errorGet = null;
            })
            .addCase(initUsers.rejected, (state) => {
                state.errorGet = "Erro ao carregar lista de usuários";
                state.loading = false;
                state.users = [];
            })
            .addCase(addUser.fulfilled, (state, action: PayloadAction<UserInterface>) => {
                state.users.push(action.payload);
                state.error = null;
            })
            .addCase(addUser.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(removeUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeUser.fulfilled, (state, action: PayloadAction<UserInterface>) => {
                state.users = state.users.filter((t) => t.id !== action.payload.id);
                state.error = null;
                state.loading = false;
            })
            .addCase(removeUser.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(editUser.fulfilled, (state, action: PayloadAction<UserInterface>) => {
                state.users = state.users.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.error = null;
            })
            .addCase(editUser.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(validateTokenUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(validateTokenUser.fulfilled, (state, action: PayloadAction<{user: UserInterface, access_token: string}>) => {
                state.token = action.payload.access_token;
                state.userLogged = action.payload.user;
                state.loading = false;
                state.error = null;
            })
            .addCase(validateTokenUser.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginInterface>) => {
                
                const token = action.payload.access_token;
                let arrayToken = token?.split('.');

                if (arrayToken?.[1]) {
                    state.token = token;
                    state.error = null;

                    const obj = JSON.parse(atob(arrayToken[1]));
                    state.userLogged = {id: obj.id, name: obj.sub};
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
              state.userLogged = null;
              state.error = action.payload as string;
            })
            .addCase(logoutUser.fulfilled, (state, action: PayloadAction<null>) => {
                state.userLogged = null
            });
            
    },
});


export const selectUsers = (state: { user: UserState }) => state.user.users;
export const selectUserLogged = (state: { user: UserState }) => state.user.userLogged;
export const selectUserError = (state: { user: UserState }) => state.user.error;
export const selectUserErrorGet = (state: { user: UserState }) => state.user.errorGet;
export const selectUserLoading = (state: { user: UserState }) => state.user.loading;

export const { removeAllUsers } = userSlice.actions;
export const userReducer = userSlice.reducer;

