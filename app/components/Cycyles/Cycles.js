import React, {Component} from 'react';
import {View, Text, Image, SectionList, StatusBar, StyleSheet, ToastAndroid, Dimensions, AsyncStorage} from 'react-native';
import {Header, ListItem} from 'react-native-elements';
import moment from 'moment';
import {List} from 'immutable';

import ThemeConfig from '../../config/ThemeConfig';
import Sqlite from '../../lib/sqlite';
import {TableBasicAccounting, BaseTableFieldTitle} from '../../config/DatabaseConfig';
import Modify from '../Modify/Modify';

import icons from '../../assets/icon/icons';

const height = Dimensions.get('window').height;

const parseYearMonth=(n) => {return (moment(n).format('YYYY-MM'));}
const countListData = (list: List) => (list.reduce((acc,v)=>(acc+v.data.length),0))

type OpenDrawerCallback = ()=>{}
type Props = {
  openDrawerCB: OpenDrawerCallback,
  db: Sqlite,
  style?: StyleSheet
}
var db:Sqlite;
export default class Cycles extends Component<Props>{
  constructor(props){
    super(props);
    this.state={
      accounts:List([]),
      modifying:false,
      modified:{}
    };
    db=this.props.db;
    // this.refreshAfterSubmitted();

  }
  componentDidMount(){
    this.queryListData();
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
    // console.log('querying');
    let results = await db.in(TableBasicAccounting.name)
      .field('*')
      .limit(10,countListData(this.state.accounts))
      .orderedBy('firstTime desc, id desc')
      .where('cycleCount is not null')
      .select();
    // console.log(results);
    if(!results)
    {
      ToastAndroid.show('No more records!',ToastAndroid.SHORT);
      return;
    }
    this.processSections(results);
  }
  async refreshAfterSubmitted(){
    await this.queryListData();
    this.refs['section'].props.refreshing=false
  }
  async refresh(){
    this.refs['section'].props.refreshing=true;
    this.setState({
      accounts: this.state.accounts.clear(),
    }, ()=>{this.refreshAfterSubmitted()});
  }
  render(){
    return (
      <View style={[{height:height},this.props.style?this.props.style:{}]}>
        <StatusBar translucent barStyle={'light-content'} backgroundColor={'rgba(0, 0, 0, 0.3)'} />
        <Header
          backgroundColor={ThemeConfig.themeMainColor}
          placement="left"
          leftComponent={{ icon: "menu", color: "#fff" , onPress:()=>{this.props.openDrawerCB()}}}
          centerComponent={{ text: "Balanced", style: { color: "#fff" } }}
        />
        <SectionList
          sections={this.state.accounts.toJS()}
          ref={'section'}
          stickySectionHeadersEnabled
          renderSectionHeader={({section:{title}})=><Text style={MainStyle.SectionHeaderStyle}>{moment(title).format('MMMM')}</Text>}
          renderItem={({ item }) => 
            (<ListItem
              containerStyle={MainStyle.ListItemStyle} 
              topDivider 
              bottomDivider
              leftIcon={<Image source={icons[BaseTableFieldTitle.method[item.method]]} style={{borderRadius:20,width:40,height:40,tintColor:ThemeConfig.themeStrongColor,backgroundColor:ThemeConfig.themeTextColor}} />} 
              title={BaseTableFieldTitle.usage[item.usage>99?1:0][item.usage>99?item.usage-100:item.usage]} 
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
        {this.state.modifying&&<Modify 
          db={db} 
          data={this.state.modified}
          refresh={() => { this.refresh();}}
          modifying={this.state.modifying}
          closeModify={()=>{this.setState({modifying:false})}}
        />}
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