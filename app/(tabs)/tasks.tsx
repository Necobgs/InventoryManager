import { Text, View } from "@/components/Themed";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CardTask from "../components/CardTask";
import Task from "../interfaces/task";
import { useContext } from "react";
import { useTask } from "../contexts/TaskContext";


const Item = ({title}: any) => (
  <View style={{backgroundColor:"red"}}>
    <Text style={{color:'blue'}}>{title}</Text>
  </View>
);


export default function TabTasks(){
    const taskContext = useTask()
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex:1}}>
                <FlatList
                    data={taskContext.tasks}
                    renderItem={({item})=><CardTask {...item}/>}
                    keyExtractor={(item)=>item.id.toString()}
                    style={styles.lista}
                    scrollEnabled={true}
                    />
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    lista:{
        padding:50
    }
})