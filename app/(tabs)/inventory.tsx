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
import { initInventorys, selectInventoryError, selectInventoryLoading, selectInventorys } from "@/store/features/inventorySlice";
import InventoryInterface from "@/interfaces/InventoryInterface";
import { useAppDispatch } from "@/store/hooks";
import { globalStyles } from "@/styles/globalStyles";
import useTheme from "@/contexts/ThemeContext";

const schema = yup.object().shape({
    description: yup
    .string()
    .required(),
});

export default function TabInventorys(){
    const [enabled, setEnabled] = useState(true);
    const router = useRouter();
    const inventorys = useSelector(selectInventorys);
    const error = useSelector(selectInventoryError);
    const loading = useSelector(selectInventoryLoading);
    const [filteredInventorys, setFilteredInventorys] = useState<InventoryInterface[]>([]);
    const dispatch = useAppDispatch();
    const { theme } = useTheme();

    const {
        control,
        watch,
        formState: { isDirty },
    } = useForm<{description: string}>({
        defaultValues: {
            description: ""
        },
        resolver: yupResolver(schema),
    });

    const description = watch("description");

    useEffect(() => {
        dispatch(initInventorys());
    }, [dispatch]);

    useEffect(() => {
        setFilteredInventorys(
            inventorys.filter((inventory)=> inventory["enabled"] == enabled && 
            inventory["description"].toLocaleLowerCase().includes(description.trim().toLocaleLowerCase()))
        );
    },[enabled,description,inventorys]);
    
    return (
        <SafeAreaProvider>

            {loading && 
            <View>
                <ActivityIndicator animating={true} style={globalStyles.loadingList}/>
            </View>}

            <View style={{...globalStyles.areaFilters, borderBottomWidth: 0, paddingBottom: 0}}>
                <Button mode={enabled ? 'contained' : 'outlined'} style={globalStyles.button} onPress={() => {setEnabled(true)}}>Ativos</Button>
                <Button mode={enabled ? 'outlined' : 'contained'} style={globalStyles.button} onPress={() => {setEnabled(false)}}>Inativos</Button>
            </View>

            <View style={globalStyles.areaFilters}>
                <FormInput
                    control={control}
                    name="description"
                    label="Descrição"
                />
            </View>

            <SafeAreaView style={{flex:1}}>
                {!filteredInventorys[0] || error ? 
                <Text style={globalStyles.msg_empty_list}>{ error ? error : `Nenhum item ${enabled ? "ativo" : "inativo"}` }</Text> 
                : 
                <FlatList
                    data={filteredInventorys}
                    renderItem={({item})=><GenericCard key={item.id} title={`Id: ${item.id.toString()}`} description={item.description} navigateURL={`/inventory/edit/${item.id}`}/>}
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