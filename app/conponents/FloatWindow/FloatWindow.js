import React, { Component } from 'react';
import { StyleSheet, Text, View, Picker, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import { Overlay, Icon } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import styles from './styles';
import { DatabaseConfig, TableBasicAccounting } from '../../config/DatabaseConfig';
import Sqlite from '../../lib/sqlite';

let db = new Sqlite(DatabaseConfig);
class Floatwindow extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isVisible: false,
			cyclely: false,
			amount: '',
			method: 0,
			usage: 0,
			note: '',
			cycleCount: -1,
			cycleUnit: -1,
			date: new Date(),
		};
	}
	async componentWillMount(){
		await db.createTable(TableBasicAccounting);
	}
	setModalVisible(visible, cyclely) {
		this.setState({ isVisible: visible, cyclely: cyclely });
	}
	inputPart() {
		return (
			<View>
				{this.myTextInput('amount', 'numeric')}
				{this.myPicker('method', ['Alipay', 'WeChat', 'Cash'])}
				{this.myPicker('usage', ['Entertainment', 'Catering', 'Education', 'Loan', 'Clothing', 'Daily', 'Expense'])}
				{this.myTextInput('note', 'default')}
				<View style={{ flexDirection: 'row' }}>
					<Text style={styles.text}>date:</Text>
					<DatePicker
						style={{ width: 200, marginTop: 15 }}
						date={this.state.date}
						mode="date"
						placeholder={this.state.date.toString()}
						format="YYYY-MM-DD"
						minDate={(new Date().getFullYear() - 2) + "-01-01"}
						maxDate={(new Date().getFullYear() + 2) + "-12-31"}
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
						onDateChange={(date) => { this.setState({ date: date });}}
					/>
				</View>
			</View>
		);
	}
	uncyclelyPart() {
		return (
			<View style={{ flex: 0, flexDirection: 'row', height: 50, }}>
				{this.myButtonModal('Clear', () => this.clearData())}
				{this.myButtonModal('Submit', () => this.submitData(false))}
				{this.myButtonModal('Next', () => this.submitData(true))}
			</View>
		);
	}
	cyclelyPart() {
		return (
			<View>
				{this.myPicker('cycle', ['Month', 'Week', 'Day'])}
				<View style={{ flex: 0, flexDirection: 'row', height: 50, }}>
					{this.myButtonModal('Clear', () => this.clearData())}
					{this.myButtonModal('Submit', () => this.submitData(false))}
					{this.myButtonModal('Next', () => this.submitData(true))}
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
	clearData() {
		this.setState({
			amount: '',
			method: 0,
			usage: 0,
			note: '',
			cycleCount: null,
			cycleUnit: 0,
			date: new Date(),
		});
	}
	submitData(next) {
		db.in(TableBasicAccounting.name).insert({
			amount: this.state.amount,
			method: this.state.method,
			note: this.state.note,
			usage: this.state.usage,
			cycleCount: this.state.cycleCount,
			cycleUnit: this.state.cycleUnit,
			firstTime: this.state.date.toString(),
			nextTriggerTime: this.state.date.toString(),
		});
		this.clearData();
		if (!next) this.setModalVisible(false, false);
	}
}
export default Floatwindow;