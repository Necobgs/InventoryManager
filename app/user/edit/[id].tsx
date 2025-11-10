import DefaultDialog from "@/components/DefaultDialog";
import { FormInput } from "@/components/FormInput";
import { View } from "@/components/Themed";;
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Button } from "react-native-paper";
import * as yup from 'yup';
import { useEffect, useState } from "react";
import { UserInterface } from "@/interfaces/UserInterface";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppDispatch } from "@/store/hooks";
import { useSelector } from "react-redux";
import { editUser, selectUserError, selectUsers } from "@/store/features/userSlice";
import { globalStyles } from "@/styles/globalStyles";
import useTheme from "@/contexts/ThemeContext";
import { FormMaskedInput } from "@/components/FormMaskedInput";

const schema = yup.object().shape({
    id: yup.number().required(),
    name: yup.string().required('Nome é obrigatório'),
    email: yup.string().required('Email é obrigatório'),
    phone: yup.string().required('Telefone é obrigatório').min(10, 'Telefone incompleto').max(10, 'Telefone inválido'),
    cep: yup.string().required('CEP é obrigatório').min(8, 'CEP incompleto').max(8, 'CEP inválido'),
    enabled: yup.boolean().required(),
});

const EditUser: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const users = useSelector(selectUsers);
  const user = users.find(u => u.id === +id);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const error = useSelector(selectUserError);
  const [isError, setIsError] = useState(false);

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
    } = useForm<UserInterface>({
      defaultValues: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        enabled: user?.enabled,
        phone: user?.phone,
        cep: user?.cep,
      },
      resolver: yupResolver(schema),
    });

  const updateUser = async(data: UserInterface) => {
    try {
      await dispatch(editUser(data)).unwrap();
      setDialogTitle('Sucesso');
      setDialogText('Usuário alterado com sucesso!');
      showDialog();
    } catch (error: any) {
      setIsError(true);
    }
  };

  const disableOrEnable = async(data: UserInterface) => {
    try {
      data.enabled = !data.enabled;
      await dispatch(editUser(data)).unwrap();
      router.back();
    } catch (error: any) {
      setIsError(true);
    }
  };

  useEffect(() => {

    if (isError) {
      setDialogTitle('Erro');
      setDialogText(error  || 'Erro ao alterar usuário');
      showDialog();
      setIsError(false); 
    }

  }, [error, isError]);

  return (
      <View style={globalStyles.container}>
          <View style={{...globalStyles.formModal, backgroundColor: theme === "dark" ? "rgb(210, 210, 210)" : "white"}}>

          <FormInput
              control={control}
              name="name"
              label="Nome"
          />

          <FormInput
              control={control}
              name="email"
              label="Email"
          />

          <FormMaskedInput
              control={control}
              name="phone"
              label="Telefone"
              mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
          />

          <FormMaskedInput
            control={control}
            name="cep"
            label="CEP"
            mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
          />

          <View style={globalStyles.areaButtons}>
              <Button mode="outlined" style={{ width: '45%' }} onPress={handleSubmit(disableOrEnable)}>
                  {user?.enabled ? "Desabilitar" : "Habilitar"}
              </Button>
              <Button
                  mode="contained"
                  style={{ width: '45%' }}
                  onPress={handleSubmit(updateUser)}
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

export default EditUser;