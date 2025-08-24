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

const schema = yup.object().shape({
    id: yup.number().required(),
    name: yup.string().required('Nome é obrigatório'),
    cnpj: yup.string().required('CNPJ é obrigatório'),
    phone: yup.string().required('Telefone é obrigatório')
});

const CreateSupplier: React.FC = () => {
    const supplierContext = useSupplier();

    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogText, setDialogText] = useState('');

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
      } = useForm<SupplierInterface>({
        defaultValues: {
          id: 0,
          name: '',
          cnpj: '',
          phone: '',
        },
        resolver: yupResolver(schema),
      });

    const onSubmit = (data: SupplierInterface) => {

        const response = supplierContext.addSupplier(data);
        setDialogTitle(response.success ? 'Sucesso' : 'Erro');
        setDialogText(response.message);
        setDialogVisible(true);
        if(response.success) reset(); // limpa o formulário
    };

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

            <Button mode="contained" onPress={handleSubmit(onSubmit)}>
                Cadastar movimentação
            </Button>

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


export default CreateSupplier;