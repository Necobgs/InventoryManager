import GenericCard from "@/components/GenericCard";
import { Text, View } from "@/components/Themed";
import { useSupplier } from "@/contexts/SupplierContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { AnimatedFAB, Button } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function tabSupplier() {
    const supplierContext = useSupplier();
    const [enabled, setEnabled] = useState(true);
    const router = useRouter();
    const supplierItems = supplierContext.getSuppliersBy('enabled',enabled);

    return (
        <SafeAreaProvider>

            <View style={styles.areaButtons}>
                <Button mode={enabled ? 'contained' : 'outlined'} style={styles.button} onPress={() => {setEnabled(true)}}>Ativos</Button>
                <Button mode={enabled ? 'outlined' : 'contained'} style={styles.button} onPress={() => {setEnabled(false)}}>Inativos</Button>
            </View>

            <SafeAreaView style={{flex:1}}>
                {!supplierItems[0] ? 
                <Text style={styles.no_supplier}>Nenhum fornecedor {enabled ? "Ativo" : "Inativo"}</Text> 
                : 
                <FlatList
                    data={supplierItems}
                    renderItem={({item})=><GenericCard key={item.id} title={`Id: ${item.id.toString()}`} description={item.name} navigateURL={`/supplier/edit/${item.id}`}/>}
                    keyExtractor={(item)=>item.id.toString()}
                    style={styles.list_supplier}
                    scrollEnabled={true}
                    contentContainerStyle={{gap:25}}
                />}
                <AnimatedFAB
                    icon={'plus'}
                    label={'Label'}
                    extended={false}
                    onPress={() => router.navigate("/supplier/create")}
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
    list_supplier:{
        padding:50,
        borderTopWidth:1,
        borderTopColor:'#C2C2C2',
    },
    no_supplier:{
        width:'100%',
        height:'100%',
        textAlign:'center',
        alignContent:'center',
        fontSize:20
    },
    btn_add_supplier:{
        backgroundColor:'green',
        color:'white',
        paddingVertical:15,
        borderRadius:5
    },
    div_add_supplier:{
        width:'100%',
        paddingVertical:20,
        paddingHorizontal:50,
        backgroundColor:'#F6F6F6'
    },
    text_btn_add_supplier:{
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

