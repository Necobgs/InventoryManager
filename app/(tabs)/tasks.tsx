import { Text, View } from "@/components/Themed";
import { FlatList } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const TAREFAS=[
    {
        id:"1",
        title:"t1",
        description:"desc1",
        status:"pending"
    },
    {
        id:"2",
        title:"t2",
        description:"desc2",
        status:"aproved"
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
            <SafeAreaView>
                <FlatList
                data={TAREFAS}
                renderItem={({item})=><Item title={item.title}/>}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    )
}