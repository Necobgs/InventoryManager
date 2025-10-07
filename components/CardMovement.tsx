import { StyleSheet,Text } from "react-native";
import { useRouter } from "expo-router";
import { Card, MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { MovementInterface } from "@/interfaces/MovementInterface";
import { useSelector } from "react-redux";
import { initUsers, selectUsers } from "@/store/features/userSlice";
import { selectInventorys } from "@/store/features/inventorySlice";
import { useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";
import useTheme from "@/contexts/ThemeContext";


export default function CardInventory(movement:MovementInterface){
    const router = useRouter();
    const inventorys = useSelector(selectInventorys);
    const users = useSelector(selectUsers);
    const iventory = inventorys.find(i => i.id === movement.inventory?.id);
    const user = users.find(u => u.id === movement.user?.id);
    const dispatch = useAppDispatch();
    const { theme } = useTheme();
    
    const price_at_time = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(movement.price_at_time);
    const value = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(movement.value);
    
    useEffect(() => {
        if (!users[0]) {
            dispatch(initUsers());
        }
    }, [dispatch]);

    return (
    <PaperProvider theme={theme === "dark" ? MD3DarkTheme : MD3LightTheme}>
        <Card mode={theme === "dark" ? "outlined" : "elevated"} style={{backgroundColor: "transparent"}} onPress={()=>router.navigate(`/movements/edit/${(movement.id)}`)}>
            <Card.Content>
                <Text numberOfLines={2} style={{color: theme === "dark" ? "rgb(230, 225, 229)" : "black"}}>
                    <Text style={styles.bold}>Operação: </Text>
                    {movement.quantity > 0 ? "Entrada" : "Saída"}
                </Text> 
                <Text numberOfLines={2} style={{color: theme === "dark" ? "rgb(230, 225, 229)" : "black"}}>
                    <Text style={styles.bold}>Produto: </Text>
                    {iventory?.title}
                </Text>  
                    <Text numberOfLines={2} style={{color: theme === "dark" ? "rgb(230, 225, 229)" : "black"}}>
                    <Text style={styles.bold}>Preço no momento: </Text>
                    {price_at_time}
                </Text> 
                <Text numberOfLines={2} style={{color: theme === "dark" ? "rgb(230, 225, 229)" : "black"}}>
                    <Text style={styles.bold}>Quantidade: </Text>
                    {Math.abs(movement.quantity)}
                </Text> 
                    <Text numberOfLines={2} style={{color: theme === "dark" ? "rgb(230, 225, 229)" : "black"}}>
                    <Text style={styles.bold}>Valor Total: </Text>
                    {value}
                </Text> 
                <Text numberOfLines={3} style={{color: theme === "dark" ? "rgb(230, 225, 229)" : "black"}}>
                    <Text style={styles.bold}>Última alteração: </Text>
                    {`${user?.name} - ${new Date(movement.date).toLocaleDateString("pt-BR", {timeZone: "UTC"})}`}
                </Text> 
            </Card.Content> 
        </Card>  
    </PaperProvider>
    )
}

const styles= StyleSheet.create({
    bold: {
        fontWeight: 'bold',
    }
})

