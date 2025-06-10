import { Text } from "@/components/Themed";
import { StyleSheet } from "react-native";
import { InventoryStatusConst } from "@/constants/Status";
import InventoryStatusInterface from "@/interfaces/InventoryStatusInterface";


export default function StatusTag(status:InventoryStatusInterface){
    const statusMap: Record<number,any>= {
        1:styles.finished,
        2:styles.in_processing,
        3:styles.newInventory
    }
    return (
        <Text style={statusMap[status.id]}>
            {status.description}
        </Text>
    )
}

const styles = StyleSheet.create({
    finished:{
        borderRadius:5,
        backgroundColor:"#dcfce7",
        color:"#166534",
        paddingHorizontal:6,
        paddingVertical:2,
        alignSelf:'flex-end',
        textAlign:'center'
    },
    newInventory:{
        borderRadius:5,
        backgroundColor:"#dbeafe",
        color:"#1e3a8a",
        paddingHorizontal:6,
        paddingVertical:2,
        alignSelf:'flex-end',
        textAlign:'center'
    },
    in_processing:{
        borderRadius:5,
        backgroundColor:"#e5e7eb",
        color:"#374151",
        paddingHorizontal:6,
        paddingVertical:2,
        alignSelf:'flex-end',
        textAlign:'center'
    }
})