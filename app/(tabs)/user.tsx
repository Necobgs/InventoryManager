import GenericCard from "@/components/GenericCard";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { ActivityIndicator, AnimatedFAB, Button } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormInput } from "@/components/FormInput";
import { useSelector } from "react-redux";
import { UserInterface } from "@/interfaces/UserInterface";
import { initUsers, selectUserError, selectUserLoading, selectUsers } from "@/store/features/userSlice";
import { useAppDispatch } from "@/store/hooks";
import { globalStyles } from "@/styles/globalStyles";

const schema = yup.object().shape({
    name: yup
    .string()
    .required(),
    email: yup
    .string()
    .required(),
});

export default function tabUser() {
    const router = useRouter();
    const [enabled, setEnabled] = useState(true);
    const users = useSelector(selectUsers);
    const error = useSelector(selectUserError);
    const loading = useSelector(selectUserLoading);
    const [filteredUsers, setFilteredUsers] = useState<UserInterface[]>([]);
    const dispatch = useAppDispatch();

    const {
        control,
        watch,
        formState: { isDirty },
    } = useForm<{name: string, email: string}>({
        defaultValues: {
            name: "",
            email: ""
        },
        resolver: yupResolver(schema),
    });

    const name = watch("name");
    const email = watch("email");

    useEffect(() => {
        dispatch(initUsers());
    }, [dispatch]);

    useEffect(() => {
        setFilteredUsers(
            users.filter((user)=> user["enabled"] == enabled &&
            user["email"].startsWith(email) && user["name"].toLocaleLowerCase().includes(name.trim().toLocaleLowerCase()))
        );
    },[enabled,name,email,users]);

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
                <FormInput
                    control={control}
                    name="email"
                    label="Email"
                />
            </View>

            <SafeAreaView style={{flex:1}}>
                {!filteredUsers[0] || error ? 
                <Text style={globalStyles.msg_empty_list}>{error ? error : `Nenhum usuário ${enabled ? "Ativo" : "Inativo"}`}</Text> 
                : 
                <FlatList
                    data={filteredUsers}
                    renderItem={({item})=><GenericCard key={item.id} title={`Id: ${item.id.toString()}`} description={item.name} navigateURL={`/user/edit/${item.id}`}/>}
                    keyExtractor={(item)=>item.id.toString()}
                    style={globalStyles.list_items}
                    scrollEnabled={true}
                    contentContainerStyle={{gap:25}}
                />}
                <AnimatedFAB
                    icon={'plus'}
                    label={'Label'}
                    extended={false}
                    onPress={() => router.navigate("/user/create")}
                    visible={true}
                    animateFrom={'right'}
                    iconMode={'static'}
                    style={[globalStyles.fabStyle]}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    )
}