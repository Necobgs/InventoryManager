import { Text, View } from "@/components/Themed";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CardInventory from "@/components/CardInventory";
import { useInventory } from "@/contexts/InventoryContext";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";



export default function TabInventorys(){
    const inventoryContext = useInventory();
    const router = useRouter();
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex:1}}>
                <View style={styles.div_add_inventory}>
                    <TouchableOpacity style={styles.btn_add_inventory} onPress={()=>router.navigate('/inventory/create')}>
                        <Text style={styles.text_btn_add_inventory}>Adicionar tarefa</Text>
                    </TouchableOpacity>
                </View>
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
    }
})