// pages/PageTarefasId.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useInventory } from '@/contexts/InventoryContext';
import useCategory from '@/contexts/CategoryContext';
import DefaultDialog from '@/components/DefaultDialog';
import InventoryInterface from '@/interfaces/InventoryInterface';

const PageTarefasId: React.FC = () => {
  const inventoryContext = useInventory();
  const categoryContext = useCategory();

  const [newInventory, setNewInventory] = useState<InventoryInterface>({
    category: undefined,
    description: '',
    enabled: true,
    id: 0,
    price_per_unity: 0,
    qty_product: 0,
    stock_value: 0,
    title: '',
  });

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogText, setDialogText] = useState('');

  const handleSave = () => {
    const response = inventoryContext.addInventory(newInventory);
    if (response.success) {
      setDialogTitle('Sucesso');
      setDialogText('Produto criado com sucesso!');
    } else {
      setDialogTitle('Erro');
      setDialogText(response.message);
    }
    setDialogVisible(true);
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Título"
        mode="outlined"
        style={styles.fullWidth}
        value={newInventory.title}
        onChangeText={(text) => setNewInventory({ ...newInventory, title: text })}
      />
      <TextInput
        label="Descrição"
        mode="outlined"
        multiline
        numberOfLines={5}
        style={styles.fullWidth}
        value={newInventory.description}
        onChangeText={(text) => setNewInventory({ ...newInventory, description: text })}
      />
      <TextInput
        label="Quantidade em estoque"
        mode="outlined"
        keyboardType="numeric"
        style={styles.fullWidth}
        value={String(newInventory.qty_product)}
        onChangeText={(text) => setNewInventory({ ...newInventory, qty_product: parseFloat(text) || 0 })}
      />
      <TextInput
        label="Valor unitário"
        mode="outlined"
        keyboardType="numeric"
        style={styles.fullWidth}
        value={String(newInventory.price_per_unity)}
        onChangeText={(text) => setNewInventory({ ...newInventory, price_per_unity: parseFloat(text) || 0 })}
      />
      <Button mode="contained" onPress={handleSave}>
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
