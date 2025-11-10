import { LoginCredentials } from "@/interfaces/LoginInterface";
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
import { loginUser, selectUserError, selectUserLogged, validateTokenUser } from "@/store/features/userSlice";
import useTheme from "@/contexts/ThemeContext";
import { useSelector } from "react-redux";

const schema = yup.object().shape({
  email: yup.string().required('Email é obrigatório'),
  password: yup.string().required('Senha é obrigatória'),
});

const Login: React.FC = () => {

    const router = useRouter();
    const dispatch = useAppDispatch();
    const { theme } = useTheme();

    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogText, setDialogText] = useState('');
    const userLogged = useSelector(selectUserLogged);
    const error = useSelector(selectUserError);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
      const checkSection = async () => {
        try {
          await dispatch(validateTokenUser());
        } catch {}
      }

      checkSection();
    }, [dispatch]);


    useEffect(() => {
      console.log(userLogged)
      if (userLogged) {
        router.push("/");
      }
    }, [userLogged, router]);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<LoginCredentials>({
            defaultValues: {
                email: '',
                password: ''
            },
            resolver: yupResolver(schema),
        });

    const onSubmit = async (data: LoginCredentials) => {
        try {
            await dispatch(loginUser({ email: data.email, password: data.password })).unwrap();
        } catch (error) {
            setIsError(true);
        }
    }

      useEffect(() => {
    
        if (isError) {
          setDialogTitle('Erro');
          setDialogText(error  || 'Erro ao cadastrar categoria');
          setDialogVisible(true);
          setIsError(false); 
        }
    
      }, [error, isError]);

    return (
        <View style={styles.container}>
            <Text style={{...styles.title, color: theme === "dark" ? "white" : "black"}}>Login</Text>

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