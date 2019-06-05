import React, { Component } from 'react';
import { View, StyleSheet, Picker, StatusBar, Text, TouchableOpacity, Dimensions} from 'react-native';
import {Header} from 'react-native-elements';
import {LineChart,PieChart} from 'react-native-chart-kit';
import {TableBasicAccounting,BaseTableFieldTitle} from "../../config/DatabaseConfig";
import ThemeConfig from '../../config/ThemeConfig';
import moment from 'moment';
import Sqlite from '../../lib/sqlite';

type Props = {
    db: Sqlite,
    openDrawerCB: ()=>{},
    style?: StyleSheet
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientTo: '#08130D',
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
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
let db:Sqlite;
export default class Statistics extends Component<Props>{
    constructor(props){
        super(props);
        this.state={
            displayForms:['Usage','Date'],
            displaying:'Usage',
            types:['Expense','Income'],
            choosenType:'Expense',
            timeFrom:moment().startOf('month').format('YYYY-MM-DD'),
            timeTo:moment().endOf('month').format('YYYY-MM-DD'),
            // MethodData:[],
            // UsageData:[],
            displayedData:[],
        };
        db=this.props.db;
    }
    componentWillUpdate(next){
        // if(this.state)
        this.getPieData();
        // this.setData();
    }
    async setData(){
        let ColorInd=0;
        let first = moment().startOf('month').format('YYYY-MM-DD');
        let datebase = await db.in(TableBasicAccounting.name)
                                .where(`firstTime >= ${first}`)
                                .select();
        let cntMethod=[],cntUsage=[];
        for(let i=0;i<BaseTableFieldTitle.method.length;i++){
            cntMethod.push(0);
        }
        for (let i = 0; i < BaseTableFieldTitle.usage[0].length+BaseTableFieldTitle.usage[1].length; i++) {
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
        for (let i = 0; i < BaseTableFieldTitle.usage[0].length+BaseTableFieldTitle.usage[1].length; i++) {
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
    async getPieData(){
        let data = await db.in(TableBasicAccounting.name)
            .field('sum(amount) as Tamount,usage,firstTime,amount')
            .groupBy('usage')
            .where(`firstTime>='${this.state.timeFrom}' AND firstTime<='${this.state.timeTo}' AND amount ${this.state.choosenType==='Expense'?'<':'>'} 0`)
            .select();
        
        data = data.map((v,i)=>{return {name:BaseTableFieldTitle.usage[v.usage>99?1:0][v.usage>99?v.usage-100:v.usage],Amount:Math.abs(v['Tamount']),color:colorbox[i],legendFontColor:'#7f7f7f',legendFontSize:15}});
        // console.log('data:',data);
        
        this.setState({displayedData:data});
    }
    render(){
        return (
            <View style={[{height:windowHeight},this.props.style?this.props.style:{}]}>
                <StatusBar translucent barStyle={'light-content'} backgroundColor={'rgba(0, 0, 0, 0.3)'} />
                <Header
                    backgroundColor={ThemeConfig.themeMainColor}
                    placement="left"
                    leftComponent={{ icon: "menu", color: "#fff" , onPress:()=>{this.props.openDrawerCB()}}}
                    centerComponent={{ text: "Statistics", style: { color: "#fff" } }}
                />
                <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'rgb(225,225,225)'}}>
                    <Text>Type</Text>
                    <Picker style={{ height: 25, width: 110 }} selectedValue={this.state.choosenType} onValueChange={(v)=>{this.setState({choosenType:v})}} >
                    {this.state.types.map(v=>(
                        <Picker.Item key={v} label={v} value={v} />
                    ))}
                    </Picker>
                    <Text>By</Text>
                    <Picker style={{ height: 25, width: 110 }} selectedValue={this.state.displaying} onValueChange={(v)=>{this.setState({displaying:v})}} >
                    {this.state.displayForms.map(v=>(
                        <Picker.Item key={v} label={v} value={v} />
                    ))}
                    </Picker>
                    {/* <Text>From</Text> */}
                </View>
                <View >
                    <PieChart
                        data={this.state.displayedData}
                        width={windowWidth}
                        height={250}
                        chartConfig={chartConfig}
                        accessor="Amount"
                        backgroundColor="transparent"
                        paddingLeft="8"
                        absolute
                    />
                </View>
                
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