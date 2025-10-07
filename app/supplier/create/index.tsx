import DefaultDialog from "@/components/DefaultDialog";
import { FormInput } from "@/components/FormInput";
import { FormMaskedInput } from "@/components/FormMaskedInput";
import { View } from "@/components/Themed";;
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Button } from "react-native-paper";
import * as yup from 'yup';
import { SupplierForm } from "@/interfaces/SupplierInterface";
import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { addSupplier } from "@/store/features/supplierSlice";
import { globalStyles } from "@/styles/globalStyles";
import useTheme from "@/contexts/ThemeContext";

const schema = yup.object().shape({
    name: yup.string().required('Nome é obrigatório'),
    cnpj: yup.string().required('CNPJ é obrigatório').min(14, 'CNPJ incompleto').max(14, 'CNPJ inválido'),
    phone: yup.string().required('Telefone é obrigatório').min(10, 'Telefone incompleto').max(10, 'Telefone inválido'),
    enabled: yup.boolean().required(),
});

const CreateSupplier: React.FC = () => {

    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogText, setDialogText] = useState('');
    const dispatch = useAppDispatch(); 
    const { theme } = useTheme();

    const showDialog = () => {
      setDialogVisible(true);

      setTimeout(() => {
      setDialogVisible(false);
      }, 4000);
    };

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
      } = useForm<SupplierForm>({
        defaultValues: {
          name: '',
          cnpj: '',
          phone: '',
          enabled: true
        },
        resolver: yupResolver(schema),
      });

    const onSubmit = async (data: SupplierForm) => {
      console.log(data);
      try {
        await dispatch(addSupplier(data)).unwrap();
        setDialogTitle('Sucesso');
        setDialogText('Fornecedor cadastrado com sucesso!');
        reset();
      } catch (error: any) {
        setDialogTitle('Erro');
        setDialogText(error?.message || 'Erro ao cadastrar fornecedor');
      }
      showDialog();
    };

    return (
        <View style={globalStyles.container}>
            <View style={{...globalStyles.formModal, backgroundColor: theme === "dark" ? "rgb(210, 210, 210)" : "white"}}>

            <FormInput
                control={control}
                name="name"
                label="Nome"
            />

            <FormMaskedInput
              control={control}
              name="cnpj"
              label="CNPJ"
              mask={[/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
            />

            <FormMaskedInput
                control={control}
                name="phone"
                label="Telefone"
                mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            />

            <Button mode="contained" onPress={handleSubmit(onSubmit)}>
                Cadastar fornecedor
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

export default CreateSupplier;