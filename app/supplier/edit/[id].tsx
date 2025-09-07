import DefaultDialog from "@/components/DefaultDialog";
import { FormInput } from "@/components/FormInput";
import { View } from "@/components/Themed";;
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import * as yup from 'yup';
import { SupplierInterface } from "@/interfaces/SupplierInterface";
import { useSupplier } from "@/contexts/SupplierContext";
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

const schema = yup.object().shape({
    id: yup.number().required(),
    name: yup.string().required('Nome é obrigatório'),
    cnpj: yup.string().required('CNPJ é obrigatório'),
    phone: yup.string().required('Telefone é obrigatório'),
    enabled: yup.boolean().required()
});

const EditSupplier: React.FC = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const supplierContext = useSupplier();
    const supplier = supplierContext.getSuppliersBy("id", +id)[0];
    const router = useRouter();

    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogText, setDialogText] = useState('');

    const showDialog = () => {
    
      setDialogVisible(true);

      setTimeout(() => {
      setDialogVisible(false);
      }, 4000);
    };

    const {
        control,
        handleSubmit,
        formState: { errors },
      } = useForm<SupplierInterface>({
        defaultValues: {
          id: supplier?.id,
          name: supplier?.name,
          cnpj: supplier?.cnpj,
          phone: supplier?.phone,
          enabled: supplier?.enabled
        },
        resolver: yupResolver(schema),
      });

    const updateSupplier = (data: SupplierInterface) => {

        const response = supplierContext.updateSupplier(data);
        setDialogTitle(response.success ? 'Sucesso' : 'Erro');
        setDialogText(response.message);
        showDialog();
    };

    const disableOrEnable = () => {
        
        const response = supplierContext.disableOrEnable(+id);
        setDialogTitle(response.success ? 'Sucesso' : 'Erro');
        setDialogText(response.message);
        showDialog();

        if(response.success) {
            router.navigate("/(tabs)/supplier");
            return;
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.formModal}>

            <FormInput
                control={control}
                name="name"
                label="Nome"
            />

            <FormInput
                control={control}
                name="cnpj"
                label="CNPJ"
            />

            <FormInput
                control={control}
                name="phone"
                label="Telefone"
            />

            <View style={styles.areaButtons}>
                <Button mode="outlined" style={{ width: '45%' }} onPress={handleSubmit(disableOrEnable)}>
                    {supplier?.enabled ? "Desabilitar" : "Habilitar"}
                </Button>
                <Button
                    mode="contained"
                    style={{ width: '45%' }}
                    onPress={handleSubmit(updateSupplier)}
                >
                    Salvar alterações
                </Button>
            </View>

            <DefaultDialog
                visible={dialogVisible}
                onDismiss={() => setDialogVisible(false)}
                title={dialogTitle}
                text={dialogText}
            />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    minHeight:'100%',
    backgroundColor:'rgb(242 242 242)',

  },
  fullWidth: {
    width: '100%',
    marginBottom: 10,
  },
  areaButtons:{ 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: 15 
  },
  formModal:{
    maxWidth:800,
    width:'98%',
    maxHeight:'100%',
    backgroundColor:'#ffff',
    padding:25,
    borderRadius:10,
    gap:15,
    overflowY: 'auto',
  }
});


export default EditSupplier;