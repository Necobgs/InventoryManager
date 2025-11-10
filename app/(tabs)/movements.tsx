import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import { ActivityIndicator, AnimatedFAB, Button } from "react-native-paper";
import { FlatList } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { initMovements, selectMovementErrorGet, selectMovementLoading, selectMovements } from "@/store/features/movementSlice";
import { MovementFilter, MovementInterface } from "@/interfaces/MovementInterface";
import { useAppDispatch } from "@/store/hooks";
import { globalStyles } from "@/styles/globalStyles";
import { initInventorys, selectInventorys } from "@/store/features/inventorySlice";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useTheme from "@/contexts/ThemeContext";
import GenericCard from "@/components/GenericCard";
import { formatCurrency } from "@/common/FormatCurrency";
import ComboBoxForm from "@/components/ComboBoxForm";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { transparent } from "react-native-paper/lib/typescript/styles/themes/v2/colors";

const schema = yup.object().shape({
    inventory: yup
    .object({
        id:yup.number().required(),
        title: yup.string().required(),
    })
    .required()
    .nullable(),
});

export default function tabMovements() {
    const router = useRouter();
    const [operation, setOperation] = useState(1);
    const movements = useSelector(selectMovements);
    const errorGet = useSelector(selectMovementErrorGet);
    const loading = useSelector(selectMovementLoading);
    const inventorys = useSelector(selectInventorys);
    const dispatch = useAppDispatch();
    const { theme } = useTheme();
    
    const {
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm<MovementFilter>({
        defaultValues: {
            inventory: null,    
        },
        resolver: yupResolver(schema),
    });

    const inventory = watch('inventory');

    useEffect(() => {
        dispatch(initMovements({inventory, operation}));

        dispatch(initInventorys({title: '', description: '', enabled: true}));
    }, [dispatch, inventory, operation]);

    return (
        <SafeAreaProvider>

            {loading && 
            <View>
                <ActivityIndicator animating={true} style={globalStyles.loadingList}/>
            </View>}

            <View style={{...globalStyles.areaFilters, borderBottomWidth: 0, paddingBottom: 0}}>
                <Button mode={operation === 1 ? 'contained' : 'outlined'} style={globalStyles.button} onPress={() => {setOperation(1)}}>Entradas</Button>
                <Button mode={operation === 2 ? 'contained' : 'outlined'} style={globalStyles.button} onPress={() => {setOperation(2)}}>Saídas</Button>
            </View>

            <View style={{...globalStyles.areaFilters, paddingTop: 20, position: "relative"}}>
                <ComboBoxForm
                    data={inventorys}
                    control={control}
                    name="inventory"
                    label="Item"
                    displayKey={'title'}
                    initialValue={inventory}
                    errors={errors}
                />
                <Button style={{display: "flex", alignItems: "center", position: "absolute", right: 5, backgroundColor: "transparent"}} onPress={() => setValue('inventory', null)}><FontAwesome size={16} name="rotate-left" /></Button>
            </View>


            <SafeAreaView style={{flex:1}}>
                {!movements[0] || errorGet? 
                <Text style={globalStyles.msg_empty_list}>{errorGet ? errorGet : `Nenhuma movimentação de ${operation === 1 ? "entrada" : "saída"} encontrada`}</Text> 
                : 
                <FlatList
                    data={movements.filter((movement) => operation === 1 ? (movement.quantity > 0) : (movement.quantity < 0))}
                    renderItem={({item})=>
                        <GenericCard 
                            key={item.id} 
                            title={`${item.id} - ${item.inventory?.title}`} 
                            description={[
                                `Operação: ${item.quantity > 0 ? "Entrada" : "Saída"}`, 
                                `Quantidade: ${Math.abs(item.quantity)}`, 
                                `Preço no momento: ${formatCurrency(item.price_at_time)}`, 
                                `Valor total: ${formatCurrency(Math.abs(item.movement_value))}`,
                                `Usuário Últ. alteração: ${item.user?.name}`,
                            ]} 
                            navigateURL={`/movements/edit/${item.id}`}
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
                    onPress={() => router.navigate("/movements/create")}
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