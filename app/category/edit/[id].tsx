import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DefaultDialog from '@/components/DefaultDialog';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FormInput } from '@/components/FormInput';
import { CategoryInterface } from '@/interfaces/CategoryInterface';
import { editCategory, selectCategories, selectCategoryError } from '@/store/features/categorySlice';
import { useAppDispatch } from '@/store/hooks';
import { useSelector } from 'react-redux';
import { globalStyles } from '@/styles/globalStyles';
import useTheme from '@/contexts/ThemeContext';

const schema = yup.object().shape({
  id: yup
    .number()
    .required(),
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

export default function PageCategoryEdit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const categories = useSelector(selectCategories);
  const category = categories.find(c => c.id === +id);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const error = useSelector(selectCategoryError);
  const [isError, setIsError] = useState(false);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogText, setDialogText] = useState('');
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
    watch,
    formState: { isDirty },
  } = useForm<CategoryInterface>({
    defaultValues: {
      id: category?.id,
      title: category?.title,
      description: category?.description,
      color: category?.color,
      enabled: category?.enabled,
    },
    resolver: yupResolver(schema),
  });

  const updateCategory = async(data: CategoryInterface) => {
    try {
      await dispatch(editCategory(data)).unwrap();
      setDialogTitle('Sucesso');
      setDialogText('Categoria alterada com sucesso!');
      showDialog();
    } catch (error: any) {
      setIsError(true);
    }
  }

  const color = watch("color");

  const disableOrEnable = async(data: CategoryInterface) => {
    try {
      data.enabled = !data.enabled;
      await dispatch(editCategory(data)).unwrap();
      router.back();
    } catch (error: any) {
      setIsError(true);
    }
  }

  useEffect(() => {

    if (isError) {
      setDialogTitle('Erro');
      setDialogText(error  || 'Erro ao alterar categoria');
      showDialog();
      setIsError(false); 
    }

  }, [error, isError]);

  return (
    <>
    {!category
    ? <View style={{ alignContent: 'center', alignItems: 'center' }}>
        <Text>Categoria não encontrada</Text>
      </View>
    : <View style={globalStyles.container}>
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
          <Button mode="outlined" style={{ width: '45%' }} onPress={handleSubmit(disableOrEnable)}>
            { category.enabled? 'Desabilitar' : 'Habilitar'}
          </Button>
          <Button
            mode="contained"
            style={{ width: '45%' }}
            onPress={handleSubmit(updateCategory)}
            disabled={!isDirty}
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
    </View>}
    </>
  );
}

const styles = StyleSheet.create({
  excludeItemView:{ 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: 15 
  },
});