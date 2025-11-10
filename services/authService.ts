import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginCredentials, LoginInterface } from "@/interfaces/LoginInterface";

const api = axios.create({
    baseURL: 'http://localhost:3001/'
});

const endpoint = "auth/login"

const login = async (credentials: LoginCredentials): Promise<LoginInterface> => {
  try {
    const response = await api.post(endpoint, { email: credentials.email, password: credentials.password });
    const { access_token } = response.data;

    if (access_token) {
      await AsyncStorage.setItem('token', access_token);
    }
    return response.data;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};

export default {
    login,
};