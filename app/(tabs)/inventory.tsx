import { Text, View } from "@/components/Themed";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CardInventory from "@/components/CardInventory";
import { useInventory } from "@/contexts/InventoryContext";
import { useRouter } from "expo-router";
import { AnimatedFAB, Button} from "react-native-paper";
import { useState } from "react";



export default function TabInventorys(){
    const [enabled, setEnabled] = useState(true);
    const inventoryContext = useInventory();
    const router = useRouter();
    const inventoryItems =inventoryContext.getInventoryBy('enabled',enabled);
    return (
        <SafeAreaProvider>

            <View style={styles.areaButtons}>
                <Button mode={enabled ? 'contained' : 'outlined'} style={styles.button} onPress={() => {setEnabled(true)}}>Ativos</Button>
                <Button mode={enabled ? 'outlined' : 'contained'} style={styles.button} onPress={() => {setEnabled(false)}}>Inativos</Button>
            </View>

            <SafeAreaView style={{flex:1}}>
                {!inventoryItems[0] ? 
                <Text style={styles.no_inventorys}>Nenhum item { enabled ? "ativo" : "inativo" }</Text> 
                : 
                <FlatList
                    data={inventoryItems}
                    renderItem={({item})=><CardInventory {...item}/>}
                    keyExtractor={(item)=>item.id.toString()}
                    style={styles.list_inventorys}
                    scrollEnabled={true}
                    />}
                <AnimatedFAB
                    icon={'plus'}
                    label={'Label'}
                    extended={false}
                    onPress={() => router.navigate("/inventory/create")}
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
    list_inventorys:{
        padding:50,
        // flex:1,
        // flexDirection:'row'
    },
    no_inventorys:{
        width:'100%',
        height:'100%',
        textAlign:'center',
        alignContent:'center',
        fontSize:20
    },
    btn_add_inventory:{
        backgroundColor:'green',
        color:'white',
        paddingVertical:15,
        borderRadius:5
    },
    div_add_inventory:{
        width:'100%',
        paddingVertical:20,
        paddingHorizontal:50,
        backgroundColor:'#F6F6F6'
    },
    text_btn_add_inventory:{
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