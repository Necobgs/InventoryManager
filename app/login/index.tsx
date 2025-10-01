import { LoginInterface } from "@/interfaces/LoginInterface";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { Text } from "@/components/Themed";
import DefaultDialog from "@/components/DefaultDialog";
import { useEffect, useState } from "react";
import { FormInput } from "@/components/FormInput";
import { useRouter } from "expo-router";
import { useAppDispatch } from "@/store/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "@/store/features/userSlice";
import { UserLoggedInterface } from "@/interfaces/UserLoggedInterface";

const schema = yup.object().shape({
  email: yup.string().required('Nome é obrigatório'),
  password: yup.string().required('Senha é obrigatória'),
});

const Login: React.FC = () => {

    const router = useRouter();
    const dispatch = useAppDispatch();

    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogText, setDialogText] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
      const checkSection = async () => {

        const data_json = await AsyncStorage.getItem("userLogged");
        const data : UserLoggedInterface | undefined = data_json ? JSON.parse(data_json) : undefined;

        if (data) {

          if (data.expire > Date.now()) {
            try {
              
              let user = await dispatch(loginUser({ email: data.email, password: data.password })).unwrap();
              
              if (user) {
                router.push('/');
                reset();
                console.log("login Storage", user)
              }
            } catch {}
          }
        }
      }
      checkSection();
    }, []);

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

    const onSubmit = async (data: LoginInterface) => {
        try {
            let user = await dispatch(loginUser({ email: data.email, password: data.password })).unwrap();
            if (user) {
              router.push('/');
              console.log("login", user)
              reset();
            }
            else {
              setDialogTitle('Erro');
              setDialogText('Email ou Senha inválida');
              setDialogVisible(true);
            }
        } catch (error) {
            setDialogTitle('Erro');
            setDialogText(error as string);
            setDialogVisible(true);
        }
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
            {errorMsg ? <Text style={styles.dialogError}>{errorMsg}</Text> : null}

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