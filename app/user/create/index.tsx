import DefaultDialog from "@/components/DefaultDialog";
import { FormInput } from "@/components/FormInput";
import { View } from "@/components/Themed";;
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Button } from "react-native-paper";
import * as yup from 'yup';
import { useState } from "react";
import { UserForm } from "@/interfaces/UserInterface";
import { globalStyles } from "@/styles/globalStyles";
import { useAppDispatch } from "@/store/hooks";
import { addUser } from "@/store/features/userSlice";

const schema = yup.object().shape({
    name: yup.string().required('Nome é obrigatório'),
    email: yup.string().required('Email é obrigatório'),
    password: yup.string().required('Senha é obrigatória'),
    enabled: yup.boolean().required()
});

const CreateUser: React.FC = () => {
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
        reset,
        formState: { errors },
      } = useForm<UserForm>({
        defaultValues: {
          name: '',
          email: '',
          password: '',
          enabled: true,
        },
        resolver: yupResolver(schema),
      });

    const onSubmit = async(data: UserForm) => {
      try {
        await dispatch(addUser(data)).unwrap();
        setDialogTitle('Sucesso');
        setDialogText('Usuário cadastrado com sucesso!');
        reset();
      } catch (error: any) {
        setDialogTitle('Erro');
        setDialogText(error?.message || 'Erro ao cadastrar usuário');
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
                name="email"
                label="Email"
            />

            <FormInput
                control={control}
                name="password"
                label="Senha"
            />

            <Button mode="contained" onPress={handleSubmit(onSubmit)}>
                Cadastar usuário
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

export default CreateUser;