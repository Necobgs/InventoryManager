import { StyleSheet,Text } from "react-native";
import { RelativePathString, useRouter } from "expo-router";
import { Card, MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import GenericCardProps from "@/interfaces/GenericCardProps";
import useTheme from "@/contexts/ThemeContext";



export default function GenericCard(props:GenericCardProps){
    const router = useRouter();
    const { theme } = useTheme();
    
    return (
    <PaperProvider theme={theme === "dark" ? MD3DarkTheme : MD3LightTheme}>
        <Card mode={theme === "dark" ? "outlined" : "elevated"} style={styles.container} onPress={()=>router.navigate(props.navigateURL as RelativePathString) }>
            <Card.Title title={props.title}/>   
            <Card.Content>
                <Text numberOfLines={3} style={{color:theme==='dark'?'rgb(230, 225, 229)':'black'}}>
                    {props.description}
                </Text>    
            </Card.Content> 
        </Card>  
    </PaperProvider>
    )
}

const styles= StyleSheet.create({
    container:{
        height:125,
        width:'100%',
        backgroundColor: 'transparent'
    },
})