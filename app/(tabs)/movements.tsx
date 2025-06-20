import CardMovement from "@/components/CardMovement";
import { Text } from "@/components/Themed";
import { useMovements } from "@/contexts/MovementsContext";
import { useRouter } from "expo-router";
import { AnimatedFAB } from "react-native-paper";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function tabMovements() {

    const { movements } = useMovements();
    const router = useRouter();

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex:1}}>
                {!movements[0] ? 
                <Text style={styles.no_movements}>Nenhuma movimentação cadastrada</Text> 
                : 
                <FlatList
                    data={movements}
                    renderItem={({item})=><CardMovement {...item}/>}
                    keyExtractor={(item)=>item.id.toString()}
                    style={styles.list_movements}
                    scrollEnabled={true}
                />}
                <AnimatedFAB
                    icon={'plus'}
                    label={'Label'}
                    extended={false}
                    onPress={() => router.navigate("/movements/create")}
                    visible={true}
                    animateFrom={'right'}
                    iconMode={'static'}
                    style={[styles.fabStyle]}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    list_movements:{
        padding:50,
        borderTopWidth:1,
        borderTopColor:'#C2C2C2',
    },
    no_movements:{
        width:'100%',
        height:'100%',
        textAlign:'center',
        alignContent:'center',
        fontSize:20
    },
    btn_add_movement:{
        backgroundColor:'green',
        color:'white',
        paddingVertical:15,
        borderRadius:5
    },
    div_add_movement:{
        width:'100%',
        paddingVertical:20,
        paddingHorizontal:50,
        backgroundColor:'#F6F6F6'
    },
    text_btn_add_movement:{
        textAlign:'center',
        color:'white',
        fontSize:15
    },
    fabStyle: {
    bottom: 16,
    right: 16,
    position: 'absolute',
  },
})