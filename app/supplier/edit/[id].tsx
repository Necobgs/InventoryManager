import DefaultDialog from "@/components/DefaultDialog";
import { FormInput } from "@/components/FormInput";
import { View } from "@/components/Themed";;
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Button, Text } from "react-native-paper";
import * as yup from 'yup';
import { SupplierInterface } from "@/interfaces/SupplierInterface";
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppDispatch } from "@/store/hooks";
import { editSupplier, selectSuppliers } from "@/store/features/supplierSlice";
import { useSelector } from "react-redux";
import { globalStyles } from "@/styles/globalStyles";

const schema = yup.object().shape({
    id: yup.number().required(),
    name: yup.string().required('Nome é obrigatório'),
    cnpj: yup.string().required('CNPJ é obrigatório'),
    phone: yup.string().required('Telefone é obrigatório'),
    enabled: yup.boolean().required()
});

const EditSupplier: React.FC = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const suppliers = useSelector(selectSuppliers);
    const supplier = suppliers?.find(s => s.id === +id);
    const router = useRouter();
    const dispatch = useAppDispatch();

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

    const updateSupplier = async (data: SupplierInterface) => {
      try {
        await dispatch(editSupplier(data)).unwrap();
        setDialogTitle('Sucesso');
        setDialogText('Fornecedor alterado com sucesso!');
      } catch (error: any) {
        setDialogTitle('Erro');
        setDialogText(error?.message || 'Erro ao alterar fornecedor');
      }
      showDialog();
    };

    const disableOrEnable = async (data: SupplierInterface) => {
      try {
        data.enabled = !data.enabled;
        await dispatch(editSupplier(data)).unwrap();
        router.back();
      } catch (error: any) {
        setDialogTitle('Erro');
        setDialogText(error?.message || 'Erro ao alterar fornecedor');
        showDialog();
      }
    }

    return (
      <>
      {!supplier 
      ? <View style={{ alignContent: 'center', alignItems: 'center' }}>
        <Text>Fonecedor não encontrada</Text>
      </View>
      : <View style={globalStyles.container}>
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

          <View style={globalStyles.areaButtons}>
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
      </View>}
      </>
    );
}

export default EditSupplier;