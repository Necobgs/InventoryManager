import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DefaultDialog from '@/components/DefaultDialog';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FormInput } from '@/components/FormInput';
import { CategoryInterface } from '@/interfaces/CategoryInterface';
import { editCategory, selectCategories } from '@/store/features/categorySlice';
import { useAppDispatch } from '@/store/hooks';
import { useSelector } from 'react-redux';
import { globalStyles } from '@/styles/globalStyles';

const schema = yup.object().shape({
    id: yup
        .number()
        .required(),
    description: yup
        .string()
        .required('A descrição da categoria é obrigatória'),
    enabled: yup
        .boolean()
        .required()
});

export default function PageCategoryEdit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const categories = useSelector(selectCategories);
  const category = categories.find(c => c.id === +id);
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
    formState: { isDirty },
  } = useForm<CategoryInterface>({
    defaultValues: {
      id: category?.id,
      description: category?.description,
      enabled: category?.enabled,
    },
    resolver: yupResolver(schema),
  });

  const updateCategory = async(data: CategoryInterface) => {
    try {
      await dispatch(editCategory(data)).unwrap();
      setDialogTitle('Sucesso');
      setDialogText('Categoria alterada com sucesso!');
    } catch (error: any) {
      setDialogTitle('Erro');
      setDialogText(error?.message || 'Erro ao alterar categoria');
    }
    showDialog();
  }

  const disableOrEnable = async(data: CategoryInterface) => {
    try {
      data.enabled = !data.enabled;
      await dispatch(editCategory(data)).unwrap();
      router.back();
    } catch (error: any) {
      setDialogTitle('Erro');
      setDialogText(error?.message || 'Erro ao alterar categoria');
      showDialog();
    }
  }

  return (
    <>
    {!category
    ? <View style={{ alignContent: 'center', alignItems: 'center' }}>
        <Text>Categoria não encontrada</Text>
      </View>
    : <View style={globalStyles.container}>
      <View style={globalStyles.formModal}>
        
          <FormInput
            control={control}
            name="description"
            label="Descrição"
          />

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