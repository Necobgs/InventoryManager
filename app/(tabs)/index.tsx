import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useUser } from '@/contexts/UserContext';

export default function TabOneScreen() {

  const { userLogged } = useUser();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá! Seja bem-vindo(a), {userLogged?.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(242, 242, 242)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
