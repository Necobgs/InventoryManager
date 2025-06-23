import { Text, View } from "@/components/Themed";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import useCategory from "@/contexts/CategoryContext";
import { useRouter } from "expo-router";
import { AnimatedFAB, Button } from "react-native-paper";
import GenericCard from "@/components/GenericCard";
import { useState } from "react";



export default function TabCategory(){
    const [enabled, setEnabled] = useState(true);
    const useCategoryContext = useCategory();
    const router = useRouter();
    const categories =useCategoryContext.findCategoryBy('enabled',enabled);
    return (
        <SafeAreaProvider>

            <View style={styles.areaButtons}>
                <Button mode={enabled ? 'contained' : 'outlined'} style={styles.button} onPress={() => {setEnabled(true)}}>Ativos</Button>
                <Button mode={enabled ? 'outlined' : 'contained'} style={styles.button} onPress={() => {setEnabled(false)}}>Inativos</Button>
            </View>

            <SafeAreaView style={{flex:1}}>
                {!categories[0] ? 
                <Text style={styles.no_inventorys}>Nenhuma categoria { enabled ? "ativa" : "inativa" }</Text> 
                : 
                <FlatList
                    data={categories}
                    renderItem={({item})=><GenericCard key={item.id} title={`Id: ${item.id.toString()}`} description={item.description} navigateURL={`/category/edit/${item.id}`}/>}
                    keyExtractor={(item)=>item.id.toString()}
                    style={styles.list_inventorys}
                    scrollEnabled={true}
                    contentContainerStyle={{gap:25}}
                    />}
                <AnimatedFAB
                    icon={'plus'}
                    label={'Label'}
                    extended={false}
                    onPress={() => router.navigate("/category/create")}
                    visible={true}
                    animateFrom={'right'}
                    iconMode={'static'}
                    style={[styles.fabStyle]}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    list_inventorys:{
        padding:50,
    },
    no_inventorys:{
        width:'100%',
        height:'100%',
        textAlign:'center',
        alignContent:'center',
        fontSize:20
    },
    btn_add_inventory:{
        backgroundColor:'green',
        color:'white',
        paddingVertical:15,
        borderRadius:5
    },
    div_add_inventory:{
        width:'100%',
        paddingVertical:20,
        paddingHorizontal:50,
        backgroundColor:'#F6F6F6'
    },
    text_btn_add_inventory:{
        textAlign:'center',
        color:'white',
        fontSize:15
    },
    fabStyle: {
        bottom: 16,
        right: 16,
        position: 'absolute',
   },
    areaButtons: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: "rgb(242, 242, 242)",
        padding: 15,
        boxSizing: 'border-box',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(103, 80, 164, 0.3)',
    },
    button: {
        borderRadius: 10,
        width: '50%'
    }
})