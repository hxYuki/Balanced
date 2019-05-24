import React, { Component } from 'react';
import { StyleSheet, Text, View, Picker, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import { Overlay } from 'react-native-elements'
import DatePicker from 'react-native-datepicker'

windowHeight = Dimensions.get('window').height;
windowWidth = Dimensions.get('window').width;
class Floatwindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            cyclely: false,
            amount: '',
            method: 0,
            usage: 0,
            notes: '',
            date: new Date(),
        };
    }
    setModalVisible(visible, cycle) {
        this.setState({ isVisible: visible, cyclely: cycle });
    }
    inputPart() {
        return (
            <View>
                {this.myTextInput('amont', 'numeric')}
                {this.myPicker('method', ['Alipay', 'WeChat', 'Cash'])}
                {this.myPicker('usage', ['Entertainment', 'Catering', 'Education', 'Loan', 'Clothing', 'Daily', 'Expense'])}
                {this.myTextInput('notes', 'default')}
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.text}>date:</Text>
                    <DatePicker
                        style={{ width: 200,marginTop:15 }}
                        date={this.state.date}
                        mode="date"
                        placeholder={this.state.date.toString()}
                        format="YYYY-MM-DD"
                        minDate="2018-01-01"
                        maxDate="2020-01-01"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        androidMode="spinner"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                        }}
                        onDateChange={(date) => { this.setState({ date: date }) }}
                    />
                </View>
            </View>
        );
    }
    uncyclelyPart() {
        return (
            <View style={{ flex: 0, flexDirection: 'row', height: 50, }}>
                {this.myButtonModal('Back', () => this.setModalVisible(false, false))}
                {this.myButtonModal('Submit')}
                {this.myButtonModal('Next')}
            </View>
        );
    }
    cyclelyPart() {
        return (
            <View style={{ flex: 0, flexDirection: 'row', height: 50, }}>
                {this.myButtonModal('Back', () => this.setModalVisible(false, false))}
                {this.myButtonModal('Submit')}
                {this.myButtonModal('Next')}
            </View>
        );
    }
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => { this.setModalVisible(true, true); }}>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button2}
                    onPress={() => { this.setModalVisible(true, false); }}>
                </TouchableOpacity>
                <Overlay
                    isVisible={this.state.isVisible}
                    windowBackgroundColor='rgba(0, 0, 0, .5)'
                    overlayBackgroundColor='white'
                    width='auto'
                    height='auto'
                    onBackdropPress={() => this.setModalVisible(false, false)}
                >
                    <View>
                        {this.inputPart()}
                        {this.state.cyclely ? this.cyclelyPart() : this.uncyclelyPart()}
                    </View>
                </Overlay>
            </View>
        );
    }
    myButtonModal = (text, func) => {
        return (
            <View style={styles.viewModal}>
                <TouchableOpacity
                    style={styles.myButtonModal}
                    onPress={func}
                >
                    <Text style={styles.textModal}>{text}</Text>
                </TouchableOpacity>
            </View>
        )
    }
    myPicker = (item, data) => {
        let pickerItem = data.map((label, index) => {
            return (<Picker.Item label={label} value={index} key={toString(index)} />)
        });
        return (
            <View style={{ flexDirection: 'row' }}>
                <Text style={styles.text}>{item}:</Text>
                <Picker
                    style={styles.picker}
                    selectedValue={this.state[item]}
                    onValueChange={(value) => this.setState({ [item]: value })}>
                    {pickerItem}
                </Picker>
            </View>
        )
    }
    myTextInput = (item, boardType) => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <Text style={styles.text}>{item}:</Text>
                <TextInput
                    style={[styles.input, styles[item]]}
                    onChangeText={(value) => this.setState({ [item]: value })}
                    keyboardType={boardType}
                >{this.state[item]}</TextInput>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 20,
        top: windowHeight - 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        width: 50,
        height: 120,
    },
    button: {
        backgroundColor: 'black',
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 25,
        width: 50,
        height: 50,
    },
    button2: {
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
        width: 100,
        marginTop: 15,
        height: 40,
        fontSize: 25,
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
export default Floatwindow;