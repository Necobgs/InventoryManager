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

// Define props type
interface ModalDropdownProps {
  data: string[];
  onSelect: (item: string) => void;
  initialValue?: string | null;
}

const ModalDropdown: React.FC<ModalDropdownProps> = ({ data, onSelect, initialValue }) => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(initialValue || null);

  const toggleModal = () => setModalVisible(!isModalVisible);

  const handleSelect = (item: string) => {
    setSelectedValue(item);
    onSelect(item);
    toggleModal();
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={toggleModal}
        accessibilityLabel="Select task status"
        accessibilityRole="button"
      >
        <View style={styles.contentButton}>
          <Text style={styles.buttonText}>
            {selectedValue || "Select an option"}
          </Text>
          <FontAwesome name={'angle-down'} size={20}/>
        </View>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent animationType="none">
        <TouchableOpacity style={styles.modalBackground} onPress={toggleModal}>
          <View style={styles.modalContent}>
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
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
    alignItems:'center'
  },
  button: {
    padding: 10,
    backgroundColor: "#f4f4f4",
    borderRadius: 5,
    borderColor:'#AAAAAA',
    borderWidth:1,
    width:150
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