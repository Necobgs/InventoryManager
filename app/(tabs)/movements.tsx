import CardMovement from "@/components/CardMovement";
import { Text, View } from "@/components/Themed";
import { useMovements } from "@/contexts/MovementsContext";
import { useRouter } from "expo-router";
import { AnimatedFAB, Button } from "react-native-paper";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

export default function tabMovements() {
    const movementsContext = useMovements();
    const router = useRouter();
    const [operation, setOperation] = useState(1);
    const movementsItems = movementsContext.getMovementsByOperation(operation);

    return (
        <SafeAreaProvider>

            <View style={styles.areaButtons}>
                <Button mode={operation === 1 ? 'contained' : 'outlined'} style={styles.button} onPress={() => {setOperation(1)}}>Entradas</Button>
                <Button mode={operation === 2 ? 'contained' : 'outlined'} style={styles.button} onPress={() => {setOperation(2)}}>Saídas</Button>
            </View>

            <SafeAreaView style={{flex:1}}>
                {!movementsItems[0] ? 
                <Text style={styles.no_movements}>Nenhuma movimentação cadastrada</Text> 
                : 
                <FlatList
                    data={movementsItems}
                    renderItem={({item})=><CardMovement {...item}/>}
                    keyExtractor={(item)=>item.id.toString()}
                    style={styles.list_movements}
                    scrollEnabled={true}
                    contentContainerStyle={{gap:25}}
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
    areaButtons: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: "rgb(242, 242, 242)",
        padding: 15,
        boxSizing: 'border-box',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(103, 80, 164, 0.3)',
    },
    button: {
        borderRadius: 10,
        width: '50%'
    }
})
