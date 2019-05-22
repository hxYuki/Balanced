import React, {Component} from 'react';
import {View, SectionList, StatusBar} from 'react-native';
import {Header, ListItem} from 'react-native-elements';

import {ListHeader} from './Components';
import ThemeConfig from '../../config/ThemeConfig';
export default class Main extends Component{
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
    this.setState({accounts:[{title:'May',data:[1]}]});
  }
  parseMonth(n){return (new Date(n)).toLocaleString('en-Us',{month:'long'});}
  processSections(initialData) {
    if (initialData.length === 0) return;
    let t = {
      title: '',
      data: []
    };
    t.title = this.parseMonth(initialData[0]['firstTime']);
    t.data = initialData.reduce((acc, v) => {
      if (t.title === this.parseMonth(v['firstTime']))
        acc.push(v);
    }, []);
    this.setState({
      accounts: [...this.state.accounts, t]
    });

    processSections(initialData.filter(v => t.title !== this.parseMonth(v['firstTime'])));
  }
  render(){
    return (
      <View style={{ flex: 1 }}>
        <StatusBar translucent={true} barStyle={'light-content'} />
        <Header
          backgroundColor={ThemeConfig.themeColor}
          containerStyle={{borderBottomWidth:0}}
          placement="left"
          leftComponent={{ icon: "menu", color: "#fff" }}
          centerComponent={{ text: "Balanced", style: { color: "#fff" } }}
          // statusBarProps={{ translucent: true, barStyle: "light-content" }}
        />
        <SectionList
          sections={this.state.accounts}
          ListHeaderComponent={<ListHeader income={this.state.income} expense={this.state.expense} deposit={this.state.deposit} />}
          renderItem={({item})=>(<ListItem title={'Usage'} subtitle={'note'} rightTitle={'amount'} rightSubtitle={'date'} />)}
          keyExtractor={(item,index)=>index.toString()}
        />
      </View>
    );
  }
}