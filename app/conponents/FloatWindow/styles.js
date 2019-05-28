import { Dimensions, StyleSheet } from 'react-native';

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
    buttonCycle: {
        backgroundColor: 'black',
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 25,
        width: 50,
        height: 50,
    },
    buttonUncycle: {
        backgroundColor: 'black',
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 25,
        marginTop: 20,
        width: 50,
        height: 50,
    },
    picker: {
        width: 200,
        marginTop: 10,
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
        width: 200,
    },
    amount: {
        color: 'black',
    },
    method: {
        color: 'black',
    },
    usage: {
        color: 'black',
    },
    notes: {
        color: 'black',
    },
    viewModal: {
        flex: 1,
    },
    myButtonModal: {
        marginTop: 15,
        backgroundColor: 'skyblue',
        width: "85%",
    },
    textModal: {
        color: 'black',
        fontSize: 25,
        textAlign: 'center',
    },
});

export default styles;