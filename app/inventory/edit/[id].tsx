import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useInventory } from '@/contexts/InventoryContext';
import useCategory from '@/contexts/CategoryContext';
import DefaultDialog from '@/components/DefaultDialog';
import { useLocalSearchParams, useRouter } from 'expo-router';
import InventoryInterface from '@/interfaces/InventoryInterface';
import { FormInput } from '@/components/FormInput';
import ComboBoxForm from '@/components/ComboBoxForm';
import { useSupplier } from '@/contexts/SupplierContext';

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
      id: yup.number().required(),
      description: yup.string().required(),
      enabled:yup.boolean().required()
    })
    .required('Selecione uma categoria')
    .nullable(),
  supplier: yup
      .object({
          id:yup.number().required(),
          name:yup.string().required(),
          cnpj:yup.string().required(),
          phone:yup.string().required(),
          enabled:yup.boolean().required()
      })
      .required("selecione um fonecedor")
      .nullable(),
  id: yup.number().required(),
  stock_value: yup.number().required(),
  enabled: yup.boolean().required(),
});

export default function PageTarefasId() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const inventoryContext = useInventory();
  const oldInventory = inventoryContext.getInventoryBy('id', +id)?.[0];
  const categoryContext = useCategory();
  const supplierContext = useSupplier();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogText, setDialogText] = useState('');
  const router = useRouter();
  const categories = categoryContext.findCategoryBy('enabled',true);
  const suppliers = supplierContext.getSuppliersBy('enabled',true);

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
    setValue,
    formState: { errors, isDirty },
  } = useForm<InventoryInterface>({
    defaultValues: oldInventory || {},
    resolver: yupResolver(schema),
  });

  // Monitora price_per_unity e qty_product para atualizar stock_value
  const pricePerUnity = watch('price_per_unity');
  const qtyProduct = watch('qty_product');

  useEffect(() => {
    setValue('stock_value', pricePerUnity * qtyProduct);
  }, [pricePerUnity, qtyProduct, setValue]);

  // Sincroniza o formulário com o estado do contexto quando ele muda
  useEffect(() => {
    if (oldInventory) {
      reset(oldInventory); // Atualiza o formulário com os dados mais recentes
    }
  }, [inventoryContext.inventorys, reset, oldInventory]);

  if (!oldInventory) {
    return (
      <View style={{ alignContent: 'center', alignItems: 'center' }}>
        <Text>Produto não encontrado</Text>
      </View>
    );
  }

  function disableOrEnable() {
    const response = inventoryContext.disableOrEnable(+id);
    if (response.success) {
      router.navigate('/(tabs)/inventory');
      return
    }
    setDialogTitle(response.success ? 'Sucesso' : 'Erro');
    setDialogText(response.message);
    showDialog();
  }

  function saveChanges(data: InventoryInterface) {
    const response = inventoryContext.updateInventory(data);
    setDialogTitle(response.success ? 'Sucesso' : 'Erro');
    setDialogText(response.message);
    showDialog();
  }

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


        <FormInput
          control={control}
          name="stock_value"
          label="Valor de estoque"
          isCurrency
          disabled
        />

        <ComboBoxForm
          data={categories}
          control={control}
          name="category"
          label="Categoria"
          displayKey={'description'}
          errors={errors}
        />

        <ComboBoxForm
          data={suppliers}
          control={control}
          name="supplier"
          label="Fornecedor"
          errors={errors}
          displayKey={'name'}
        />

        <View style={styles.excludeItemView}>
          <Button mode="outlined" style={{ width: '45%' }} onPress={handleSubmit(disableOrEnable)}>
            {oldInventory.enabled ? 'Desabilitar' : 'Habilitar'}
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
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    minHeight:'100%',
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
    maxHeight: '100%',
    backgroundColor:'#ffff',
    padding:25,
    borderRadius:10,
    gap:15,
    overflowY: 'auto',
  }
});