import React, {Component} from 'react';
import {View, Text, SectionList, StatusBar, StyleSheet, ToastAndroid, Dimensions} from 'react-native';
import {Header, ListItem} from 'react-native-elements';
import moment from 'moment';
import {List} from 'immutable';

import {ListHeader} from './Components';
import ThemeConfig from '../../config/ThemeConfig';
import Sqlite from '../../lib/sqlite';
import {TableBasicAccounting, BaseTableFieldTitle} from '../../config/DatabaseConfig';
import Floatwindow from '../FloatWindow/FloatWindow';


const height = Dimensions.get('window').height;

const parseYearMonth=(n) => {return (moment(n).format('YYYY-MM'));}
const countListData = (list: List) => (list.reduce((acc,v)=>(acc+v.data.length),0))

type OpenDrawerCallback = ()=>{}
type SetTotalDepositCallback = (totalDeposit:Number)=>{}
type Props = {
  openDrawer: OpenDrawerCallback,
  setTotalDeposit?: SetTotalDepositCallback,
  db: Sqlite
}

var db:Sqlite;
export default class Main extends Component<Props>{
  constructor(props){
    super(props);
    this.state={
      accounts:List([]),
      income:0,
      expense:0,
      deposit:0
    };
    db=this.props.db;
  }
  componentDidMount(){
    this.queryListData();
    this.queryStatData();
  }
  processSections(initialData:Array) {
    if (initialData.length === 0) return;
    let t = {
      title: '',
      data: []
    };
    t.title = parseYearMonth(initialData[0]['firstTime']);
    t.data = initialData.filter(v => t.title === parseYearMonth(v['firstTime']));
    let hasIndex = -1;
    if (-1 !== (hasIndex = this.state.accounts.findIndex(v => v.title === t.title))) {
      let newT = this.state.accounts.get(hasIndex);
      t.data = newT.data.concat(t.data);
      this.setState({
        accounts: this.state.accounts.set(hasIndex,t)
      });
    } else {
      this.setState({
        accounts: this.state.accounts.push(t)
      });
    }
    
    return this.processSections(initialData.filter(v => t.title !== parseYearMonth(v['firstTime'])));
  }
  async queryListData(){
    console.log('querying');
    
    let results = await db.in(TableBasicAccounting.name).limit(10,countListData(this.state.accounts)).orderedBy('id','desc').select();
    // console.log(results);
    
    if(!results)
    {
      ToastAndroid.show('No more records!',ToastAndroid.SHORT);
      return;
    }
    this.processSections(results);
  }
  async queryStatData(){
    // let expense = await db.in(TableBasicAccounting.name).field(['SUM(amount)']).where('amount>0').groupBy('firstTime')
    // let r = await db.execRaw(`select firstTime, sum(amount) as total, strftime('%m',firstTime) as trueDate from ${TableBasicAccounting.name} where amount>0 group by trueDate`);
    let income = await db.in(TableBasicAccounting.name)
      .field("usage, firstTime, sum(amount) as total, strftime('%m',firstTime) as month")
      .groupBy('month')
      .where('amount>0 and month=strftime("%m","now") and usage!=6')
      .select();
    let expense = await db.in(TableBasicAccounting.name)
      .field("usage, firstTime, sum(amount) as total, strftime('%m',firstTime) as month")
      .groupBy('month')
      .where('amount<0 and month=strftime("%m","now") and usage!=6')
      .select();
    let deposit = await db.in(TableBasicAccounting.name)
      .field("method, usage, firstTime, sum(amount) as total, strftime('%m',firstTime) as month")
      .groupBy('month')
      .where('month=strftime("%m","now") and (usage==6 or method==4)')
      .select();
     
    this.setState({
      income:income?income[0]['total']:0,
      expense:expense?expense[0]['total']:0,
      deposit:deposit?deposit[0]['total']:0
    })

    // if(this.props.setTotalDeposit!==undefined){
    //   let totalDeposit = await db.in(TableBasicAccounting.name)
    //     .field("method, usage, sum(amount) as total")
    //     .where('usage==6 or method==4')
    //     .select();
    //   this.props.setTotalDeposit(totalDeposit?totalDeposit[0]['total']:0)
    // }
    
  }
  async refreshAfterSubmitted(){
    await this.setState({
      accounts: this.state.accounts.clear(),
      income:0,
      expense:0,
      deposit:0
    });
    await this.queryListData();
    await this.queryStatData();
    this.refs['section'].props.refreshing=false
  }
  render(){
    return (
      <View style={{height:height}}>
        <StatusBar translucent barStyle={'light-content'} backgroundColor={'rgba(0, 0, 0, 0.3)'} />
        <Header
          backgroundColor={ThemeConfig.themeMainColor}
          containerStyle={{borderBottomWidth:0}}
          placement="left"
          leftComponent={{ icon: "menu", color: "#fff" , onPress:this.props.openDrawer()}}
          centerComponent={{ text: "Balanced", style: { color: "#fff" } }}
          // statusBarProps={{ translucent: true, barStyle: "light-content" }}
        />
        <SectionList
          sections={this.state.accounts.toJS()}
          ref={'section'}
          stickySectionHeadersEnabled
          renderSectionHeader={({section:{title}})=><Text style={MainStyle.SectionHeaderStyle}>{moment(title).format('MMMM')}</Text>}
          ListHeaderComponent={<ListHeader income={this.state.income} expense={this.state.expense} deposit={this.state.deposit} />}
          renderItem={({ item }) => 
            (<ListItem
              containerStyle={MainStyle.ListItemStyle} 
              topDivider 
              bottomDivider
              leftIcon={{ name: 'flight-takeoff', color: ThemeConfig.themeStrongColor, reverse: true }} 
              title={BaseTableFieldTitle.usage[item.usage]} 
              subtitle={item.note?item.note:'(none)'} 
              rightTitle={(item.amount).formatCurrency({symbol:'￥'})} 
              rightSubtitle={moment(item.firstTime).format("YYYY-MM-D")}
            />)}
          keyExtractor={(item,index)=>index.toString()}
          // onEndReachedThreshold={}
          onEndReached={()=>{this.queryListData()}}
          refreshing={false}
          onRefresh={()=>{this.refs['section'].props.refreshing=true;this.refreshAfterSubmitted()}}
        />

        {/* <Floatwindow /> */}
      </View>
    );
  }
}

const MainStyle = StyleSheet.create({
  SectionHeaderStyle:{
    backgroundColor:ThemeConfig.themeWeakColor,
    // borderTopColor:'#f2f2f2',
    borderColor:'rgb(200,200,200)',
    borderTopWidth:0.3636,
    borderBottomWidth:0.3636,
    // marginLeft:10,
    // marginRight:10,
    // marginTop:2,
    paddingLeft:15,
  },
  ListItemStyle:{
    margin:5,
    marginLeft:10,
    marginRight:10,
    borderLeftWidth:0.3636,
    borderRightWidth:0.3636,
  }
});