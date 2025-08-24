import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import InventoryProvider from '@/contexts/InventoryContext';
import { CategoryProvider } from '@/contexts/CategoryContext';
import UserProvider from '@/contexts/UserContext';
import MovementsProvider from '@/contexts/MovementsContext';
import { useUser } from '@/contexts/UserContext'; 
import SupplierProvider from '@/contexts/SupplierContext';


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Configurações do Expo Router
export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {

  return (
    <UserProvider>
      <InventoryProvider>
        <CategoryProvider>
          <SupplierProvider>
            <InventoryProvider>
              <MovementsProvider>
                <RootLayoutNav />
              </MovementsProvider>
            </InventoryProvider>
          </SupplierProvider>
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
              name="inventory/create/index"
              options={{title:'Criar um produto'}}
            />
            <Stack.Screen 
              name="inventory/edit/[id]"
              options={{title:'Atualizar um produto'}}
            />
            <Stack.Screen 
              name="movements/create/index"
              options={{title:'Criar uma movimentação'}}
            />
            <Stack.Screen 
              name="movements/edit/[id]"
              options={{title:'Atualizar movimentação'}}
            />
            <Stack.Screen 
              name="supplier/create/index"
              options={{title:'Criar um fornecedor'}}
            />
            <Stack.Screen 
              name="supplier/edit/[id]"
              options={{title:'Atualizar fornecedor'}}
            />
            <Stack.Screen 
              name="category/create/index"
              options={{title:'Criar uma categoria'}}
            />
            <Stack.Screen 
              name="category/edit/[id]"
              options={{title:'Atualizar categoria'}}
            />
            <Stack.Screen 
              name="user/create/index"
              options={{title:'Criar uma usuário'}}
            />
            <Stack.Screen 
              name="user/edit/[id]"
              options={{title:'Atualizar usuário'}}
            />
          </Stack.Protected>
              
        </Stack>
    </ThemeProvider>
  );
}