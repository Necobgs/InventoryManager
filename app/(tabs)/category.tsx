import { Text, View } from "@/components/Themed";
import { FlatList } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ActivityIndicator, AnimatedFAB, Button } from "react-native-paper";
import GenericCard from "@/components/GenericCard";
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormInput } from "@/components/FormInput";
import { initCategories, selectCategories, selectCategoryErrorGet, selectCategoryLoading } from "@/store/features/categorySlice";
import { useSelector } from "react-redux";
import { CategoryFilter } from "@/interfaces/CategoryInterface";
import { useAppDispatch } from "@/store/hooks";
import { globalStyles } from "@/styles/globalStyles";
import useTheme from "@/contexts/ThemeContext";

const schema = yup.object().shape({
    title: yup
    .string()
    .required(),
    description: yup
    .string()
    .required(),
});

export default function TabCategory(){
    const [enabled, setEnabled] = useState(true);
    const router = useRouter();
    const categories = useSelector(selectCategories);
    const errorGet = useSelector(selectCategoryErrorGet);
    const loading = useSelector(selectCategoryLoading);
    const dispatch = useAppDispatch();
    const { theme } = useTheme();

    const {
        control,
        watch,
        formState: { isDirty },
    } = useForm<CategoryFilter>({
        defaultValues: {
            title: "",
            description: ""
        },
        resolver: yupResolver(schema),
    });

    const title = watch("title");
    const description = watch("description");

    useEffect(() => {
        dispatch(initCategories({title, description, enabled}));
    }, [dispatch, title, description, enabled]);

    return (
        <SafeAreaProvider>

            {loading && 
            <View>
                <ActivityIndicator animating={true} style={globalStyles.loadingList}/>
            </View>}

            <View style={{...globalStyles.areaFilters, borderBottomWidth: 0, paddingBottom: 0}}>
                <Button mode={enabled ? 'contained' : 'outlined'} style={globalStyles.button} onPress={() => {setEnabled(true)}}>Ativas</Button>
                <Button mode={enabled ? 'outlined' : 'contained'} style={globalStyles.button} onPress={() => {setEnabled(false)}}>Inativas</Button>
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
                {!categories.filter((categorie) => categorie.enabled === enabled)[0] || errorGet? 
                <Text style={globalStyles.msg_empty_list}>{errorGet ? errorGet : `Nenhuma categoria ${enabled ? "ativa" : "inativa"} encontrada`}</Text> 
                : 
                <FlatList
                    data={categories.filter((categorie) => categorie.enabled === enabled)}
                    renderItem={({item})=>
                        <GenericCard 
                            key={item.id} 
                            title={`${item.id} - ${item.title}`} 
                            description={[item.description]} 
                            colorField={item.color} 
                            navigateURL={`/category/edit/${item.id}`}
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
                    onPress={() => router.navigate("/category/create")}
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