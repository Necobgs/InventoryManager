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

export default function tabMovements() {
    const router = useRouter();
    const [operation, setOperation] = useState(1);
    const movements = useSelector(selectMovements);
    const error = useSelector(selectMovementError);
    const loading = useSelector(selectMovementLoading);
    const [filteredMovements, setFilteredMovements] = useState<MovementInterface[]>([]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(initMovements());
    }, [dispatch]);

    useEffect(() => {
        setFilteredMovements(() => {
            return operation === 1 ? movements.filter((movement) => movement["quantity"] > 0) : movements.filter((movement) => movement["quantity"] < 0);
        });
    },[operation,movements]);

    return (
        <SafeAreaProvider>

            {loading && 
            <View>
                <ActivityIndicator animating={true} style={globalStyles.loadingList}/>
            </View>}

            <View style={globalStyles.areaFilters}>
                <Button mode={operation === 1 ? 'contained' : 'outlined'} style={globalStyles.button} onPress={() => {setOperation(1)}}>Entradas</Button>
                <Button mode={operation === 2 ? 'contained' : 'outlined'} style={globalStyles.button} onPress={() => {setOperation(2)}}>Saídas</Button>
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