import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Picker, StatusBar, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Header } from 'react-native-elements';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import { TableBasicAccounting, BaseTableFieldTitle } from "../../config/DatabaseConfig";
import ThemeConfig from '../../config/ThemeConfig';
import moment from 'moment';
import Sqlite from '../../lib/sqlite';
import DatePicker from 'react-native-datepicker';

type Props = {
    db: Sqlite,
    openDrawerCB: () => {},
    style?: StyleSheet
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const chartConfig = {
    backgroundGradientFrom: '#d6e6de',
    backgroundGradientTo: '#bdcac3',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2 // optional, default 3
}

const colorbox = ['#66cc00', '#57c9f7', '#ffc114', '#29ddc0', '#b6e337',
    '#f774ab', '#fb745c', '#86ecef', '#9fb55a', '#52a599',
    '#d88ab1', '#add8e6', '#308cc5', '#ffb6c1', '#ffa500'];

const data = [
    { name: 'Seoul', population: 21500000, color: 'rgba(131, 167, 234, 1)', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Toronto', population: 2800000, color: '#F00', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Beijing', population: 527612, color: 'red', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'New York', population: 8538000, color: 'orange', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Moscow', population: 11920000, color: 'rgb(0, 0, 255)', legendFontColor: '#7F7F7F', legendFontSize: 15 }
]
let db: Sqlite;
export default class Statistics extends Component<Props>{
    constructor(props) {
        super(props);
        this.state = {
            displayForms: ['Usage', 'Date'],
            displaying: 'Usage',
            types: ['Expense', 'Income'],
            choosenType: 'Expense',
            timeFrom: moment().startOf('month').format('YYYY-MM-DD'),
            timeTo: moment().format('YYYY-MM-DD'),
            // MethodData:[],
            // UsageData:[],
            displayedPieData: [],
            displayedLineData: {
                label: [],
                datasets: []
            },
            lineOK: false
        };
        db = this.props.db;
    }
    componentWillMount() {
        this.getPieData();
        // this.getLineData();
    }
    componentDidUpdate(prevProp, prevState) {
        if (this.state.displaying !== prevState.displaying || this.state.choosenType !== prevState.choosenType || this.state.timeFrom !== prevState.timeFrom || this.state.timeTo !== prevState.timeTo) {
            this.getPieData();
            // this.getLineData();
        }

        // this.setData();
    }
    async setData() {
        let ColorInd = 0;
        let datebase = await db.in(TableBasicAccounting.name)
            .where(`firstTime >= ${this.state.timeFrom} AND firstTime <= ${this.state.timeTo}`)
            .select();
        let cntMethod = [], cntUsage = [];
        for (let i = 0; i < BaseTableFieldTitle.method.length; i++) {
            cntMethod.push(0);
        }
        for (let i = 0; i < BaseTableFieldTitle.usage[0].length + BaseTableFieldTitle.usage[1].length; i++) {
            cntUsage.push(0);
        }
        datebase.forEach(element => {
            cntMethod[element.method] += element.amount;
            cntUsage[element.usage] += element.amount;
        });
        let MethodData = [], UsageData = [];
        for (let i = 0; i < BaseTableFieldTitle.method.length; i++) {
            MethodData.push({
                way: BaseTableFieldTitle.method[i],
                amount: cntMethod[i],
                color: colorbox[ColorInd],
                fontColor: '#7F7F7F',
                fontSize: 15,
            });
            ColorInd = (ColorInd + 2) % 15;
        }
        for (let i = 0; i < BaseTableFieldTitle.usage[0].length + BaseTableFieldTitle.usage[1].length; i++) {
            UsageData.push({
                way: BaseTableFieldTitle.usage[i],
                amount: cntUsage[i],
                color: colorbox[ColorInd],
                fontColor: '#7F7F7F',
                fontSize: 15,
            });
            ColorInd = (ColorInd + 2) % 15;
        }
        this.setState({ MethodData: MethodData, UsageData: UsageData });
    }
    async getPieData() {
        let data = await db.in(TableBasicAccounting.name)
            .field('sum(amount) as Tamount,usage,firstTime,amount')
            .groupBy('usage')
            .where(`firstTime>='${this.state.timeFrom}' AND firstTime<='${this.state.timeTo}' AND amount ${this.state.choosenType === 'Expense' ? '<' : '>'} 0`)
            .select();

        data = data.map((v, i) => { return { name: BaseTableFieldTitle.usage[v.usage > 99 ? 1 : 0][v.usage > 99 ? v.usage - 100 : v.usage], Amount: Math.abs(v['Tamount']), color: colorbox[i], legendFontColor: '#7f7f7f', legendFontSize: 15 } });

        this.setState({ displayedPieData: data });
    }
    async getLineData() {
        let collection = {
            label: [],
            datasets: []
        }
        let q = await db.in(TableBasicAccounting.name)
            .field('sum(amount) as Tamount,firstTime')
            .groupBy('firstTime')
            .where(`firstTime>='${this.state.timeFrom}' AND firstTime<='${this.state.timeTo}' AND amount ${this.state.choosenType === 'Expense' ? '<' : '>'} 0`)
            .select();
        collection.label = q.map(v => v['firstTime']);

        for (let i = 0; i < BaseTableFieldTitle.usage[this.state.types.indexOf(this.state.choosenType)].length; i++) {
            let data = await db.in(TableBasicAccounting.name)
                .field('sum(amount) as Tamount,usage,firstTime,amount')
                .groupBy('firstTime')
                .where(`usage=='${i + (this.state.choosenType === 'Expense' ? 0 : 100)}' AND firstTime>='${this.state.timeFrom}' AND firstTime<='${this.state.timeTo}' AND amount ${this.state.choosenType === 'Expense' ? '<' : '>'} 0`)
                .select();
            console.log('???', i, data);

            let count = 0;
            if (!data) continue;
            collection.datasets.push({ color: () => colorbox[i], data: collection.label.map((va, index, arr) => va === data[index - count].firstTime ? Math.abs(data[index - count].Tamount) : (count++ , 0)) });
        }
        console.log(collection);

        this.setState({ displayedLineData: collection, lineOK: true });
    }
    render() {
        return (
            <ScrollView style={[{ height: windowHeight }, this.props.style ? this.props.style : {}]}>
                {/* <StatusBar translucent barStyle={'light-content'} backgroundColor={'rgba(0, 0, 0, 0.3)'} /> */}
                <Header
                    backgroundColor={ThemeConfig.themeMainColor}
                    placement="left"
                    leftComponent={{ icon: "menu", color: "#fff", onPress: () => { this.props.openDrawerCB() } }}
                    centerComponent={{ text: "Statistics", style: { color: "#fff" } }}
                />
                <View style={{ paddingTop: 70 }}>
                    <PieChart
                        data={this.state.displayedPieData}
                        width={windowWidth}
                        height={250}
                        chartConfig={chartConfig}
                        accessor="Amount"
                        backgroundColor="transparent"
                        paddingLeft="8"
                        absolute
                    />
                    {/* {this.state.lineOK&&<BarChart
                        data={this.state.displayedLineData}
                        width={windowWidth}
                        height={250}
                        chartConfig={chartConfig}
                    />} */}
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: 270 }}>
                        <Text style={styles.text}>Type:</Text>
                        <Picker style={{ height: 40, width: 210, }} selectedValue={this.state.choosenType} onValueChange={(v) => { this.setState({ choosenType: v }) }} >
                            {this.state.types.map(v => (
                                <Picker.Item key={v} label={v} value={v} />
                            ))}
                        </Picker>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: 270 }}>
                        <Text style={styles.text}>From:</Text>
                        <DatePicker
                            style={{ width: 200, marginTop: 15 }}
                            date={this.state.timeFrom}
                            mode="date"
                            placeholder={this.state.timeFrom}
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
                            onDateChange={(date) => { this.setState({ timeFrom: date }); }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: 270 }}>
                        <Text style={styles.text}>To:</Text>
                        <DatePicker
                            style={{ width: 200, marginTop: 15 }}
                            date={this.state.timeTo}
                            mode="date"
                            placeholder={this.state.timeTo}
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
                            onDateChange={(date) => { this.setState({ timeTo: date }); }}
                        />
                    </View>
                </View>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    text: {
        width: 60,
        fontSize: 20,
        color: 'black',
    },
});