import { View } from "@/components/Themed";
import Task from "../interfaces/task";
import { StyleSheet } from "react-native";


export default function CardTask(task:Task){
    return (
     <View style={styles.container}>
        {task.id}
     </View>   
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
        height:120
    }
})