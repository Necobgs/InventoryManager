import { Text, View } from "@/components/Themed";
import Task from "@/interfaces/TaskInterface";
import { Image, StyleSheet } from "react-native";
import StatusTag from "./StatusTag";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";


export default function CardTask(task:Task){
    const router = useRouter()
    
    return (
    <TouchableOpacity style={styles.container} onPress={()=>router.navigate(`/tasks/${task.id}`)} activeOpacity={.6}>
        <Image
        source={task.image}
        style={styles.image}
        />
        <View style={styles.informations}>
            <Text style={styles.title}>
                {task.title}
            </Text>
            <Text 
            style={styles.description}
            ellipsizeMode="tail"
            numberOfLines={3}
            >
                {task.description}
            </Text>
            <StatusTag {...task.status}/>
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
        // height:120,
        padding:15,
        flexDirection:'row',
        gap:15
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
        gap:5
    },
    title:{
        fontSize:16,
        fontWeight:'500',
        marginBottom:2
    },
    description:{
        color:'gray',
        fontSize:12
    }
})