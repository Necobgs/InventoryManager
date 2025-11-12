// pages/PageTarefasId.tsx
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DefaultDialog from '@/components/DefaultDialog';
import { InventoryFormType } from '@/types/InventoryFormType';
import { FormInput } from '@/components/FormInput';
import ComboBoxForm from '@/components/ComboBoxForm';
import { globalStyles } from '@/styles/globalStyles';
import { useAppDispatch } from '@/store/hooks';
import { initCategoriesComboBox, selectCategoriesComboBox } from '@/store/features/categorySlice';
import { useSelector } from 'react-redux';
import { initSuppliersComboBox, selectSuppliersComboBox } from '@/store/features/supplierSlice';
import { addInventory, selectInventoryError } from '@/store/features/inventorySlice';
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
        id:yup.number().required(),
        title: yup.string().required(),
        description: yup.string().required(),
        color: yup.string().required(),
        enabled:yup.boolean().required()
    })
    .required("selecione uma categoria")
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
});

const PageTarefasId: React.FC = () => {
  const categories = useSelector(selectCategoriesComboBox);
  const suppliers = useSelector(selectSuppliersComboBox);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogText, setDialogText] = useState('');
  const [isError, setIsError] = useState(false);
  const error = useSelector(selectInventoryError);
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
    formState: { errors },
  } = useForm<InventoryFormType>({
    defaultValues: {
      title: '',
      description: '',
      qty_product: 0,
      price_per_unity: 0,
      category: null,
      supplier: null,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: InventoryFormType) => {
    try {
      await dispatch(addInventory(data)).unwrap();
      setDialogTitle('Sucesso');
      setDialogText('Item cadastrado com sucesso!');
      reset();
    } catch (error: any) {
      setIsError(true);
    }
    showDialog();
  };

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

      <ComboBoxForm
        data={categories}
        control={control}
        name="category"
        label="Categoria"
        errors={errors}
        displayKey={'description'}
      />

      <ComboBoxForm
        data={suppliers}
        control={control}
        name="supplier"
        label="Fornecedor"
        errors={errors}
        displayKey={'name'}
      />
      
      <Button mode="contained" onPress={handleSubmit(onSubmit)} style={{height:40}}>
        Criar produto
      </Button>

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

export default PageTarefasId;
