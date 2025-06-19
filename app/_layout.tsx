import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import InventoryProvider from '@/contexts/InventoryContext';
import { CategoryProvider } from '@/contexts/CategoryContext';
import UserProvider, { useUser } from '@/contexts/UserContext';
import { Text } from '@/components/Themed';
import { StyleSheet } from 'react-native';


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
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
              <RootLayoutNav />;
          </InventoryProvider>
        </CategoryProvider>
      </InventoryProvider>
    </UserProvider>
  )
  
  
}

interface title{
  id:number
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { userLogged } = useUser();
  const [load, setLoad] = useState(false);
  
  useEffect(() => {

    setTimeout(() => {

      if (!userLogged) router.navigate('/login');
      setLoad(true);
    }, 0);
  }, [])

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Text style={load ? styles.hide : styles.msgload}>Carregando...</Text>
      <Stack>
        <Stack.Screen name="login/index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen 
          name="inventorys/edit/index"
          options={{title:'Detalhes do produto'}}
        />
        <Stack.Screen 
          name="inventory/create/index"
          options={{title:'Criar um produto'}}
        />
      </Stack>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  msgload: {
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(242, 242, 242)',
    width: '100%',
    height: '100%',
    zIndex: 1,
    fontSize: 40,
    fontWeight: 'bold'
  },
  hide: {
    display: 'none'
  }
});