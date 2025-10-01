import DefaultDialog from "@/components/DefaultDialog";
import { FormInput } from "@/components/FormInput";
import { View } from "@/components/Themed";;
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Button } from "react-native-paper";
import * as yup from 'yup';
import { SupplierForm, SupplierInterface } from "@/interfaces/SupplierInterface";
import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { addSupplier } from "@/store/features/supplierSlice";
import { globalStyles } from "@/styles/globalStyles";

const schema = yup.object().shape({
    name: yup.string().required('Nome é obrigatório'),
    cnpj: yup.string().required('CNPJ é obrigatório'),
    phone: yup.string().required('Telefone é obrigatório'),
    enabled: yup.boolean().required(),
});

const CreateSupplier: React.FC = () => {

    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogText, setDialogText] = useState('');
    const dispatch = useAppDispatch(); 

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
            <View style={globalStyles.formModal}>

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