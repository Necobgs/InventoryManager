import { Text, View } from "@/components/Themed";
import { useTask } from "@/contexts/TaskContext";
import { useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, ImageSourcePropType } from "react-native";
import ModalDropdown from "@/components/ModalDropdown";

// Define task type
interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  image?: ImageSourcePropType;
}

// Define TaskContext type
interface TaskContextType {
  getTaskById: (id: number) => Task | undefined;
  updateTaskStatus: (id: number, status: string) => void;
}

export default function PageTarefasId() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const taskContext = useTask();
  const task = taskContext.getTaskById(Number(id));

  const statusOptions: string[] = ["To Do", "In Progress", "Done"];

  if (!task) {
    return (
      <View style={styles.container}>
        <Text>Task not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titles}>
        <Text style={styles.title}>{task.title}</Text>
      </View>
      {task.image && <Image source={task.image} style={styles.image} />}
      <Text style={styles.description}>{task.description}</Text>
      <ModalDropdown
        data={statusOptions}
        onSelect={()=>console.log('deu certo')}
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
  },
});