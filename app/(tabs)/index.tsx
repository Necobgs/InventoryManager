import Charts from '@/components/Charts';
import { Text, View } from '@/components/Themed';
import { initInventorys, selectInventorys } from '@/store/features/inventorySlice';
import { selectUserLogged } from '@/store/features/userSlice';
import { useAppDispatch } from '@/store/hooks';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

export default function TabOneScreen() {

  const userLogged = useSelector(selectUserLogged);
  const inventorys = useSelector(selectInventorys);
  const dispatch = useAppDispatch();

  useEffect(() => {
      if (!inventorys[0]) {
          dispatch(initInventorys());
      }
  }, [dispatch]);

  return (
    <View style={styles.container}>
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
});
