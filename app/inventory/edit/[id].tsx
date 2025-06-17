import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, HelperText, Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useInventory } from '@/contexts/InventoryContext';
import useCategory from '@/contexts/CategoryContext';
import DefaultDialog from '@/components/DefaultDialog';
import { useLocalSearchParams, useRouter } from 'expo-router';
import InventoryInterface from '@/interfaces/InventoryInterface';
import ModalDropdown from '@/components/ModalDropdownCategory';
import { formatCurrency } from '@/common/FormatCurrency';

// Função para formatar número como moeda BRL


// Função para converter string monetária para número
const parseCurrency = (value: string): number => {
  // Remove tudo que não é número ou vírgula
  const cleaned = value.replace(/[^0-9,]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};

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
      id: yup.number().required(),
      description: yup.string().required(),
    })
    .required('Selecione uma categoria')
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
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogText, setDialogText] = useState('');
  const router = useRouter();

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

  function removeInventory() {
    const response = inventoryContext.removeInventoryById(+id);
    setDialogTitle(response.success ? 'Sucesso' : 'Erro');
    setDialogText(response.message);
    setDialogVisible(true);
    if (response.success) {
      router.navigate('/(tabs)/inventory');
    }
  }

  function saveChanges(data: InventoryInterface) {
    const response = inventoryContext.updateInventory(data);
    setDialogTitle(response.success ? 'Sucesso' : 'Erro');
    setDialogText(response.message);
    setDialogVisible(true);
  }

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
              value={formatCurrency(value)}
              onChangeText={(text) => onChange(parseCurrency(text))}
              error={!!errors.price_per_unity}
            />
            {errors.price_per_unity && (
              <HelperText type="error">{errors.price_per_unity.message}</HelperText>
            )}
          </>
        )}
      />

      <Controller
        control={control}
        name="stock_value"
        render={({ field: { value } }) => (
          <>
            <TextInput
              label="Valor de estoque"
              mode="outlined"
              keyboardType="numeric"
              disabled={true}
              style={styles.fullWidth}
              value={formatCurrency(value)}
              editable={false}
            />
          </>
        )}
      />

      <Controller
        control={control}
        name="category"
        render={({ field: { onChange, value } }) => (
          <>
            <Text style={{ marginLeft: 5, marginBottom: 5 }}>Categoria</Text>
            <ModalDropdown
              data={categoryContext.categories}
              initialValue={value}
              onSelect={(categorySelected) => onChange(categorySelected)}
            />
            {errors.category && (
              <HelperText type="error">{errors.category.message}</HelperText>
            )}
          </>
        )}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 15 }}>
        <Button mode="outlined" style={{ width: '45%' }} onPress={handleSubmit(removeInventory)}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  fullWidth: {
    width: '100%',
    marginBottom: 10,
  },
});