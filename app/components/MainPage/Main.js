import React, {Component} from 'react';
import {View, Text, SectionList, StatusBar, StyleSheet, ToastAndroid, Dimensions, AsyncStorage} from 'react-native';
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
  openDrawerCB: OpenDrawerCallback,
  setTotalDeposit: SetTotalDepositCallback,
  db: Sqlite
}

const checkUpdated = async () => {
  let today = ((new Date()).toDateString('zh-Hans',{year:'numeric',month:'numeric',day:'numeric'}));
  try {
    let lastCheck = await AsyncStorage.getItem('today');
    if(lastCheck){
      if((new Date(today))>(new Date(lastCheck))){
        // Need update
        return 'outdated';
      }
    }
  } catch (e) {
    console.log('AsyncStorage Err: ',e);
    return 'unchecked';
  }
  //
  return 'updated';
}
const updateCycles = async () => {
  try{
    console.log('updating');
    
    let cycles = await db.in(TableBasicAccounting.name).field('*').where('cycleCount is not null AND nextTriggerTime<=date("now")').select();
    // console.log('toUpdate',cycles);
    
    cycles.forEach(v=>{
      let d = {...v,nextTriggerTime:null,firstTime:v.nextTriggerTime,cycleCount:null};
      delete d.id;
      // console.log('cycle',d);
      db.in(TableBasicAccounting.name).insert(d);
      db.in(TableBasicAccounting.name).where(`id==${v.id}`).update({'nextTriggerTime':moment(v.nextTriggerTime).add(v.cycleCount,BaseTableFieldTitle.cycleUnit[v.cycleUnit]).format('YYYY-MM-DD')});
      // console.log('next',moment(v.nextTriggerTime).add('W',v.cycleCount).format('YYYY-MM-DD'));
      
    })
    // let cyclesNeedUpdate = cycles.filter()
  }catch(e){

  }
}
const popinSomeData = async () => {
  const data = [
    {
      amount:10,
      note:'',
      method:0,
      usage:0,
      cycleCount:1,
      cycleUnit:0,
      firstTime: moment().format('YYYY-MM-DD')
    },{
      amount:25,
      note:'',
      method:0,
      usage:0,
      firstTime: moment().format('YYYY-MM-DD')
    },{
      amount:100,
      note:'',
      method:0,
      usage:0,
      firstTime: moment().format('YYYY-MM-DD')
    },{
      amount:-40,
      note:'',
      method:0,
      usage:0,
      firstTime: moment().add(-1,'y').format('YYYY-MM-DD'),
      nextTriggerTime: moment().format('YYYY-MM-DD'),
      cycleCount: 10
    }
  ];
  await db.in(TableBasicAccounting.name).insert(data);
  console.log('data ok');
  
}
const clearStorage = async () => {
  try {
    AsyncStorage.clear();
  } catch (e) {
    
  }
}
const initDB = async () => {
  try {
    await db.createTable(TableBasicAccounting);
    await db.createTable(TableTags);
    console.log('init ed');
  } catch (e) {
    console.log('Init err: ',e);
    return false;
  }
  
}
const checkDatabase = async () => {
  try{
    console.log('checking');
    
    let dbVersion = await AsyncStorage.getItem('dbVersion');
    if(!dbVersion){
      ToastAndroid.show('Initializing...',ToastAndroid.LONG);
      console.log('initializing');
      
      await initDB();
      AsyncStorage.setItem('dbVersion',DBVersion);
    }
    // DB exists
    return 'DB OK';
  }catch(e){
    console.log('Exception happens: ',e);
    return 'unchecked';
  }
  return 'NO DB';
}
const clearDB = async () => {
  try{
    AsyncStorage.removeItem('dbVersion');
    await db.dropTable(TableBasicAccounting.name);
    await db.dropTable(TableTags.name);
    console.log('clear!');
  }catch(e){
    console.log(e);
  }
  
}

const checkThings = async ()=>{
  return checkDatabase().then(res=>{
    switch (res) {
      case 'DB OK':
        return true;
      case 'NO DB':
        ToastAndroid.show('DB init Failed',ToastAndroid.SHORT);
      case 'unchecked':
        ToastAndroid.show('DB Check Failed.',ToastAndroid.SHORT);
    }
    return false;
  }).then(res=>{
    if(res)
      return checkUpdated();
  }).then(res=>{
    switch(res){
      case 'outdated':
        //TODO: update
        return updateCycles();
        break;
      case 'updated':
        break;
      case 'unchecked':
        ToastAndroid.show('Up-to-date Check Failed.',ToastAndroid.SHORT);
    }
  });
}

var db:Sqlite;
export default class Main extends Component<Props>{
  constructor(props){
    super(props);
    this.state={
      accounts:List([]),
      income:0,
      expense:0,
      deposit:0,
      modifying:false,
      modified:{}
    };
    db=this.props.db;

    checkThings().then(()=>{
      this.refreshAfterSubmitted();
    })
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
    
    let results = await db.in(TableBasicAccounting.name)
      .field('*')
      .limit(10,countListData(this.state.accounts))
      .orderedBy('firstTime desc, id desc')
      .select();
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

    {
      let totalDeposit = await db.in(TableBasicAccounting.name)
        .field("method, usage, sum(amount) as total")
        .where('(usage==6 or method==4)')
        .select();
        
      this.props.setTotalDeposit(parseInt(totalDeposit[0]['total']).formatCurrency({symbol:''}))
    }
    
  }
  async refreshAfterSubmitted(){
    await this.queryListData();
    await this.queryStatData();
    this.refs['section'].props.refreshing=false
  }
  async refresh(){
    await updateCycles();
    this.refs['section'].props.refreshing=true;
    this.setState({
      accounts: this.state.accounts.clear(),
      income: 0,
      expense: 0,
      deposit: 0
    }, ()=>{this.refreshAfterSubmitted()});
  }
  render(){
    return (
      <View style={{height:height}}>
        <StatusBar translucent barStyle={'light-content'} backgroundColor={'rgba(0, 0, 0, 0.3)'} />
        <Header
          backgroundColor={ThemeConfig.themeMainColor}
          containerStyle={{borderBottomWidth:0}}
          placement="left"
          leftComponent={{ icon: "menu", color: "#fff" , onPress:()=>{this.props.openDrawerCB()}}}
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
              onLongPress={()=>{this.setState({modified:item,modifying:true})}}
            />)}
          keyExtractor={(item,index)=>index.toString()}
          // onEndReachedThreshold={}
          onEndReached={()=>{this.queryListData()}}
          refreshing={false}
          onRefresh={()=>{this.refresh();}}
        />
        
        <Floatwindow db={db} refresh={()=>{this.refresh();}} />
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