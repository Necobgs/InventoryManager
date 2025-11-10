import DefaultDialog from "@/components/DefaultDialog";
import { FormInput } from "@/components/FormInput";
import { View } from "@/components/Themed";;
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Button } from "react-native-paper";
import * as yup from 'yup';
import { useEffect, useState } from "react";
import { UserForm } from "@/interfaces/UserInterface";
import { globalStyles } from "@/styles/globalStyles";
import { useAppDispatch } from "@/store/hooks";
import { addUser, selectUserError } from "@/store/features/userSlice";
import useTheme from "@/contexts/ThemeContext";
import { FormMaskedInput } from "@/components/FormMaskedInput";
import { useSelector } from "react-redux";

const schema = yup.object().shape({
    name: yup.string().required('Nome é obrigatório'),
    email: yup.string().required('Email é obrigatório'),
    password: yup.string().required('Senha é obrigatória'),
    phone: yup.string().required('Telefone é obrigatório').min(10, 'Telefone incompleto').max(10, 'Telefone inválido'),
    cep: yup.string().required('CEP é obrigatório').min(8, 'CEP incompleto').max(8, 'CEP inválido'),
    enabled: yup.boolean().required()
});

const CreateUser: React.FC = () => {
    const dispatch = useAppDispatch();

    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogText, setDialogText] = useState('');
    const [isError, setIsError] = useState(false);
    const error = useSelector(selectUserError);
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
      } = useForm<UserForm>({
        defaultValues: {
          name: '',
          email: '',
          password: '',
          enabled: true,
          phone: '',
          cep: '',
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
        setIsError(true);
      }
      showDialog();
    };

    useEffect(() => {
  
      if (isError) {
        setDialogTitle('Erro');
        setDialogText(error  || 'Erro ao cadastrar usuário');
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

            <FormInput
                control={control}
                name="password"
                label="Senha"
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