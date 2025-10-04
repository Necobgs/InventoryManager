import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DefaultDialog from '@/components/DefaultDialog';
import { useLocalSearchParams, useRouter } from 'expo-router';
import InventoryInterface from '@/interfaces/InventoryInterface';
import { FormInput } from '@/components/FormInput';
import ComboBoxForm from '@/components/ComboBoxForm';
import { globalStyles } from '@/styles/globalStyles';
import { useSelector } from 'react-redux';
import { initCategories, selectCategoriesEnabled } from '@/store/features/categorySlice';
import { initSuppliers, selectSuppliersEnabled } from '@/store/features/supplierSlice';
import { editInventory, selectInventorys } from '@/store/features/inventorySlice';
import { useAppDispatch } from '@/store/hooks';

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
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogText, setDialogText] = useState('');
  const router = useRouter();
  const categories = useSelector(selectCategoriesEnabled);
  const suppliers = useSelector(selectSuppliersEnabled);
  const inventorys = useSelector(selectInventorys);
  const oldInventory = inventorys.find(i => i.id === +id);
  const dispatch = useAppDispatch();

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
    defaultValues: oldInventory || {
          id: 0,
          title: "",
          stock_value: 0,
          price_per_unity: 0,
          qty_product: 0,
          enabled: true,
          description: "",
          category: null,
          supplier: null
    },
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
  }, [suppliers, reset, oldInventory]);

    useEffect(() => {
        if (!categories[0]) {
          dispatch(initCategories());
        }
  
        if (!suppliers[0]) {
          dispatch(initSuppliers());
        }
    }, [dispatch]);

  if (!oldInventory) {
    return (
      <View style={{ alignContent: 'center', alignItems: 'center' }}>
        <Text>Produto não encontrado</Text>
      </View>
    );
  }

  const disableOrEnable = async(data: InventoryInterface) => {
    try {
      data.enabled = !data.enabled;
      await dispatch(editInventory(data)).unwrap();
      router.back();
    } catch (error: any) {
      setDialogTitle('Erro');
      setDialogText(error?.message || 'Erro ao alterar inventório');
    }
    showDialog();
  }

  const updateInventory = async(data: InventoryInterface) => {
    try {
      await dispatch(editInventory(data)).unwrap();
      setDialogTitle('Sucesso');
      setDialogText('Inventório alterado com sucesso!');
    } catch (error: any) {
      setDialogTitle('Erro');
      setDialogText(error?.message || 'Erro ao alterar inventório');
    }
    showDialog();
  }

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.formModal}>
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
            onPress={handleSubmit(updateInventory)}
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
  excludeItemView:{ 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: 15 
  },
});