import { Text, View } from "@/components/Themed";
import Inventory from "@/interfaces/InventoryInterface";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";


export default function CardInventory(inventory:Inventory){
    const router = useRouter()
    
    return (
    <TouchableOpacity style={styles.container} onPress={()=>router.navigate(`/inventory/edit/${inventory.id}`)} activeOpacity={.6}>
        <View style={styles.informations}>
            <Text style={styles.title}>
                {inventory.title}
            </Text>
        </View>
    </TouchableOpacity>   
    )
}

const styles= StyleSheet.create({
    container:{
        backgroundColor:'#f6f6f6',
        borderRadius:'5px',
        shadowColor:"#000",
        shadowOpacity:0.5,
        shadowRadius:4,
        marginBottom:25,
        height:135,
        padding:15,
        flexDirection:'row',
        gap:15,
    },
    image:{
        width:"30%",
        height:"100%",
        borderRadius:5,
        borderColor:'gray',
        borderWidth:1
    },
    informations:{
        width:'60%',
        backgroundColor:'',
        gap:5,
        justifyContent:'space-between'
    },
    title:{
        fontSize:16,
        fontWeight:'500',
        marginBottom:2
    },
    description:{
        color:'gray',
        fontSize:12,
        alignSelf:'flex-start',
        flex:1
    }
})