import GenericCard from "@/components/GenericCard";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { ActivityIndicator, AnimatedFAB, Button } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormInput } from "@/components/FormInput";
import { useAppDispatch } from "@/store/hooks";
import { useSelector } from "react-redux";
import { selectSuppliers, selectSupplierError, selectSupplierLoading, initSuppliers} from '../../store/features/supplierSlice'
import { SupplierInterface } from "@/interfaces/SupplierInterface";
import { globalStyles } from '../../styles/globalStyles';
import { FormMaskedInput } from "@/components/FormMaskedInput";

const schema = yup.object().shape({
    name: yup
    .string()
    .required(),
    cnpj: yup
    .string()
    .required(),
});

export default function tabSupplier() {
    const [enabled, setEnabled] = useState(true);
    const router = useRouter();
    const suppliers = useSelector(selectSuppliers);
    const error = useSelector(selectSupplierError);
    const loading = useSelector(selectSupplierLoading);
    const [filteredSuppliers, setFilteredSuppliers] = useState<SupplierInterface[]>([]);
    const dispatch = useAppDispatch();

    const {
        control,
        watch,
        formState: { isDirty },
    } = useForm<{name: string, cnpj: string}>({
        defaultValues: {
            name: "",
            cnpj: ""
        },
        resolver: yupResolver(schema),
    });

    const name = watch("name");
    const cnpj = watch("cnpj");
    
    useEffect(() => {
        dispatch(initSuppliers());
    }, [dispatch]);

    useEffect(() => {
        setFilteredSuppliers(
            suppliers.filter((supplier)=> supplier["enabled"] == enabled && 
            supplier["cnpj"] == (!cnpj ? supplier["cnpj"] : cnpj) &&
            supplier["name"].toLocaleLowerCase().includes(name.trim().toLocaleLowerCase()))
        );
    },[enabled,name,cnpj,suppliers]);

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

            <View style={{...globalStyles.areaFilters, borderBottomWidth: 0, paddingBottom: 0}}>
                <FormInput
                    control={control}
                    name="name"
                    label="Nome"
                />
            </View>

            <View style={{...globalStyles.areaFilters, paddingTop: 0}}>
                <FormMaskedInput
                    control={control}
                    name="cnpj"
                    label="CNPJ"
                    mask={[/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
                />
            </View>

            <SafeAreaView style={{flex:1}}>
                {!filteredSuppliers[0] || error ? 
                <Text style={globalStyles.msg_empty_list}>{error ? error : `Nenhum fornecedor ${enabled ? "Ativo" : "Inativo"}`}</Text> 
                : 
                <FlatList
                    data={filteredSuppliers}
                    renderItem={({item})=><GenericCard key={item.id} title={`Id: ${item.id.toString()}`} description={item.name} navigateURL={`/supplier/edit/${item.id}`}/>}
                    keyExtractor={(item)=>item.id.toString()}
                    style={globalStyles.list_items}
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
                    style={[globalStyles.fabStyle]}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    )
}