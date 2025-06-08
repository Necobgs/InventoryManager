import { Text, View } from "@/components/Themed";
import { useTask } from "@/contexts/TaskContext";
import { useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, ImageSourcePropType, Button } from "react-native";
import ModalDropdown from "@/components/ModalDropdown";
import { TextInput } from "react-native";
import { useEffect, useState } from "react";
import { useTaskStatus } from "@/contexts/TaskStatusContext";
import { TaskStatusConst } from "@/constants/Status";
import TaskStatusInterface from "@/interfaces/TaskStatusInterface";

// Define task type interface
interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  image?: ImageSourcePropType;
}

export default function PageTarefasId() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const taskStatusContext = useTaskStatus();
  const taskContext = useTask();
  const task = taskContext.getTaskById(Number(id));

  if (!task) {
    return (
      <View style={styles.container}>
        <Text>Tarefa não encontrada</Text>
      </View>
    );
  }

  const [description, setDescription] = useState<string>(task?.description);
  const [taskStatus, setTaskStatus] = useState<TaskStatusInterface>(task.status);
  const [taskTitle, setTaskTitle] = useState<string>(task.title);
  
  // Track initial task values
  const initialDescription = task?.description;
  const initialTaskTitle = task?.title;
  const initialTaskStatus = task.status;

  const statusOptions: string[] = Object.values(TaskStatusConst);
  
  // State to control the Save button
  const [disabledSave, setDisabledSave] = useState(true);

  // Function to check if any field is modified
  const isModified = () => {
    return taskTitle !== initialTaskTitle || description !== initialDescription || taskStatus !== initialTaskStatus;
  };

  useEffect(() => {
    // Enable Save button if any field is modified
    setDisabledSave(!isModified());
  }, [description, taskTitle, taskStatus]); // Trigger effect on any of these fields' change

  function saveChanges(){
    if(disabledSave) throw new Error('Nenhuma mudança realizada')
    // taskContext.
  }

  return (
    <View style={styles.container}>
      <View style={styles.titles}>
        <TextInput
          style={styles.textinput}
          multiline={false}
          onChangeText={setTaskTitle}
          value={taskTitle}
          maxLength={255}
        />
      </View>
      <Image source={task.image} style={styles.image} />
      <TextInput
        style={styles.textinput}
        multiline={true}
        numberOfLines={4}
        onChangeText={setDescription}
        value={description}
        placeholder="Descreva a tarefa"
        textAlignVertical="top"
        maxLength={255}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
        <ModalDropdown
          data={statusOptions}
          onSelect={(description) => setTaskStatus(taskStatusContext.getStatusByDescription(description) || taskStatus)}
          initialValue={task.status.description}
        />
        <View style={styles.buttons}>
          <Button title="Salvar" color={'green'} disabled={disabledSave} />
          <Button title="Excluir" color={'red'} />
        </View>
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
    marginBottom: 25,
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
    marginBottom: 20,
    width: '100%',
    backgroundColor: "#f4f4f4",
    borderRadius: 5,
    borderColor: '#AAAAAA',
    borderWidth: 1,
    padding: 5,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
});
