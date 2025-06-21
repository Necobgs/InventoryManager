import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useCategory from '@/contexts/CategoryContext';
import DefaultDialog from '@/components/DefaultDialog';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FormInput } from '@/components/FormInput';
import CategoryInterface from '@/interfaces/CategoryInterface';


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
  const categoryContext = useCategory();
  const oldCategory = categoryContext.findCategoryBy('id', +id)[0];
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogText, setDialogText] = useState('');
  const router = useRouter()

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<CategoryInterface>({
    defaultValues: oldCategory || {},
    resolver: yupResolver(schema),
  });

  // Sincroniza o formulário com o estado do contexto quando ele muda
  useEffect(() => {
    if (oldCategory) {
      reset(oldCategory); // Atualiza o formulário com os dados mais recentes
    }
  }, [categoryContext.categories, reset, oldCategory]);

  if (!oldCategory) {
    return (
      <View style={{ alignContent: 'center', alignItems: 'center' }}>
        <Text>Produto não encontrado</Text>
      </View>
    );
  }

  function removeCategory() {
    const response = categoryContext.removeCategory(+id);
    setDialogTitle(response.success ? 'Sucesso' : 'Erro');
    setDialogText(response.message);
    setDialogVisible(true);
    if (response.success) {
      router.navigate('/(tabs)/category');
    }
  }

  function saveChanges(data: CategoryInterface) {
    const response = categoryContext.updateCategory(data);
    setDialogTitle(response.success ? 'Sucesso' : 'Erro');
    setDialogText(response.message);
    setDialogVisible(true);
  }

  return (
    <View style={styles.container}>
      <View style={styles.formModal}>
        
          <FormInput
            control={control}
            name="description"
            label="Descrição"
          />

        <View style={styles.excludeItemView}>
          <Button mode="outlined" style={{ width: '45%' }} onPress={handleSubmit(removeCategory)}>
            Excluir produto
          </Button>
          <Button
            mode="contained"
            style={{ width: '45%' }}
            onPress={handleSubmit(saveChanges)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    minHeight:'100%',
    alignItems:'center',
    justifyContent:'center'
  },
  fullWidth: {
    width: '100%',
    marginBottom: 10,
  },
  excludeItemView:{ 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: 15 
  },
  formModal:{
    maxWidth:800,
    width:'98%',
    backgroundColor:'#ffff',
    padding:25,
    borderRadius:10,
    gap:15}
});