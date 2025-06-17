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
import CategoryInterface from "@/interfaces/CategoryInterface";

// Define props type
interface ModalDropdownProps {
  data: CategoryInterface[];
  onSelect: (item: CategoryInterface) => void;
  initialValue?: CategoryInterface | null;
}

const ModalDropdown: React.FC<ModalDropdownProps> = ({ data, onSelect, initialValue }) => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<CategoryInterface | null>(initialValue || null);

  const toggleModal = () => setModalVisible(!isModalVisible);

  const handleSelect = (item: CategoryInterface) => {
    setSelectedValue(item);
    onSelect(item);
    toggleModal();
  };

  return (
    <View>
      
      <Button
      onPress={toggleModal}
      style={{borderRadius:5,minWidth:150,}}
      labelStyle={{textAlign:'left',margin:10}}
      mode="outlined"
      accessibilityRole="button"
      >
        {selectedValue?.description || "Categoria"}
         <FontAwesome style={{marginLeft:10}} name={'angle-down'} size={20}/>
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
                  <Text style={styles.optionText}>{item.description}</Text>
                </TouchableOpacity>
              )}
            />
          :
          <Text>Nenhum item disponível para selecionar</Text>
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
});

export default ModalDropdown;