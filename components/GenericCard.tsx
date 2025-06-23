import { StyleSheet,Text } from "react-native";
import { RelativePathString, useRouter } from "expo-router";
import { Card } from "react-native-paper";
import GenericCardProps from "@/interfaces/GenericCardProps";



export default function GenericCard(props:GenericCardProps){
    const router = useRouter()
    
    return (
    <Card style={styles.container} mode="elevated" onPress={()=>router.navigate(props.navigateURL as RelativePathString) }>
    <Card.Title title={props.title}/>   
    <Card.Content>
        <Text numberOfLines={3}>
            {props.description}
        </Text>    
    </Card.Content> 
    </Card>  
    )
}

const styles= StyleSheet.create({
    container:{
        height:125,
        width:'100%'
    },
})