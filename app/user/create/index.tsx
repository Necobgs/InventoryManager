import DefaultDialog from "@/components/DefaultDialog";
import { FormInput } from "@/components/FormInput";
import { View } from "@/components/Themed";;
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import * as yup from 'yup';
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { UserInterface } from "@/interfaces/UserInterface";

const schema = yup.object().shape({
    id: yup.number().required(),
    name: yup.string().required('Nome é obrigatório'),
    email: yup.string().required('Email é obrigatório'),
    password: yup.string().required('Senha é obrigatória')
});

const CreateUser: React.FC = () => {
    const userContext = useUser();

    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogText, setDialogText] = useState('');

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
      } = useForm<UserInterface>({
        defaultValues: {
          id: 0,
          name: '',
          email: '',
          password: '',
        },
        resolver: yupResolver(schema),
      });

    const onSubmit = (data: UserInterface) => {

        const response = userContext.addUser(data);
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


export default CreateUser;