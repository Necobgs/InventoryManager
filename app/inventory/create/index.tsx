// pages/PageTarefasId.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, HelperText, Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useInventory } from '@/contexts/InventoryContext';
import useCategory from '@/contexts/CategoryContext';
import DefaultDialog from '@/components/DefaultDialog';
import { InventoryFormType } from '@/types/InventoryFormType';
import ModalDropdown from '@/components/ModalDropdownCategory';
import { FormInput } from '@/components/FormInput';


const schema = yup.object().shape({
  title: yup.string().required('Título é obrigatório'),
  description: yup.string().required('Descrição é obrigatória'),
  qty_product: yup
    .number()
    .typeError('Quantidade deve ser um número')
    .min(0, 'Não pode ser negativo')
    .required('Quantidade é obrigatória'),
  price_per_unity: yup
    .number()
    .typeError('Valor unitário deve ser um número')
    .min(1, 'Não pode ser negativo ou zero')
    .required('Valor unitário é obrigatório'),
    category: yup
    .object({
        id:yup.number().required(),
        description: yup.string().required(),
        enabled:yup.boolean().required()
    })
    .required("selecione uma categoria")
    .nullable(),    
});

const PageTarefasId: React.FC = () => {
  const inventoryContext = useInventory();
  const categoryContext = useCategory();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogText, setDialogText] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InventoryFormType>({
    defaultValues: {
      title: '',
      description: '',
      qty_product: 0,
      price_per_unity: 0,
      category: null,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: InventoryFormType) => {
    const response = inventoryContext.addInventory(data);
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
          name="title"
          label="Título do item"
      />
      
      <FormInput
          control={control}
          name="description"
          label="Descrição do item"
          multiline
      />


      <FormInput
          control={control}
          name="qty_product"
          label="Quantidade em estoque"
      />

      <FormInput
          control={control}
          name="price_per_unity"
          label="Valor unitário"
          isCurrency
      />

      <Text style={{marginBottom:5,marginLeft:5}}>Categoria</Text>
      <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
      <Controller
        control={control}
        name="category"
        render={({ field: { onChange, value } }) => (
          <>
            <ModalDropdown 
            data={categoryContext.findCategoryBy('enabled',true)}
            initialValue={value}
            onSelect={(categorySelected)=>onChange(categorySelected)}/>
            {errors.price_per_unity && (
              <HelperText type="error">{errors.price_per_unity.message}</HelperText>
            )}
          </>
        )}
      />

      <Button mode="contained" onPress={handleSubmit(onSubmit)}>
        Criar produto
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
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems:'center',
    justifyContent:'center',
    minHeight:'100%'
  },
  fullWidth: {
    width: '100%',
    marginBottom: 10,
  },
  formModal:{
    maxWidth:800,
    width:'98%',
    backgroundColor:'#ffff',
    padding:25,
    borderRadius:10,
    gap:15}
});

export default PageTarefasId;
