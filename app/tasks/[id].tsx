import { Text, View } from "@/components/Themed";
import { useTask } from "@/contexts/TaskContext";
import { useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, ImageSourcePropType } from "react-native";
import ModalDropdown from "@/components/ModalDropdown";
import { TextInput } from "react-native";
import { useState } from "react";
import { useTaskStatus } from "@/contexts/TaskStatusContext";
import { TaskStatusConst } from "@/constants/Status";
import TaskStatusInterface from "@/interfaces/TaskStatusInterface";



// Define task type
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
        <Text>Task not found</Text>
      </View>
    );
  }
  const [description,setDescription] = useState(task?.description)
  const [taskStatus,setTaskStatus] = useState<TaskStatusInterface>(task.status)
  const statusOptions: string[] = Object.values(TaskStatusConst);
  return (
    <View style={styles.container}>
      <View style={styles.titles}>
        <Text style={styles.title}>{task.title}</Text>
      </View>
      {task.image && <Image source={task.image} style={styles.image} />}
      <TextInput
        style={styles.description}
        multiline={true}
        numberOfLines={4}
        onChangeText={setDescription}
        value={description}
        placeholder="Descreva a tarefa"
        textAlignVertical="top"
        maxLength={255}
      />
      <ModalDropdown
        data={statusOptions}
        onSelect={(description)=>setTaskStatus(taskStatusContext.getStatusByDescription(description) || taskStatus)}
        initialValue={task.status.description}
      />
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
  description: {
    textAlign: "left",
    marginBottom: 20,
    width:'100%',
    backgroundColor: "#f4f4f4",
    borderRadius: 5,
    borderColor:'#AAAAAA',
    borderWidth:1,
    padding:5
  },
});