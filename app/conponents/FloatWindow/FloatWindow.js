import React, { Component } from 'react';
import { ToastAndroid, Text, View, Picker, TextInput, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Overlay, Icon } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import styles from './styles';
import { DatabaseConfig, TableBasicAccounting, BaseTableFieldTitle } from '../../config/DatabaseConfig';
import Sqlite from '../../lib/sqlite';
import { MyPicker } from "./Components";

// let db = new Sqlite(DatabaseConfig);
let db;
type Props={db:Sqlite};
class Floatwindow extends Component<Props>{
	constructor(props) {
		super(props);
		this.state = {
			isVisible: false,
			cyclely: false,
			Amount: '',
			Method: 0,
			Usage: 0,
			Note: '',
			cycle: null,
			cycleUnit: 0,
			date: (this.getDatestr(new Date())),
		};
		db=this.Props.db;
	}
	// async componentWillMount() {
	// 	await db.createTable(TableBasicAccounting);
	// }
	setModalVisible(visible, cyclely) {
		this.setState({ isVisible: visible, cyclely: cyclely });
	}
	inputPart() {
		return (
			<View>
				<View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
					<Text style={styles.text}>Amount:</Text>
					<Text style={styles.money}>￥</Text>
					{this.myTextInput('Amount', 'numeric')}
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center', }}>
					<Text style={styles.text}>Method:</Text>
					{this.myPicker('Method', BaseTableFieldTitle.method)}
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center', }}>
					<Text style={styles.text}>Usage:</Text>
					{this.myPicker('Usage', BaseTableFieldTitle.usage)}
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
					<Text style={styles.text}>Note:</Text>
					{this.myTextInput('Note', 'default')}
				</View>
				<View style={{ flexDirection: 'row' }}>
					<Text style={styles.text}>date:</Text>
					<DatePicker
						style={{ width: 200, marginTop: 15 }}
						date={this.state.date}
						mode="date"
						placeholder={this.state.date}
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
						onDateChange={(date) => { this.setState({ date: date }); }}
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
				<View style={{ flexDirection: 'row', alignItems: 'center', }}>
					<Text style={styles.text}>cycle:</Text>
					{this.myTextInput('cycle', 'numeric')}
					{this.myPicker('cycleUnit', BaseTableFieldTitle.cycleUnit)}
				</View>
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
				<Icon
					name='edit'
					type='font-awesome'
					color='#517fa4'
					reverse
					onPress={() => { this.setModalVisible(true, true); }}
				/>
				<Icon
					name='edit'
					type='font-awesome'
					color='#517fa4'
					reverse
					onPress={() => { this.setModalVisible(true, false); }}
				/>
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
	myTextInput = (item,boardType) => {
		return (
			<TextInput
				style={[styles.input,styles['input'+item]]}
				onChangeText={(value) => this.setState({[item]: value })}
				keyboardType={boardType}
			>{this.state[item]}</TextInput>
		);
	}
	myButtonModal = (text, func) => {
		return (
			<View style={styles.viewModal}>
				<TouchableOpacity
					style={[styles.myButtonModal, styles['button' + text]]}
					onPress={func}
				>
					<Text style={[styles.textModal, styles['text' + text]]}>{text}</Text>
				</TouchableOpacity>
			</View>
		)
	}
	myPicker = (item, data) => {//To creat a picker,item is a state, data is a array
		let pickerItem = data.map((label, index) => {
			return (<Picker.Item label={label} value={index} key={toString(index)} />)
		});
		return (
			<Picker
				style={[styles.picker, styles[item + 'Picker']]}
				selectedValue={this.state[item]}
				onValueChange={(value) => this.setState({ [item]: value })}>
				{pickerItem}
			</Picker>
		)
	}
	clearData() {
		this.setState({
			Amount: '',
			method: 0,
			usage: 0,
			note: '',
			cycle: null,
			cycleUnit: 0,
			date: (this.getDatestr(new Date())),
		});
	}
	async submitData(next) {
		let str = '';
		if (this.state.Amount == '')
			str = 'Please enter Amount';
		else if (this.state.Amount == '0')
			str = 'Amount can\'t be zero';
		else if ((this.state.cycle == '' || this.state.cycle == null) && this.state.cyclely == true)
			str = 'Please enter cycle';
		else if (this.state.cycle == '0' && this.state.cyclely == true)
			str = 'Cycle can\'t be zero';
		if (str != '') {
			ToastAndroid.showWithGravity(str, ToastAndroid.LONG, ToastAndroid.CENTER);
			return;
		}
		await db.in(TableBasicAccounting.name).insert({
			Amount: this.state.Amount,
			method: this.state.Method,
			note: this.state.Note,
			usage: this.state.Usage,
			cycleCount: this.state.cycle,
			cycleUnit: this.state.cycleUnit,
			firstTime: this.state.date,
			nextTriggerTime: this.state.date,
		});
		this.clearData();
		ToastAndroid.showWithGravity('Submit success!', ToastAndroid.SHORT, ToastAndroid.CENTER);
		if (!next) this.setModalVisible(false, false);
	}
	getDatestr = (date) => {
		return (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
	}
}
export default Floatwindow;