import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import InventoryProvider from '@/contexts/InventoryContext';
import { CategoryProvider } from '@/contexts/CategoryContext';
import UserProvider from '@/contexts/UserContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Import screen components (adjust paths based on your project structure)
import TabOneScreen from './(tabs)';
// import InventoryEditScreen from '../app/inventorys/edit/index';
// import InventoryCreateScreen from '../app/inventory/create/index';

const DrawerNav = createDrawerNavigator();

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

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

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="login/index" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          <Stack.Screen 
            name="inventorys/edit/index"
            options={{ title: 'Detalhes do produto' }}
          />
          <Stack.Screen 
            name="inventory/create/index"
            options={{ title: 'Criar um produto' }}
          />
          <Stack.Screen 
            name="inventory/edit/[id]"
            options={{ title: 'Atualizar um produto' }}
          />
        </Stack>
        <DrawerNav.Navigator
          initialRouteName="index"
          screenOptions={{
            headerStyle: {
              backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff',
            },
            headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
            drawerStyle: {
              backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff',
            },
          }}
        >
          <DrawerNav.Screen
            name="index"
            component={TabOneScreen}
            options={{
              drawerLabel: 'Home',
              title: 'Home',
              drawerIcon: ({ color, size }) => (
                <FontAwesome name="home" size={size} color={color} />
              ),
            }}
          />
          {/* <DrawerNav.Screen
            name="inventorys/edit/index"
            component={InventoryEditScreen}
            options={{
              drawerLabel: 'Inventory Details',
              title: 'Detalhes do produto',
              drawerIcon: ({ color, size }) => (
                <FontAwesome name="list" size={size} color={color} />
              ),
            }}
          />
          <DrawerNav.Screen
            name="inventory/create/index"
            component={InventoryCreateScreen}
            options={{
              drawerLabel: 'Create Product',
              title: 'Criar um produto',
              drawerIcon: ({ color, size }) => (
                <FontAwesome name="plus" size={size} color={color} />
              ),
            }}
          /> */}
        </DrawerNav.Navigator>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}