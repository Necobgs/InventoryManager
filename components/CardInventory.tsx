import Inventory from "@/interfaces/InventoryInterface";
import { StyleSheet,Text } from "react-native";
import { useRouter } from "expo-router";
import { Card } from "react-native-paper";


export default function CardInventory(inventory:Inventory){
    const router = useRouter()
    
    return (
    <Card style={styles.container} mode="elevated" onPress={()=>router.navigate(`/inventory/edit/${inventory.id}`)}>
    <Card.Title title={inventory.title}/>   
    <Card.Content>
        <Text numberOfLines={3}>
            {inventory.description}
        </Text>    
    </Card.Content> 
    </Card>  
    )
}

const styles= StyleSheet.create({
    container:{
        marginBottom:15, 
        height:125,
        maxWidth:400
    },
})