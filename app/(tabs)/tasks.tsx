import { Text, View } from "@/components/Themed";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CardTask from "@/components/CardTask";
import { useTask } from "@/contexts/TaskContext";
import { TouchableOpacity } from "react-native";



export default function TabTasks(){
    const taskContext = useTask()
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex:1}}>
                <View style={styles.div_add_task}>
                    <TouchableOpacity style={styles.btn_add_task}>
                        <Text style={styles.text_btn_add_task}>Adicionar tarefa</Text>
                    </TouchableOpacity>
                </View>
                {!taskContext.tasks[0] ? 
                <Text style={styles.no_tasks}>Nenhuma tarefa disponível</Text> 
                : 
                <FlatList
                    data={taskContext.tasks}
                    renderItem={({item})=><CardTask {...item}/>}
                    keyExtractor={(item)=>item.id.toString()}
                    style={styles.list_tasks}
                    scrollEnabled={true}
                    />}
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    list_tasks:{
        padding:50,
        borderTopWidth:1,
        borderTopColor:'#C2C2C2'
    },
    no_tasks:{
        width:'100%',
        height:'100%',
        textAlign:'center',
        alignContent:'center',
        fontSize:20
    },
    btn_add_task:{
        backgroundColor:'green',
        color:'white',
        paddingVertical:15,
        borderRadius:5
    },
    div_add_task:{
        width:'100%',
        paddingVertical:20,
        paddingHorizontal:50,
        backgroundColor:'#F6F6F6'
    },
    text_btn_add_task:{
        textAlign:'center',
        color:'white',
        fontSize:15
    }
})