import React, {Component} from 'react';
import {View, Text, SectionList, StatusBar, StyleSheet} from 'react-native';
import {Header, ListItem} from 'react-native-elements';

import {ListHeader} from './Components';
import ThemeConfig from '../../config/ThemeConfig';
import sqlite from '../../lib/sqlite';
import {Database} from '../../config/DatabaseConfig';
// import { type } from 'os';

var db = new sqlite(Database);

const parseMonth=(n) => {return (new Date(n)).toLocaleString('en-Us', {month: 'long'});}

type OpenDrawerCallback = ()=>{}
type Props = {
  openDrawer: OpenDrawerCallback
}
export default class Main extends Component<Props>{
  constructor(props){
    super(props);
    this.state={
      accounts:[],
      income:0,
      expense:0,
      deposit:0
    };
  }
  componentDidMount(){
    this.setState({
      accounts: [{
        title: 'May',
        data: [1, 2, 3]
      }, {
        title: 'April',
        data: [4, 5, 6, 7, 8, 9]
      }]
    });
  }
  processSections(initialData) {
    if (initialData.length === 0) return;
    let t = {
      title: '',
      data: []
    };
    t.title = parseMonth(initialData[0]['firstTime']);
    t.data = initialData.reduce((acc, v) => {
      if (t.title === parseMonth(v['firstTime']))
        acc.push(v);
    }, []);
    this.setState({
      accounts: [...this.state.accounts, t]
    });

    processSections(initialData.filter(v => t.title !== parseMonth(v['firstTime'])));
  }
  async queryData(){
    try {
      let results = await db.in('BaseTable').limit(10,this.state.accounts.length).select();
      this.processSections(results);
    } catch (e) {
      console.log(e);
    }
  }
  
  render(){
    return (
      <View>
        <StatusBar translucent barStyle={'light-content'} backgroundColor={'rgba(0, 0, 0, 0.3)'} />
        <Header
          backgroundColor={ThemeConfig.themeMainColor}
          containerStyle={{borderBottomWidth:0}}
          placement="left"
          leftComponent={{ icon: "menu", color: "#fff" }}
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
        />
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