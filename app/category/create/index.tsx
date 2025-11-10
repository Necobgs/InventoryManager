import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DefaultDialog from '@/components/DefaultDialog';
import { FormInput } from '@/components/FormInput';
import { CategoryForm } from '@/interfaces/CategoryInterface';
import { useAppDispatch } from '@/store/hooks';
import { addCategory, selectCategoryError } from '@/store/features/categorySlice';
import { globalStyles } from '@/styles/globalStyles';
import useTheme from '@/contexts/ThemeContext';
import { useSelector } from 'react-redux';

const schema = yup.object().shape({
  title: yup
    .string()
    .required('o título da categoria é obrigatório'),
  description: yup
    .string()
    .required('A descrição da categoria é obrigatória'),
  color: yup
    .string()
    .required('A cor da categoria é obrigatória')
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Cor deve ser um hex válido (ex: #FF0000)'),
  enabled: yup
    .boolean()
    .required(),
});

export default function PageCategoryCreate() {
  
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogText, setDialogText] = useState('');
  const [isError, setIsError] = useState(false);
  const error = useSelector(selectCategoryError);
  const dispatch = useAppDispatch();
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
    watch,
    formState: { isDirty },
  } = useForm<CategoryForm>({
    defaultValues: {
      title:"",
      description:"",
      color:"",
      enabled: true,
    },
    resolver: yupResolver(schema),
  });

  const color = watch("color");

  const onSubmit = async (data: CategoryForm) => {
    try {
      await dispatch(addCategory(data)).unwrap();
      setDialogTitle('Sucesso');
      setDialogText('Categoria cadastrada com sucesso!');
      showDialog();
      reset();
    } catch (error: any) {
      setIsError(true);
    }
  };

  useEffect(() => {

    if (isError) {
      setDialogTitle('Erro');
      setDialogText(error  || 'Erro ao cadastrar categoria');
      showDialog();
      setIsError(false); 
    }

  }, [error, isError]);

  return (
    <View style={globalStyles.container}>
      <View style={{...globalStyles.formModal, backgroundColor: theme === "dark" ? "rgb(210, 210, 210)" : "white"}}>
        
        <FormInput
          control={control}
          name="title"
          label="Título"
        />

        <FormInput
          control={control}
          name="description"
          label="Descrição"
          multiline
        />

        <FormInput
          control={control}
          name="color"
          label="Cor"
          maxLength={7}
        />

        <View style={{...globalStyles.areaColor, backgroundColor: color}}/>

        <View style={styles.excludeItemView}>
          <Button
            mode="contained"
            style={{ width: '45%' }}
            onPress={handleSubmit(onSubmit)}
          >
            Salvar
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
  excludeItemView:{ 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: 15 
  },
});