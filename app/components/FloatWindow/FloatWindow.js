import React, { Component } from 'react';
import { ToastAndroid, Text, View, Picker, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import { Overlay, Icon } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import styles from './styles';
import { UsageExpenseFor, UsageIncomeFor, TableBasicAccounting, BaseTableFieldTitle } from '../../config/DatabaseConfig';
import Sqlite from '../../lib/sqlite';
import moment from 'moment';
import ThemeConfig from '../../config/ThemeConfig'

// let db = new Sqlite(DatabaseConfig);
type Props = {
	db: Sqlite,
	refresh: () => {},
};
let db;
class Floatwindow extends Component<Props>{
	constructor(props) {
		super(props);
		this.state = {
			isVisible: false,
			cyclely: false,
			Budget: 0,
			Amount: '',
			Method: 0,
			Usage: 0,
			Note: '',
			cycle: null,
			cycleUnit: 0,
			date: (moment().format("YYYY-MM-DD")),
		};
		db = this.props.db;
	}
	async componentWillMount() {
		await db.createTable(TableBasicAccounting);
	}
	setModalVisible(visible, cyclely) {
		this.setState({ isVisible: visible, cyclely: cyclely });
	}
	inputPart() {
		return (
			<View>
				<View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
					<Text style={styles.text}>Budget:</Text>
					{this.myPicker('Budget', ['Expense', 'Income'])}
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
					<Text style={styles.text}>Amount:</Text>
					<Text style={styles.money}>￥</Text>
					{this.myTextInput('Amount', 'numeric')}
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text style={styles.text}>Method:</Text>
					{this.myPicker('Method', BaseTableFieldTitle.method)}
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text style={styles.text}>Usage:</Text>
					{this.myPicker('Usage', this.state.Budget == 0 ? UsageExpenseFor : UsageIncomeFor)}
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text style={styles.text}>date:</Text>
					<DatePicker
						style={{ width: 200, marginTop: 15 }}
						date={this.state.date}
						mode="date"
						placeholder={this.state.date}
						format="YYYY-MM-DD"
						minDate={(moment().add(-2, 'Years').format("YYYY")) + "-01-01"}
						maxDate={(moment().add(2, 'Years').format("YYYY")) + "-12-31"}
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
				{this.state.cyclely && this.cyclelyPart()}
				<View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
					<Text style={styles.text}>Note:</Text>
					{this.myTextInput('Note', 'default')}
				</View>
				<View style={{ flex: 0, flexDirection: 'row', height: 50, }}>
					{this.myButtonModal('Clear', () => this.clearData())}
					{this.myButtonModal('Submit', () => this.submitData(false))}
					{this.myButtonModal('Next', () => this.submitData(true))}
				</View>
			</View>
		);
	}
	cyclelyPart() {
		return (
			<View style={{ flexDirection: 'row', alignItems: 'center', }}>
				<Text style={styles.text}>cycle:</Text>
				{this.myTextInput('cycle', 'numeric')}
				{this.myPicker('cycleUnit', BaseTableFieldTitle.cycleUnit)}
			</View>
		);
	}
	render() {
		return (
			<View style={styles.container}>
				<Icon
					name='edit'
					type='font-awesome'
					color={ThemeConfig.themeMainColor}
					reverse
					onPress={() => { this.setModalVisible(true, false); }}
				/>
				<Icon
					name='plus-circle'
					type='font-awesome'
					color={ThemeConfig.themeMainColor}
					reverse
					onPress={() => { this.setModalVisible(true, true); }}
				/>
				<Overlay
					isVisible={this.state.isVisible}
					windowBackgroundColor='rgba(0, 0, 0, .5)'
					overlayBackgroundColor='white'
					width='auto'
					height='auto'
					onBackdropPress={() => this.setModalVisible(false, false)}
				>
					{this.inputPart()}
				</Overlay>
			</View>
		);
	}
	myTextInput = (item, boardType) => {
		return (
			<TextInput
				style={[styles.input, styles['input' + item]]}
				onChangeText={(value) => this.setState({ [item]: value })}
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
			Budget: 0,
			Amount: '',
			Method: 0,
			Usage: 0,
			Note: '',
			cycle: null,
			cycleUnit: 0,
			date: (moment().format("YYYY-MM-DD")),
		});
	}
	async submitData(next) {
		let str = '';
		if (this.state.Amount == '')
			str = 'Please enter Amount';
		else if (this.state.Amount == '0')
			str = 'Amount can\'t be zero';
		else if (isNaN(this.state.Amount))
			str = 'Amount should be a number';
		else if (this.state.cyclely == true) {
			if (this.state.cycle == '' || this.state.cycle == null)
				str = 'Please enter cycle';
			else if (this.state.cycle == '0')
				str = 'Cycle can\'t be zero';
			else if (isNaN(this.state.cycle))
				str = 'cycle should be a number';
		}
		if (str != '') {
			ToastAndroid.showWithGravity(str, ToastAndroid.LONG, ToastAndroid.CENTER);
			return;
		}
		await db.in(TableBasicAccounting.name).insert({
			'amount': (this.state.Budget == 0 ? (-this.state.Amount) : this.state.Amount),
			'method': this.state.Method,
			'note': this.state.Note,
			'usage': (this.state.Budget == 0 ?this.state.Usage: this.state.Usage + UsageExpenseFor.length),
			'cycleCount': (this.state.cyclely ? this.state.cycle : null),
			'cycleUnit': this.state.cycleUnit,
			'firstTime': this.state.date,
			'nextTriggerTime': (this.state.cyclely ?
				moment(this.state.date).add(this.state.cycle, BaseTableFieldTitle.cycleUnit[this.state.cycleUnit]).format("YYYY-MM-DD")
				: this.state.date),
		});
		this.clearData();
		this.props.refresh();
		ToastAndroid.showWithGravity('Submit success!', ToastAndroid.SHORT, ToastAndroid.CENTER);
		if (!next) this.setModalVisible(false, false);
	}
}
export default Floatwindow;