import { LoginInterface } from "@/interfaces/LoginInterface";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { Text } from "@/components/Themed";
import { useUser } from "@/contexts/UserContext";
import DefaultDialog from "@/components/DefaultDialog";
import { useEffect, useState } from "react";
import { FormInput } from "@/components/FormInput";
import { useRouter } from "expo-router";

const schema = yup.object().shape({
  email: yup.string().required('Nome é obrigatório'),
  password: yup.string().required('Senha é obrigatória'),
});

const Login: React.FC = () => {

    const usersContext = useUser();
    const router = useRouter();

    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogText, setDialogText] = useState('');

    useEffect(() => {
      const checkSection = async () => {
        if(!usersContext.usersLoaded) return;

        const userLogged = await usersContext.getUserLoggedStorage();

        if (userLogged) {

          const data = {email: userLogged.email, password: userLogged.password};
          const response = usersContext.validationLogin(data, userLogged.expire);

          if (response) {
              router.navigate('/');
              reset();
          } 
        }
      }
      checkSection();
    }, [usersContext.usersLoaded]);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<LoginInterface>({
            defaultValues: {
                email: '',
                password: ''
            },
            resolver: yupResolver(schema),
        });

    const onSubmit = (data: LoginInterface) => {
        const response = usersContext.validationLogin(data, 0);
        if (response) {
            router.navigate('/');
            reset();
        } else {
            setDialogTitle('Erro');
            setDialogText('Email ou Senha inválida');
        }
        setDialogVisible(true);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <FormInput
                control={control}
                name="email"
                label="Email"
            />

            <FormInput
                control={control}
                name="password"
                label="Senha"
                isPassword={true}
            />

            <Button style={styles.button} mode="contained" onPress={handleSubmit(onSubmit)}>
                Entrar
            </Button>

            <DefaultDialog
                visible={dialogVisible}
                onDismiss={() => setDialogVisible(false)}
                title={dialogTitle}
                text={dialogText}
            />
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  fullWidth: {
    width: '100%',
    marginBottom: 10,
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    fontSize: 30,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20
  },
  dialogError: {
    position: 'fixed',
    top: 10,
    color: 'red',
  }
});

export default Login;