import DefaultDialog from "@/components/DefaultDialog";
import { FormInput } from "@/components/FormInput";
import { View } from "@/components/Themed";;
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Button } from "react-native-paper";
import * as yup from 'yup';
import { useState } from "react";
import { UserInterface } from "@/interfaces/UserInterface";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppDispatch } from "@/store/hooks";
import { useSelector } from "react-redux";
import { editUser, selectUsers } from "@/store/features/userSlice";
import { globalStyles } from "@/styles/globalStyles";
import useTheme from "@/contexts/ThemeContext";

const schema = yup.object().shape({
    id: yup.number().required(),
    name: yup.string().required('Nome é obrigatório'),
    email: yup.string().required('Email é obrigatório'),
    password: yup.string().required('Senha é obrigatória'),
    enabled: yup.boolean().required(),
});

const EditUser: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const users = useSelector(selectUsers);
  const user = users.find(u => u.id === +id);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { theme } = useTheme();

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
          password: user?.password,
          enabled: user?.enabled,
        },
        resolver: yupResolver(schema),
      });

    const updateUser = async(data: UserInterface) => {
      try {
        await dispatch(editUser(data)).unwrap();
        setDialogTitle('Sucesso');
        setDialogText('Usuário alterado com sucesso!');
      } catch (error: any) {
        setDialogTitle('Erro');
        setDialogText(error?.message || 'Erro ao alterar usuário');
      }
      showDialog();
    };

    const disableOrEnable = async(data: UserInterface) => {
      try {
        data.enabled = !data.enabled;
        await dispatch(editUser(data)).unwrap();
        router.back();
      } catch (error: any) {
        setDialogTitle('Erro');
        setDialogText(error?.message || 'Erro ao alterar usuário');
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

            <FormInput
                control={control}
                name="email"
                label="Email"
            />

            <FormInput
                control={control}
                name="password"
                label="Senha"
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