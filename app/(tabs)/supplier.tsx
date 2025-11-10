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
import { selectSuppliers, selectSupplierErrorGet, selectSupplierLoading, initSuppliers} from '../../store/features/supplierSlice'
import { SupplierFilter } from "@/interfaces/SupplierInterface";
import { globalStyles } from '../../styles/globalStyles';
import { FormMaskedInput } from "@/components/FormMaskedInput";
import useTheme from "@/contexts/ThemeContext";
import { formatCep, formatCnpj, formatPhone } from "@/utils/format";

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
    const errorGet = useSelector(selectSupplierErrorGet);
    const loading = useSelector(selectSupplierLoading);
    const dispatch = useAppDispatch();
    const { theme } = useTheme();

    const {
        control,
        watch,
        formState: { isDirty },
    } = useForm<SupplierFilter>({
        defaultValues: {
            name: "",
            cnpj: ""
        },
        resolver: yupResolver(schema),
    });

    const name = watch("name");
    const cnpj = watch("cnpj");
    
    useEffect(() => {
        dispatch(initSuppliers({name, cnpj, enabled}));
    }, [dispatch, name, cnpj, enabled]);

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
                {!suppliers.filter((supplier) => supplier.enabled === enabled)[0] || errorGet ? 
                <Text style={globalStyles.msg_empty_list}>{errorGet ? errorGet : `Nenhum fornecedor ${enabled ? "ativo" : "inativo"}`}</Text> 
                : 
                <FlatList
                    data={suppliers.filter((supplier) => supplier.enabled === enabled)}
                    renderItem={({item})=>
                        <GenericCard 
                            key={item.id} 
                            title={`${item.id} - ${item.name}`} 
                            description={[
                                `CPNJ: ${formatCnpj(item.cnpj)}`, 
                                `Telefone: ${formatPhone(item.phone)}`, 
                                `CEP: ${formatCep(item.cep)}`
                            ]} 
                            navigateURL={`/supplier/edit/${item.id}`}
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
                    onPress={() => router.navigate("/supplier/create")}
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