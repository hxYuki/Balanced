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
    header: {
        flexDirection: 'row',
        flex:0,
        alignItems: 'center',
        backgroundColor: ThemeConfig.themeMainColor,
    },
    picker: {
        width: 200,
    },
    cycleUnitPicker: {
        width: 120,
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
        flex: 1,
        color: 'black',
    },
    inputcycle: {
        borderBottomWidth: 1,
        borderColor: 'black',
        textAlign: 'right',
    },
    viewModal: {
        width: "65%",
    },
    myButtonModal: {
        marginTop: 15,
        width: "100%",
    },
    buttonConfirm: {
        backgroundColor: ThemeConfig.themeMainColor,
    },
    textModal: {
        color: 'white',
        fontSize: 20,
        height: 30,
        textAlign: 'center',
    },
    money: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        fontSize: 25,
        marginTop: 10,
        color: 'black',
    }
});

export default styles;