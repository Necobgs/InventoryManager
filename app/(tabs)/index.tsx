import Charts from '@/components/Charts';
import { Text, View } from '@/components/Themed';
import useTheme from '@/contexts/ThemeContext';
import { initDashboard, selectDashboardLoading, selectDashboard } from '@/store/features/dashboardSlice';
import { logoutUser, selectUserLogged } from '@/store/features/userSlice';
import { useAppDispatch } from '@/store/hooks';
import { globalStyles } from '@/styles/globalStyles';
import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useSelector } from 'react-redux';

export default function TabOneScreen() {

  const userLogged = useSelector(selectUserLogged);
  const dashboard = useSelector(selectDashboard);
  const loading = useSelector(selectDashboardLoading);
  const dispatch = useAppDispatch();
  const { theme, alterTheme } = useTheme();
  const [refresh, setRefresh] = useState(true);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: 'transparent',
      overflowY: 'auto',
      padding: 20,
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
    if (refresh) {
      dispatch(initDashboard());
      setRefresh(false);
    }
  }, [dispatch, refresh]);

  return (
    <View style={styles.container}>
      {loading &&
      <View>
          <ActivityIndicator animating={true} style={{...globalStyles.loadingList, backgroundColor: theme === "dark" ? "black" : "rgb(242, 242, 242)"}}/>
      </View>}
      <View style={styles.areaActions}>
        <Pressable onPress={() => (dispatch(logoutUser()))}><View style={styles.buttonAction}><Icon name="sign-out" color={theme === "dark" ? "rgb(230, 225, 229)" : 'black'}/></View></Pressable>
        <Pressable onPress={alterTheme}><View style={styles.buttonAction}><Icon name="adjust" color={theme === "dark" ? "rgb(230, 225, 229)" : 'black'}/></View></Pressable>
        <Pressable onPress={() => {setRefresh(true)}}><View style={styles.buttonAction}><Icon name="rotate-left" color={theme === "dark" ? "rgb(230, 225, 229)" : 'black'}/></View></Pressable>
      </View>
      {dashboard?.inventory 
      ? <Charts refresh={refresh}/>
      : <Text style={{...styles.title, color: "rgb(103, 80, 164)"}}>Olá! Seja bem-vindo(a), {userLogged?.name}</Text>}
    </View>
  );
}
