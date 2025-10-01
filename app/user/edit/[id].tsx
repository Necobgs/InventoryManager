import DefaultDialog from "@/components/DefaultDialog";
import { FormInput } from "@/components/FormInput";
import { View } from "@/components/Themed";;
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import * as yup from 'yup';
import { useState } from "react";
import { UserInterface } from "@/interfaces/UserInterface";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppDispatch } from "@/store/hooks";
import { useSelector } from "react-redux";
import { editUser, selectUsers } from "@/store/features/userSlice";

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
        <View style={styles.container}>
            <View style={styles.formModal}>

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

            <View style={styles.areaButtons}>
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


export default EditUser;