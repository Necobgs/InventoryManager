import { Text, View } from "@/components/Themed";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CardTask from "../components/CardTask";
import Task from "../interfaces/task";

const TAREFAS: Task[]=[
    {
        id:"1",
        title:"t1",
        description:"desc1",
        status:"pending",
        image:"assets/images/icon.png"
    },
    {
        id:"2",
        title:"t2",
        description:"desc2",
        status:"aproved",
        image:"assets/images/icon.png"
    },
    {
        id:"3",
        title:"t2",
        description:"desc2",
        status:"aproved",
        image:"assets/images/icon.png"
    },
    {
        id:"4",
        title:"t2",
        description:"desc2",
        status:"aproved",
        image:"assets/images/icon.png"
    },
    {
        id:"5",
        title:"t2",
        description:"desc2",
        status:"aproved",
        image:"assets/images/icon.png"
    }
]

const Item = ({title}: any) => (
  <View style={{backgroundColor:"red"}}>
    <Text style={{color:'blue'}}>{title}</Text>
  </View>
);


export default function TabTasks(){
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex:1}}>
                <FlatList
                    data={TAREFAS}
                    renderItem={({item})=><CardTask {...item}/>}
                    keyExtractor={(item)=>item.id}
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