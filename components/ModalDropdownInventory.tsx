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
import InventoryInterface from "@/interfaces/InventoryInterface";

// Define props type
interface ModalDropdownProps {
  data: InventoryInterface[];
  onSelect: (item: InventoryInterface) => void;
  initialValue?: {id: number, title: string} | null;
}

const ModalDropdownInventory: React.FC<ModalDropdownProps> = ({ data, onSelect, initialValue }) => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<{id: number, title: string} | null>(initialValue || null);

  const toggleModal = () => setModalVisible(!isModalVisible);

  const handleSelect = (item: InventoryInterface) => {
    setSelectedValue(item);
    onSelect(item);
    toggleModal();
  };

  return (
    <View>
      <Button
      onPress={toggleModal}
      style={styles.buttonSel}
      labelStyle={{textAlign:'left',margin:10}}
      mode="outlined"
      accessibilityRole="button"
      >
        <Text numberOfLines={2}>
          {selectedValue?.title || "Produto"}
          <FontAwesome style={{marginLeft:10}} name={'angle-down'} size={20}/>
        </Text>
      </Button>
      
      <Modal visible={isModalVisible} transparent animationType="none">
        <TouchableOpacity style={styles.modalBackground} onPress={toggleModal}>
          <View style={styles.modalContent}>
            {data[0] ?
              <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text numberOfLines={4} style={styles.optionText}>
                    <Text style={styles.bold}>Produto: </Text>
                    {item.title}
                    <Text style={styles.bold}>  |  Quantidade: </Text>
                    {item.qty_product}
                    <Text style={styles.bold}>  |  Preço: </Text>
                    {new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(item.price_per_unity)}
                  </Text>
                </TouchableOpacity>
              )}
            />
          :
          <Text>Nenhum produto disponível para selecionar</Text>
          }
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({

  contentButton:{
    justifyContent:'space-around',
    flexDirection:'row' ,
    alignItems:'center',
    width:'100%'
  },
  button: {
    padding: 10,
    backgroundColor: "#f4f4f4",
    borderRadius: 5,
    borderColor:'#AAAAAA',
    borderWidth:1,
    width:`100%`
  },
  buttonText: {
    color: "BLACK",
    textAlign: "center",
  },
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
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#e74c3c",
    borderRadius: 5,
  },
  closeText: {
    color: "white",
    textAlign: "center",
  },
  buttonSel: {
    borderRadius:5,
  },
  bold: {
    fontWeight: 'bold',
  }
});

export default ModalDropdownInventory;