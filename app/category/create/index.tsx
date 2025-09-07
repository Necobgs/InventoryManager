import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useCategory from '@/contexts/CategoryContext';
import DefaultDialog from '@/components/DefaultDialog';
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

export default function PageCategoryCreate() {
  
  const categoryContext = useCategory();

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
    reset,
    formState: { isDirty },
  } = useForm<CategoryInterface>({
    defaultValues: {
      id:0,
      description:"",
      enabled: true,
    },
    resolver: yupResolver(schema),
  });

  function saveChanges(data: CategoryInterface) {
    const response = categoryContext.addCategory(data);
    setDialogTitle(response.success ? 'Sucesso' : 'Erro');
    setDialogText(response.message);
    showDialog();
    if(response.success) reset();
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
          <Button
            mode="contained"
            style={{ width: '45%' }}
            onPress={handleSubmit(saveChanges)}
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
  container: {
    padding: 20,
    flex: 1,
    minHeight:'100%',
    alignItems:'center',
    justifyContent:'center',
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
    maxHeight:'100%',
    backgroundColor:'#ffff',
    padding:25,
    borderRadius:10,
    gap:15,
    overflowY: 'auto',
  }
});