// pages/PageTarefasId.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useInventory } from '@/contexts/InventoryContext';
import useCategory from '@/contexts/CategoryContext';
import DefaultDialog from '@/components/DefaultDialog';
import InventoryInterface from '@/interfaces/InventoryInterface';
import { InventoryFormType } from '@/types/InventoryFormType';


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
    .min(0, 'Não pode ser negativo')
    .required('Valor unitário é obrigatório'),
    category: yup
    .object({
        id:yup.number().required(),
        description: yup.string().required(),
    })
    .required("selecione uma categoria")
    .nullable()
    // .typeError("Selecione uma categoria para o produto")
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
      category: null,
      description: '',
      price_per_unity: 0,
      qty_product: 0,
      title: '',
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: InventoryFormType) => {
    const response = inventoryContext.addInventory(data);
    if (response.success) {
      setDialogTitle('Sucesso');
      setDialogText('Produto criado com sucesso!');
      reset(); // limpa o formulário
    } else {
      setDialogTitle('Erro');
      setDialogText(response.message);
    }
    setDialogVisible(true);
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
            <>
            {errors.title && (
              <HelperText type="error">{errors.title.message}</HelperText>
            )}
            <TextInput
              label="Título"
              mode="outlined"
              style={styles.fullWidth}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!errors.title}
            />
          </>
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
              {errors.description && (
                <HelperText type="error">{errors.description.message}</HelperText>
              )}
            <TextInput
              label="Descrição"
              mode="outlined"
              multiline
              numberOfLines={5}
              style={styles.fullWidth}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!errors.description}
            />
          </>
        )}
      />

      <Controller
        control={control}
        name="qty_product"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              label="Quantidade em estoque"
              mode="outlined"
              keyboardType="numeric"
              style={styles.fullWidth}
              value={value.toString()}
              onChangeText={(text) => onChange(parseFloat(text) || 0)}
              error={!!errors.qty_product}
            />
            {errors.qty_product && (
              <HelperText type="error">{errors.qty_product.message}</HelperText>
            )}
          </>
        )}
      />

      <Controller
        control={control}
        name="price_per_unity"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              label="Valor unitário"
              mode="outlined"
              keyboardType="numeric"
              style={styles.fullWidth}
              value={value.toString()}
              onChangeText={(text) => onChange(parseFloat(text) || 0)}
              error={!!errors.price_per_unity}
            />
            {errors.price_per_unity && (
              <HelperText type="error">{errors.price_per_unity.message}</HelperText>
            )}
          </>
        )}
      />

      <Button mode="contained" onPress={handleSubmit(onSubmit)}>
        Criar produto
      </Button>

      <DefaultDialog
        visible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        title={dialogTitle}
        text={dialogText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  fullWidth: {
    width: '100%',
    marginBottom: 10,
  },
});

export default PageTarefasId;
