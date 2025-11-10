import Charts from '@/components/Charts';
import { Text, View } from '@/components/Themed';
import useTheme from '@/contexts/ThemeContext';
import { initInventorys, selectInventorys } from '@/store/features/inventorySlice';
import { logoutUser, selectUserLogged } from '@/store/features/userSlice';
import { useAppDispatch } from '@/store/hooks';
import { FontAwesome } from '@expo/vector-icons';
import { useEffect } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { useSelector } from 'react-redux';

export default function TabOneScreen() {

  const userLogged = useSelector(selectUserLogged);
  const inventorys = useSelector(selectInventorys);
  const dispatch = useAppDispatch();
  const { theme, alterTheme } = useTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: 'transparent',
      overflowY: 'auto',
      padding: 50,
      paddingTop: 20,
      boxSizing: 'border-box',
    },
    title: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 20,
      fontWeight: 'bold',
    },
    areaActions: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      width: '100%',
      marginBottom: 20,
      gap: 10,
      backgroundColor: 'transparent',
    },
    buttonAction: {
      boxShadow: theme === "dark" ? 'rgba(255, 255, 255, 0.8) 0px 1px 3px' : 'rgba(0, 0, 0, 0.3) 0px 1px 3px', 
      backgroundColor: 'transparent',
      padding: 15,
      borderRadius: 5,
    }
  });

  function Icon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
  }) {
    return <FontAwesome size={26} style={{ marginBottom: -3 }} {...props} />;
  }

  useEffect(() => {
      dispatch(initInventorys({title: '', description: '', enabled: true}));
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <View style={styles.areaActions}>
        <Pressable onPress={() => (dispatch(logoutUser()))}><View style={styles.buttonAction}><Icon name="sign-out" color={theme === "dark" ? "rgb(230, 225, 229)" : 'black'}/></View></Pressable>
        <Pressable onPress={alterTheme}><View style={styles.buttonAction}><Icon name="adjust" color={theme === "dark" ? "rgb(230, 225, 229)" : 'black'}/></View></Pressable>
      </View>
      {inventorys[0] 
      ? <Charts/>
      : <Text style={{...styles.title, color: "rgb(103, 80, 164)"}}>Olá! Seja bem-vindo(a), {userLogged?.name}</Text>}
    </View>
  );
}
