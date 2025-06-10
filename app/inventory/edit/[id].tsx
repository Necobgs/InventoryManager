import { Text, View } from "@/components/Themed";
import { useInventory } from "@/contexts/InventoryContext";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, TextInput } from "react-native";
import { useEffect, useState } from "react";
import compareObjects from "@/common/CompareObjects";



export default function PageTarefasId() {
  const { id }                                 = useLocalSearchParams<{ id: string }>();
  const inventoryContext                       = useInventory();
  const oldInventory                           = inventoryContext.getInventoryById(+id)!;
  const [updatedInventory,setUpdatedInventory] = useState(oldInventory)
  const [isModalVisible, setIsModalVisible]    = useState(false);
  const [disabledSave, setDisabledSave]        = useState(true);


  useEffect(() => {
    setDisabledSave(!compareObjects(oldInventory,updatedInventory));
  }, [setUpdatedInventory]);

  function saveChanges() {
    if (disabledSave) {
      throw new Error("Nenhuma mudança realizada para ser salva");
    }
    inventoryContext.updateInventory(updatedInventory)
    // router.navigate("/inventorys");
  }

  function removeInventory() {
    inventoryContext.removeInventoryById(+id);
    // router.navigate("/inventorys");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <View style={styles.titles}>
        <TextInput
          style={styles.textinput}
          multiline={false}
          // onChangeText={setInventoryTitle}
          value={updatedInventory.title}
          maxLength={255}
          placeholder="Título da tarefa"
          placeholderTextColor={'gray'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titles: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  container: {
    alignItems: "flex-start",
    minHeight: "100%",
    padding: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
  },
  image: {
    borderRadius: 5,
    width: "100%",
    height: 250,
    marginBottom: 25,
  },
  textinput: {
    textAlign: "left",
    marginBottom: 15,
    width: "100%",
    backgroundColor: "#f4f4f4",
    borderRadius: 5,
    borderColor: "#AAAAAA",
    borderWidth: 1,
    padding: 5,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  label: {
    marginBottom: 4,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  btn_add_image:{
    borderRadius:5,
    backgroundColor:'#588BAE',
    padding:10,
    marginVertical:10
  },
  text_btn_add_image:{
    width:'100%',
    color:'white'
  }
});
