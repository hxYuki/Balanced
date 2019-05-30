import { Dimensions, StyleSheet } from 'react-native';
import ThemeConfig from '../../config/ThemeConfig'

windowHeight = Dimensions.get('window').height;
windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 20,
        top: windowHeight - 200,
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 120,
    },
    picker: {
        width: 200,
    },
    cycleUnitPicker: {
        width: 100,
        borderWidth: 1,
        borderColor: 'black',
    },
    text: {
        color: 'black',
        width: 80,
        marginTop: 15,
        height: 40,
        fontSize: 20,
    },
    input: {
        fontSize: 25,
        borderBottomWidth: 1,
        borderColor: 'black',
        flex:1,
        color: 'black',
    },
    inputcycle:{
        borderBottomWidth: 1,
        borderColor: 'black',
        textAlign: 'right',
    },
    viewModal: {
        flex: 1,
    },
    myButtonModal: {
        marginTop: 15,
        width: "85%",
    },
    buttonClear:{
        backgroundColor:ThemeConfig.themeWeakColor,
    },
    buttonSubmit:{
        backgroundColor: ThemeConfig.themeMainColor,
    },
    buttonNext:{
        backgroundColor: ThemeConfig.themeMainColor,
    },
    textModal: {
        color: 'white',
        fontSize: 25,
        textAlign: 'center',
    },
    textClear: {
        color: ThemeConfig.themeMainColor,
    },
    textSubmit: {
        color: 'white',
    },
    textNext: {
        color: 'white',
    },
    money: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        fontSize: 25,
        marginTop: 10,
        color:'black',
    }
});

export default styles;