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
  const { alterTheme } = useTheme();

  function Icon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
  }) {
    return <FontAwesome size={26} style={{ marginBottom: -3 }} {...props} />;
  }

  useEffect(() => {
      if (!inventorys[0]) {
          dispatch(initInventorys());
      }
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <View style={styles.areaActions}>
        <Pressable onPress={() => (dispatch(logoutUser()))}><View style={styles.buttonAction}><Icon name="sign-out" color='black'/></View></Pressable>
        <Pressable onPress={alterTheme}><View style={styles.buttonAction}><Icon name="adjust" color='black'/></View></Pressable>
      </View>
      {inventorys[0] 
      ? <Charts/>
      : <Text style={styles.title}>Olá! Seja bem-vindo(a), {userLogged?.name}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgb(242, 242, 242)',
    overflowY: 'auto',
    padding: 50,
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
    marginBottom: 10,
    gap: 10,
    backgroundColor: 'transparent',
  },
  buttonAction: {
    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 3px', 
    backgroundColor: 'rgb(242 242 242)',
    padding: 10,
    borderRadius: 5,
  }
});
