import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DefaultDialog from '@/components/DefaultDialog';
import { FormInput } from '@/components/FormInput';
import { CategoryInterface, CategoryForm } from '@/interfaces/CategoryInterface';
import { useAppDispatch } from '@/store/hooks';
import { addCategory } from '@/store/features/categorySlice';
import { globalStyles } from '@/styles/globalStyles';
import useTheme from '@/contexts/ThemeContext';

const schema = yup.object().shape({
  description: yup
    .string()
    .required('A descrição da categoria é obrigatória'),
  enabled: yup
    .boolean()
    .required()
});

export default function PageCategoryCreate() {
  
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogText, setDialogText] = useState('');
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
    formState: { isDirty },
  } = useForm<CategoryForm>({
    defaultValues: {
      description:"",
      enabled: true,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: CategoryForm) => {
    try {
      await dispatch(addCategory(data)).unwrap();
      setDialogTitle('Sucesso');
      setDialogText('Categoria cadastrada com sucesso!');
      reset();
    } catch (error: any) {
      setDialogTitle('Erro');
      setDialogText(error?.message || 'Erro ao cadastrar categoria');
    }
    showDialog();
  };

  return (
    <View style={globalStyles.container}>
      <View style={{...globalStyles.formModal, backgroundColor: theme === "dark" ? "rgb(210, 210, 210)" : "white"}}>
        
          <FormInput
            control={control}
            name="description"
            label="Descrição"
          />

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