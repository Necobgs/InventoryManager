import { StyleSheet,Text } from "react-native";
import { useRouter } from "expo-router";
import { Card } from "react-native-paper";
import { MovementsInterface } from "@/interfaces/MovementsInterface";
import { useInventory } from "@/contexts/InventoryContext";
import { useUser } from "@/contexts/UserContext";


export default function CardInventory(movement:MovementsInterface){
    const router = useRouter();
    const inventoryContext = useInventory();
    const userContext = useUser();
    const iventory = inventoryContext.getInventoryBy('id', movement.id_inventory)?.[0];
    const user = userContext.getUsersBy('id', movement.id_user)?.[0];
    const price_at_time = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(movement.price_at_time);
    const value = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(movement.value);
    
    return (
    <Card style={styles.card} mode="elevated" onPress={()=>router.navigate(`/movements/edit/${(movement.id)}`)}>
    <Card.Content>
        <Text numberOfLines={2}>
            <Text style={styles.bold}>Produto: </Text>
            {iventory?.title}
        </Text>  
            <Text numberOfLines={2}>
            <Text style={styles.bold}>Preço no momento: </Text>
            {price_at_time}
        </Text> 
        <Text numberOfLines={2}>
            <Text style={styles.bold}>Quantidade: </Text>
            {movement.quantity}
        </Text> 
            <Text numberOfLines={2}>
            <Text style={styles.bold}>Valor Total: </Text>
            {value}
        </Text> 
        <Text numberOfLines={3}>
            <Text style={styles.bold}>Última alteração: </Text>
            {`${user?.name} - ${movement.date.toLocaleString().replace(",","")}`}
        </Text> 
    </Card.Content> 
    </Card>  
    )
}

const styles= StyleSheet.create({
    card:{
        marginBottom:15, 
    },
    bold: {
        fontWeight: 'bold',
    }
})

