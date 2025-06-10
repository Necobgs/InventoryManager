import { Text } from "@/components/Themed";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CardInventory from "@/components/CardInventory";
import { useInventory } from "@/contexts/InventoryContext";
import { useRouter } from "expo-router";
import { AnimatedFAB } from "react-native-paper";



export default function TabInventorys(){
    const inventoryContext = useInventory();
    const router = useRouter();
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex:1}}>
                {!inventoryContext.inventorys[0] ? 
                <Text style={styles.no_inventorys}>Nenhuma tarefa disponível</Text> 
                : 
                <FlatList
                    data={inventoryContext.inventorys}
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
        borderTopWidth:1,
        borderTopColor:'#C2C2C2'
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
})