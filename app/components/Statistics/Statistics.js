import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions} from 'react-native';
import {LineChart,PieChart} from 'react-native-chart-kit';
import {TableBasicAccounting,BaseTableFieldTitle} from "../../config/DatabaseConfig";
import moment from 'moment';

type Props = {
    db: Sqlite
}

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientTo: '#08130D',
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2 // optional, default 3
}

const colorbox = ['#00FFFF', '#00FF00', '#FF0000', '#C0C0C0', '#ffe4c4', 
                  '#8a2be2', '#6495ed', '#fff8dc', '#00bfff', '#ffd700',
                  '#f0e68c', '#add8e6', '#87cefa', '#ffb6c1', '#ffa500'];

const data = [
  { name: 'Seoul', population: 21500000, color: 'rgba(131, 167, 234, 1)', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  { name: 'Toronto', population: 2800000, color: '#F00', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  { name: 'Beijing', population: 527612, color: 'red', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  { name: 'New York', population: 8538000, color: 'orange', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  { name: 'Moscow', population: 11920000, color: 'rgb(0, 0, 255)', legendFontColor: '#7F7F7F', legendFontSize: 15 }
]
let db;
export default class Statistics extends Component<Props>{
    constructor(props){
        super(props);
        this.state={
            MethodData:[],
            UsageData:[],
        };
        db=this.props.db;
    }
    async componentWillMount(){
        let ColorInd=0;
        let first = moment().startOf('month').format('YYYY-MM-DD');
        let datebase = await db.in(TableBasicAccounting.name)
                                .where(`firstTime >= ${first}`)
                                .select();
        let cntMethod=[],cntUsage=[];
        for(let i=0;i<BaseTableFieldTitle.method.length;i++){
            cntMethod.push(0);
        }
        for (let i = 0; i < BaseTableFieldTitle.usage.length; i++) {
            cntUsage.push(0);
        }
        datebase.forEach(element => {
            cntMethod[element.method] += element.amount;
            cntUsage[element.usage] += element.amount;
        });
        let MethodData=[],UsageData=[];
        for (let i = 0; i < BaseTableFieldTitle.method.length; i++) {
            MethodData.push({
                way: BaseTableFieldTitle.method[i],
                amount: cntMethod[i],
                color: colorbox[ColorInd],
                fontColor: '#7F7F7F',
                fontSize: 15,
            });
            ColorInd=(ColorInd+2)%15;
        }
        for (let i = 0; i < BaseTableFieldTitle.usage.length; i++) {
            UsageData.push({
                way: BaseTableFieldTitle.usage[i],
                amount: cntUsage[i],
                color: colorbox[ColorInd],
                fontColor: '#7F7F7F',
                fontSize: 15,
            });
            ColorInd = (ColorInd + 2) % 15;
        }
        this.setState({MethodData:MethodData,UsageData:UsageData});
    }
    render(){
        return (
            <View>
                <View style={{alignItems:'center'}}><Text style={{fontSize:30}}>Method Table</Text></View>
                <PieChart
                data={this.state.MethodData}
                width={screenWidth}
                height={250}
                chartConfig={chartConfig}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="8"
                absolute
                />
                {/* <View><Text style={{alignContent:'center'}}>Usage Table</Text></View>
                <PieChart
                data={this.state.MethodData}
                width={screenWidth}
                height={250}
                chartConfig={chartConfig}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="8"
                absolute
                /> */}
            </View>
        );
    }
}