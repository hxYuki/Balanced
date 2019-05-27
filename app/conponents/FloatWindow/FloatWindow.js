import React, { Component } from 'react';
import { StyleSheet, Text, View, Picker, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import { Overlay } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import styles from './styles';

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
            cycle: 0,
            date: new Date(),
        };
    }
    setModalVisible(visible, cycle) {
        this.setState({ isVisible: visible, cyclely: cycle });
    }
    inputPart() {
        return (
            <View>
                {this.myTextInput('amount', 'numeric')}
                {this.myPicker('method', ['Alipay', 'WeChat', 'Cash'])}
                {this.myPicker('usage', ['Entertainment', 'Catering', 'Education', 'Loan', 'Clothing', 'Daily', 'Expense'])}
                {this.myTextInput('notes', 'default')}
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.text}>date:</Text>
                    <DatePicker
                        style={{ width: 200, marginTop: 15 }}
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
                {this.myButtonModal('Clear', () => this.clearState())}
                {this.myButtonModal('Submit')}
                {this.myButtonModal('Next')}
            </View>
        );
    }
    cyclelyPart() {
        return (
            <View>
                {this.myPicker('cycle', ['Month', 'Week', 'Day'])}
                <View style={{ flex: 0, flexDirection: 'row', height: 50, }}>
                    {this.myButtonModal('Clear', () => this.clearState())}
                    {this.myButtonModal('Submit')}
                    {this.myButtonModal('Next')}
                </View>
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
    myPicker = (item, data) => {//To creat a picker,item is a state, data is a array
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
    myTextInput = (item, boardType) => {//
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
    clearState = () => {
        this.setState({
            amount: '',
            method: 0,
            usage: 0,
            notes: '',
            cycle: 0,
            date: new Date(),
        });
    }
}
export default Floatwindow;