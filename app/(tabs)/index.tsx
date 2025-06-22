import Charts from '@/components/Charts';
import { Text, View } from '@/components/Themed';
import { useInventory } from '@/contexts/InventoryContext';
import { useUser } from '@/contexts/UserContext';
import { StyleSheet } from 'react-native';


export default function TabOneScreen() {

  const { userLogged } = useUser();
  const inventoryContext = useInventory();
  const inventorys = inventoryContext.getInventoryBy("enabled", true);

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
