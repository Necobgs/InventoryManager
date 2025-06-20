import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import InventoryProvider from '@/contexts/InventoryContext';
import { CategoryProvider } from '@/contexts/CategoryContext';
import UserProvider, { useUser } from '@/contexts/UserContext';
import { StyleSheet, View, Text } from 'react-native';

// Configurações do Expo Router
export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {

  return (
    <UserProvider>
      <InventoryProvider>
        <CategoryProvider>
          <InventoryProvider>
              <RootLayoutNav />
          </InventoryProvider>
        </CategoryProvider>
      </InventoryProvider>
    </UserProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isLoged } = useUser();


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
          <Stack.Screen name="login/index" options={{ headerShown: false }} />
          <Stack.Protected guard={isLoged()} >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
              <Stack.Screen
                name="inventorys/edit/index"
                options={{ title: 'Detalhes do produto' }}
              />
              <Stack.Screen
                name="inventory/create/index"
                options={{ title: 'Criar um produto' }}
              />
          </Stack.Protected>
              
        </Stack>

    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});