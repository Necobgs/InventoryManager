import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    areaFilters: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: "transparent",
        padding: 15,
        boxSizing: 'border-box',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(103, 80, 164, 0.3)',
    },
    loadingList: {
        padding: 5,
        backgroundColor: "transparent",
    },
    button: {
        borderRadius: 10,
        width: '50%'
    },
    list_items:{
        padding:50,
        borderTopWidth:1,
        borderTopColor:'#C2C2C2',
    },
    msg_empty_list:{
        width:'100%',
        height:'100%',
        textAlign:'center',
        alignContent:'center',
        fontSize:20,
        color: "rgb(103, 80, 164)"
    },
    btn_add:{
        backgroundColor:'green',
        color:'white',
        paddingVertical:15,
        borderRadius:5
    },
    fabStyle: {
        bottom: 16,
        right: 16,
        position: 'absolute',
    },
    container: {
        padding: 20,
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        minHeight:'100%',
        backgroundColor:'transparent',

    },
    fullWidth: {
        width: '100%',
        marginBottom: 10,
    },
    areaButtons:{ 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        marginTop: 15,
        backgroundColor: "transparent"
    },
    formModal: {
        maxWidth:800,
        width:'98%',
        maxHeight:'100%',
        padding:25,
        borderRadius:10,
        gap:15,
        overflowY: 'auto',
    },
    areaColor: {
        height: 30,
        width: '100%',
        borderRadius: 10,
        borderColor: 'rgb(103, 80, 164)',
        borderWidth: 2,
        borderStyle: 'solid'
    },
    label: {
        position: "absolute", 
        top: -6, 
        left: 12, 
        fontSize: 12, 
        color: "rgb(50, 50, 50)", 
        zIndex: 2, 
        paddingRight: 5, 
        paddingLeft: 5, 
        borderRadius: 10,
    }
});