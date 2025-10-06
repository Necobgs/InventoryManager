
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import userService from "../../services/userService";
import { UserForm, UserInterface } from "@/interfaces/UserInterface";
import { UserLoggedInterface } from "@/interfaces/UserLoggedInterface";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserState {
    users: UserInterface[];
    userLogged: UserLoggedInterface | null;
    error: string | null;
    loading: boolean;
}

export const loginUser = createAsyncThunk('user/login', async ({ email, password }: { email: string, password: string }) => {
  return await userService.login(email, password);
});

export const initUsers = createAsyncThunk('user/fetch', async () => {
    return await userService.getUsers();
});

export const addUser = createAsyncThunk('user/add', async (payload: UserForm) => {
    return await userService.addUser(payload);
});

export const editUser = createAsyncThunk('user/edit', async (payload: UserInterface) => {
    return await userService.editUser({ ...payload });
});

export const removeUser = createAsyncThunk('user/remove', async (payload: UserInterface) => {
    const response = await userService.removeUser(payload);
    return response;
});

export const logoutUser = createAsyncThunk('user/logout', async () => {
    await AsyncStorage.removeItem("userLogged");
    return null;
});

const initialState: UserState = {
    users: [],
    userLogged: null,
    error: null,
    loading: false,
};

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
      removeAllUsers(state) {
        state.users = [];
        state.userLogged = null;
        state.error = null;
        state.loading = false;
      },
    },
    extraReducers: (builder) => {
        builder
            .addCase(initUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(initUsers.fulfilled, (state, action: PayloadAction<UserInterface[]>) => {
                state.users = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(initUsers.rejected, (state) => {
                state.error = "Erro ao carregar lista";
                state.loading = false;
                state.users = [];
            })
            .addCase(addUser.fulfilled, (state, action: PayloadAction<UserInterface>) => {
                state.users.push(action.payload);
                state.error = null;
            })
            .addCase(addUser.rejected, (state) => {
                state.error = "Erro ao adicionar usuário";
            })
            .addCase(removeUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeUser.fulfilled, (state, action: PayloadAction<UserInterface>) => {
                state.users = state.users.filter((t) => t.id !== action.payload.id);
                state.error = null;
                state.loading = false;
            })
            .addCase(removeUser.rejected, (state) => {
                state.error = "Erro ao remover registro";
                state.loading = false;
            })
            .addCase(editUser.fulfilled, (state, action: PayloadAction<UserInterface>) => {
                state.users = state.users.map((t) => (t.id === action.payload.id ? action.payload : t));
                state.error = null;
            })
            .addCase(editUser.rejected, (state) => {
                state.error = "Erro ao editar usuário";
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<UserLoggedInterface | null>) => {
              state.userLogged = action.payload;
              state.error = null;
            })
            .addCase(loginUser.rejected, (state) => {
              console.log("rejected")
              state.userLogged = null;
              state.error = "Usuário ou senha inválidos";
            })
            .addCase(logoutUser.fulfilled, (state, action: PayloadAction<null>) => {
                state.userLogged = action.payload;
            });
            
    },
});


export const selectUsers = (state: { user: UserState }) => state.user.users;
export const selectUserLogged = (state: { user: UserState }) => state.user.userLogged;
export const selectUserError = (state: { user: UserState }) => state.user.error;
export const selectUserLoading = (state: { user: UserState }) => state.user.loading;

export const { removeAllUsers } = userSlice.actions;
export const userReducer = userSlice.reducer;

