import CardMovement from "@/components/CardMovement";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import { ActivityIndicator, AnimatedFAB, Button } from "react-native-paper";
import { FlatList } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { initMovements, selectMovementError, selectMovementLoading, selectMovements } from "@/store/features/movementSlice";
import { MovementInterface } from "@/interfaces/MovementInterface";
import { useAppDispatch } from "@/store/hooks";
import { globalStyles } from "@/styles/globalStyles";
import { initInventorys, selectInventorysEnabled } from "@/store/features/inventorySlice";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormMaskedInput } from "@/components/FormMaskedInput";

const schema = yup.object().shape({
    date: yup.string().required(),
});

export default function tabMovements() {
    const router = useRouter();
    const [operation, setOperation] = useState(1);
    const movements = useSelector(selectMovements);
    const error = useSelector(selectMovementError);
    const loading = useSelector(selectMovementLoading);
    const [filteredMovements, setFilteredMovements] = useState<MovementInterface[]>([]);
    const inventorys = useSelector(selectInventorysEnabled);
    const dispatch = useAppDispatch();

    const {
        control,
        watch,
        formState: { isDirty },
    } = useForm<{date: string}>({
        defaultValues: {
            date: "",    
        },
        resolver: yupResolver(schema),
    });

    const date = watch('date');

    useEffect(() => {
        dispatch(initMovements());

        if (!inventorys[0]) {
            dispatch(initInventorys());
        }
    }, [dispatch]);

    useEffect(() => {

        setFilteredMovements(() => {
            return operation === 1 
                 ? movements.filter((movement) => movement.quantity > 0 && 
                   (date ? new Date(movement.date).toLocaleDateString("pt-BR", {timeZone: "UTC"}) === date : true))
                 : movements.filter((movement) => movement.quantity < 0 &&
                   (date ? new Date(movement.date).toLocaleDateString("pt-BR", {timeZone: "UTC"}) === date : true));
        });
    },[operation,date,movements]);

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


            <View style={globalStyles.areaFilters}>
                <FormMaskedInput
                    control={control}
                    name="date"
                    label="Data da Movimentação"
                    mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                    withFormatting={true}
                />
            </View>

            <SafeAreaView style={{flex:1}}>
                {!filteredMovements[0] || error? 
                <Text style={globalStyles.msg_empty_list}>{error ? error : `Nenhuma movimentação de ${operation === 1 ? "Entrada" : "Saída"} encontrada`}</Text> 
                : 
                <FlatList
                    data={filteredMovements}
                    renderItem={({item})=><CardMovement {...item}/>}
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
                    style={[globalStyles.fabStyle]}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    )
}