import { StyleSheet,Text } from "react-native";
import { RelativePathString, useRouter } from "expo-router";
import { Card, MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import GenericCardProps from "@/interfaces/GenericCardProps";
import useTheme from "@/contexts/ThemeContext";
import { View } from "./Themed";
import { globalStyles } from "@/styles/globalStyles";



export default function GenericCard(props:GenericCardProps){
    const router = useRouter();
    const { theme } = useTheme();
    
    return (
    <PaperProvider theme={theme === "dark" ? MD3DarkTheme : MD3LightTheme}>
        <Card mode={theme === "dark" ? "outlined" : "elevated"} style={{...styles.container, position: "relative" }} onPress={()=>router.navigate(props.navigateURL as RelativePathString) }>
            {props.colorField && <View style={{...globalStyles.areaColor, backgroundColor: props.colorField, position: "absolute", top: 5, right: 5, width: 30, height: 15, borderWidth: 1}}></View>}
            {props.title && <Card.Title title={props.title}/>}   
            {props.description
            && <Card.Content>
                {
                    props.description.map((desc, i) => 
                        <Text key={`text${i}`} numberOfLines={3} style={{color:theme==='dark'?'rgb(230, 225, 229)':'black'}}>
                            {desc}
                        </Text>
                    )
                } 
            </Card.Content>}
        </Card>  
    </PaperProvider>
    )
}

const styles= StyleSheet.create({
    container:{
        height: 'auto',
        minHeight:125,
        width:'100%',
        backgroundColor: 'transparent'
    },
})