import { Text, View } from "@/components/Themed";
import { useTask } from "@/contexts/TaskContext";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Button, TextInput, Modal, TouchableOpacity } from "react-native";
import ModalDropdown from "@/components/ModalDropdown";
import { useEffect, useState } from "react";
import { useTaskStatus } from "@/contexts/TaskStatusContext";
import { TaskStatusConst } from "@/constants/Status";
import TaskStatusInterface from "@/interfaces/TaskStatusInterface";
import { Image } from "expo-image";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";

export default function PageTarefasId() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const taskStatusContext = useTaskStatus();
  const taskContext = useTask();
  const task = id ? taskContext.getTaskById(+id) : null;

  const initialTaskTitle = task?.title || "";
  const initialDescription = task?.description || "";
  const initialTaskStatus = task?.status || taskStatusContext.getStatusByDescription(TaskStatusConst.new_task)!;
  const initialImage = task?.image || null;

  const [description, setDescription] = useState<string>(initialDescription);
  const [taskStatus, setTaskStatus] = useState<TaskStatusInterface>(initialTaskStatus);
  const [taskTitle, setTaskTitle] = useState<string>(initialTaskTitle);
  const [image, setImage] = useState<string | null>(initialImage);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string>(image || "");

  const statusOptions: string[] = Object.values(TaskStatusConst);
  const [disabledSave, setDisabledSave] = useState(true);

  const isModified = () => {
    if (!id) return !!taskTitle.trim();
    return (
      taskTitle !== initialTaskTitle ||
      description !== initialDescription ||
      taskStatus !== initialTaskStatus ||
      image !== initialImage
    );
  };

  useEffect(() => {
    setDisabledSave(!isModified());
  }, [description, taskTitle, taskStatus, image]);

  function saveChanges() {
    if (disabledSave) {
      throw new Error("Nenhuma mudança realizada ou campos obrigatórios vazios");
    }

    if (id) {
      const updatedTask = {
        ...task!,
        title: taskTitle,
        description,
        status: taskStatus,
        image,
      };
      const response = taskContext.updateTask(updatedTask);
      console.log("Tarefa atualizada:", response);
    } else {
      const newTask = {
        id: Date.now(),
        title: taskTitle,
        description,
        status: taskStatus,
        image,
      };
      const response = taskContext.addTask(newTask);
      console.log("Tarefa criada:", response);
    }
    router.navigate("/tasks");
  }

  function removeTask() {
    if (id && task) {
      taskContext.removeTask(task.id);
      router.navigate("/tasks");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <View style={styles.titles}>
        <TextInput
          style={styles.textinput}
          multiline={false}
          onChangeText={setTaskTitle}
          value={taskTitle}
          maxLength={255}
          placeholder="Título da tarefa"
          placeholderTextColor={'gray'}
        />
      </View>

      {image ? (
        <TouchableOpacity 
        style={{width:'100%',backgroundColor:'#F6F6F6',borderRadius:10}}
        onPress={() => {
          setTempImageUrl(image);
          setIsModalVisible(true);
        }}>
          <Image source={image} style={styles.image} contentFit="contain" />
        </TouchableOpacity>
      ) : (

        <TouchableOpacity
          style={styles.btn_add_image}
          onPress={() => {
            setTempImageUrl("");
            setIsModalVisible(true);
          }}
        >
          <Text style={styles.text_btn_add_image}>
            Adicionar imagem
          </Text>
        </TouchableOpacity>
      )}

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.textinput}
        multiline={true}
        numberOfLines={4}
        onChangeText={setDescription}
        value={description}
        placeholder="Descreva a tarefa"
        placeholderTextColor={'gray'}
        textAlignVertical="top"
        maxLength={255}
      />

      <Text style={styles.label}>Status</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
        <ModalDropdown
          data={statusOptions}
          onSelect={(description) =>
            setTaskStatus(taskStatusContext.getStatusByDescription(description) || taskStatus)
          }
          initialValue={taskStatus.description}
        />
        <View style={styles.buttons}>
          <Button title="Salvar" color="green" disabled={disabledSave} onPress={saveChanges} />
          {id && <Button title="Excluir" color="red" onPress={removeTask} />}
        </View>
      </View>

      {/* Modal para inserir ou editar imagem */}
      <Modal visible={isModalVisible} transparent={true} animationType="none" >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={{ marginBottom: 10, fontWeight: "bold" }}>Informe a URL da imagem</Text>
            <TextInput
              style={styles.textinput}
              value={tempImageUrl}
              onChangeText={setTempImageUrl}
              placeholder="https://exemplo.com/imagem.jpg"
              placeholderTextColor="gray"
            />
            <View style={styles.buttons}>
              <Button
                title="Cancelar"
                color="gray"
                onPress={() => setIsModalVisible(false)}
              />
              <Button
                title="Confirmar"
                color="green"
                onPress={() => {
                  setImage(tempImageUrl || null);
                  setIsModalVisible(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
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
