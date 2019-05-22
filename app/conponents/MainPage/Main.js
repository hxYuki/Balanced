import React, {Component} from 'react';
import {View} from 'react-native';
import {Header,} from 'react-native-elements';

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


  render(){
    return (
      <View style={{flex:1}}>
        <Header
          // backgroundColor=""  Defined later
          placement="left"
          leftComponent={{ icon: "menu", color: "#fff" }}
          centerComponent={{ text: "Balanced", style:{color: "#fff"} }}
          statusBarProps={{translucent:true,barStyle:'light-content'}}
        />
      </View>
    );
  }
}