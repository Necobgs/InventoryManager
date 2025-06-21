import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Button } from "react-native-paper";

// Interface base para garantir que o item tenha uma propriedade de exibição e uma chave única
interface DropdownItem {
  id: string | number; // Chave única
  [key: string]: any; // Permite outras propriedades
}

// Define props type com genérico
interface ModalDropdownProps<T extends DropdownItem> {
  data: T[]; // Lista de itens
  onSelect: (item: T) => void; // Callback para seleção
  initialValue?: T | null; // Valor inicial opcional
  displayKey: keyof T; // Propriedade usada para exibição
}

const ModalDropdown = <T extends DropdownItem>({
  data,
  onSelect,
  initialValue,
  displayKey,
}: ModalDropdownProps<T>) => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<T | null>(
    initialValue && displayKey in initialValue ? initialValue : null
  );

  const toggleModal = () => setModalVisible(!isModalVisible);

  const handleSelect = (item: T) => {
    setSelectedValue(item);
    onSelect(item);
    toggleModal();
  };

  return (
    <View>
      <Button
        onPress={toggleModal}
        style={{ borderRadius: 5, minWidth: 150 }}
        labelStyle={{ textAlign: "left", margin: 10 }}
        mode="outlined"
        accessibilityRole="button"
      >
        {selectedValue ? String(selectedValue[displayKey]) : "Selecionar"}
        <FontAwesome style={{ marginLeft: 10 }} name="angle-down" size={20} />
      </Button>

      <Modal visible={isModalVisible} transparent animationType="none">
        <TouchableOpacity style={styles.modalBackground} onPress={toggleModal}>
          <View style={styles.modalContent}>
            {data.length > 0 ? (
              <FlatList
                data={data}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={styles.optionText}>
                      {String(item[displayKey])}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text>Nenhum item disponível para selecionar</Text>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionText: {
    fontSize: 16,
  },
});

export default ModalDropdown;