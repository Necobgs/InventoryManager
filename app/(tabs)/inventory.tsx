import { Text, View } from "@/components/Themed";
import { FlatList } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ActivityIndicator, AnimatedFAB, Button} from "react-native-paper";
import { useEffect, useState } from "react";
import GenericCard from "@/components/GenericCard";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormInput } from "@/components/FormInput";
import { useSelector } from "react-redux";
import { initInventorys, selectInventoryErrorGet, selectInventoryLoading, selectInventorys } from "@/store/features/inventorySlice";
import { InventoryFilter } from "@/interfaces/InventoryInterface";
import { useAppDispatch } from "@/store/hooks";
import { globalStyles } from "@/styles/globalStyles";
import useTheme from "@/contexts/ThemeContext";
import { formatCurrency } from "@/common/FormatCurrency";

const schema = yup.object().shape({
    title: yup
    .string()
    .required(),
    description: yup
    .string()
    .required(),
});

export default function TabInventorys(){
    const [enabled, setEnabled] = useState(true);
    const router = useRouter();
    const inventorys = useSelector(selectInventorys);
    const errorGet = useSelector(selectInventoryErrorGet);
    const loading = useSelector(selectInventoryLoading);
    const dispatch = useAppDispatch();
    const { theme } = useTheme();

    const {
        control,
        watch,
        formState: { isDirty },
    } = useForm<InventoryFilter>({
        defaultValues: {
            title: "",
            description: ""
        },
        resolver: yupResolver(schema),
    });

    const title = watch("title");
    const description = watch("description");

    useEffect(() => {
        dispatch(initInventorys({title, description, enabled}));
    }, [dispatch, title, description, enabled]);
    
    return (
        <SafeAreaProvider>

            {loading &&
            <View>
                <ActivityIndicator animating={true} style={{...globalStyles.loadingList, backgroundColor: theme === "dark" ? "black" : "rgb(242, 242, 242)"}}/>
            </View>}

            <View style={{...globalStyles.areaFilters, borderBottomWidth: 0, paddingBottom: 0}}>
                <Button mode={enabled ? 'contained' : 'outlined'} style={globalStyles.button} onPress={() => {setEnabled(true)}}>Ativos</Button>
                <Button mode={enabled ? 'outlined' : 'contained'} style={globalStyles.button} onPress={() => {setEnabled(false)}}>Inativos</Button>
            </View>

            <View style={{...globalStyles.areaFilters, borderBottomWidth: 0, paddingBottom: 0}}>
                <FormInput
                    control={control}
                    name="title"
                    label="Título"
                />
            </View>

            <View style={{...globalStyles.areaFilters, paddingTop: 0}}>
                <FormInput
                    control={control}
                    name="description"
                    label="Descrição"
                />
            </View>

            <SafeAreaView style={{flex:1}}>
                {!inventorys.filter((inventory) => inventory.enabled === enabled)[0] || errorGet ? 
                <Text style={globalStyles.msg_empty_list}>{ errorGet ? errorGet : `Nenhum item ${enabled ? "ativo" : "inativo"}` }</Text> 
                : 
                <FlatList
                    data={inventorys.filter((inventory) => inventory.enabled === enabled)}
                    renderItem={({item})=>
                        <GenericCard 
                            key={item.id} 
                            title={`${item.id} - ${item.title}`} 
                            description={[
                                item.description, 
                                `Categoria: ${item.category?.title}`, 
                                `Fornecedor: ${item.supplier?.name}`, 
                                `Quantidade: ${item.qty_product}`, 
                                `Preço Unitário: ${formatCurrency(item.price_per_unity)}`, 
                                `Valor em estoque: ${formatCurrency(item.stock_value)}`
                            ]} 
                            navigateURL={`/inventory/edit/${item.id}`}
                        />
                    }
                    keyExtractor={(item)=>item.id.toString()}
                    style={globalStyles.list_items}
                    scrollEnabled={true}
                    contentContainerStyle={{gap:25}}
                    />}
                <AnimatedFAB
                    icon={'plus'}
                    label={'Label'}
                    extended={false}
                    onPress={() => router.navigate("/inventory/create")}
                    visible={true}
                    animateFrom={'right'}
                    iconMode={'static'}
                    color={theme === "dark" ? "rgb(230, 225, 229)" : "rgb(103, 80, 164)"}
                    style={{...globalStyles.fabStyle, backgroundColor: theme === "dark" ? "rgb(39, 39, 41)" : "rgb(234, 221, 255)"}}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    )
}