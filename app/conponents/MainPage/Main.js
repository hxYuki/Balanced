import React, {Component} from 'react';
import {View, Text, SectionList, StatusBar, StyleSheet} from 'react-native';
import {Header, ListItem} from 'react-native-elements';


import {ListHeader} from './Components';
import ThemeConfig from '../../config/ThemeConfig';
import Sqlite from '../../lib/sqlite';
import {Database, TableBasicAccounting} from '../../config/DatabaseConfig';
import Floatwindow from '../FloatWindow/FloatWindow';




const parseMonth=(n) => {return (new Date(n)).toLocaleString('en-Us', {month: 'long'});}

type OpenDrawerCallback = ()=>{}
type SetTotalDepositCallback = (totalDeposit:Number)=>{}
type Props = {
  openDrawer: OpenDrawerCallback,
  setTotalDeposit?: SetTotalDepositCallback,
  db?: Sqlite
}

var db;
export default class Main extends Component<Props>{
  constructor(props){
    super(props);
    this.state={
      accounts:[],
      income:0,
      expense:0,
      deposit:0
    };
    db=this.props.db;
  }
  componentDidMount(){
    this.queryData();
  }
  processSections(initialData:Array) {
    if (initialData.length === 0) return;
    let t = {
      title: '',
      data: []
    };
    t.title = parseMonth(initialData[0]['firstTime']);
    initialData.reduce((acc, v) => {
      if (t.title === parseMonth(v['firstTime']))
        t.data.push(v);
    });
    this.setState({
      accounts: [...this.state.accounts, t]
    });

    this.processSections(initialData.filter(v => t.title !== parseMonth(v['firstTime'])));
  }
  async queryData(){
    
      console.log('querying');
      
      let results = await db.in(TableBasicAccounting.name).select();

      // console.log('r',results);
      
      if(!results)
      {
        console.log('query failed',db);
        
        return;
      }
      this.processSections(results);
    
  }
  
  render(){
    return (
      <View>
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
          sections={this.state.accounts}
          stickySectionHeadersEnabled
          renderSectionHeader={({section:{title}})=><Text style={MainStyle.SectionHeaderStyle}>{title}</Text>}
          ListHeaderComponent={<ListHeader income={this.state.income} expense={this.state.expense} deposit={this.state.deposit} />}
          renderItem={({item})=>(<ListItem containerStyle={MainStyle.ListItemStyle} topDivider bottomDivider leftIcon={{name:'flight-takeoff',color:ThemeConfig.themeStrongColor,reverse:true}} title={'Usage'} subtitle={'note'} rightTitle={'amount'} rightSubtitle={'date'} />)}
          keyExtractor={(item,index)=>index.toString()}
          // onEndReachedThreshold={}
          onEndReached={()=>{this.queryData()}}
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