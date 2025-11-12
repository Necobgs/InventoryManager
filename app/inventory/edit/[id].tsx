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
import { initCategoriesComboBox, selectCategoriesComboBox } from '@/store/features/categorySlice';
import { initSuppliersComboBox, selectSuppliersComboBox } from '@/store/features/supplierSlice';
import { editInventory, selectInventoryError, selectInventorys } from '@/store/features/inventorySlice';
import { useAppDispatch } from '@/store/hooks';
import useTheme from '@/contexts/ThemeContext';

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
      title: yup.string().required(),
      description: yup.string().required(),
      color: yup.string().required(),
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
          cep:yup.string().required(),
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
  const categories = useSelector(selectCategoriesComboBox);
  const suppliers = useSelector(selectSuppliersComboBox);
  const inventorys = useSelector(selectInventorys);
  const oldInventory = inventorys.find(i => i.id === +id);
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const error = useSelector(selectInventoryError);
  const [isError, setIsError] = useState(false);

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
    defaultValues: oldInventory 
    ? {...oldInventory, 
      category: categories.find(c => c.id === oldInventory.category?.id) || oldInventory.category, 
      supplier: suppliers.find(s => s.id === oldInventory.supplier?.id) || oldInventory?.supplier} : {
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

  const pricePerUnity = watch('price_per_unity');
  const qtyProduct = watch('qty_product');

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
      setIsError(true);
    }
  }

  const updateInventory = async(data: InventoryInterface) => {
    try {
      await dispatch(editInventory(data)).unwrap();
      setDialogTitle('Sucesso');
      setDialogText('Item alterado com sucesso!');
      showDialog();
    } catch (error: any) {
      setIsError(true);
    }
  }

  useEffect(() => {
    setValue('stock_value', pricePerUnity * qtyProduct);
  }, [pricePerUnity, qtyProduct, setValue]);

  useEffect(() => {
    if (oldInventory) {
      reset(oldInventory);
    }
  }, [suppliers, reset, oldInventory]);

  useEffect(() => {
      dispatch(initCategoriesComboBox({title: "", description: "", enabled: true}));
      dispatch(initSuppliersComboBox({name: "", cnpj: "", enabled: true}));
  }, [dispatch]);

  useEffect(() => {

    if (isError) {
      setDialogTitle('Erro');
      setDialogText(error  || 'Erro ao cadastrar item');
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