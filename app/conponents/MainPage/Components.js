import React,{} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Card} from 'react-native-elements';
import ThemeConfig from '../../config/ThemeConfig';

const ListHeader = ({income, expense, deposit}) => (
  <View style={ListHeaderStyle.Container}>
    <Text h4 style={ListHeaderStyle.ListTextCommon}>This month: {(income + expense).formatCurrency({symbol:'￥'})}</Text>
    <View style={ListHeaderStyle.ListTextContainer}>
      <View style={ListHeaderStyle.ListInnerTextContainer}>
        <Text style={ListHeaderStyle.ListTextCommon}>Income: </Text>
        <Text style={ListHeaderStyle.ListTextStrong}>{income.formatCurrency({ symbol: '￥' })}</Text>
      </View>
      <View style={ListHeaderStyle.ListInnerTextContainer}>
        <Text style={ListHeaderStyle.ListTextCommon}>Expense: </Text>
        <Text style={ListHeaderStyle.ListTextStrong}>{expense.formatCurrency({symbol:'￥'})}</Text>
      </View>
      <View style={ListHeaderStyle.ListInnerTextContainer}>
        <Text style={ListHeaderStyle.ListTextCommon}>Deposit: </Text>
        <Text style={ListHeaderStyle.ListTextStrong}>{deposit.formatCurrency({symbol:'￥'})}</Text>
      </View>
    </View>
  </View>
);
const ListHeaderStyle = StyleSheet.create({
  Container:{
    backgroundColor:ThemeConfig.themeMainColor,
    paddingBottom:10,
    paddingLeft:10,
    paddingRight:10,
    // marginBottom:5,
    // borderColor:'#f2f2f2',
    // borderBottomWidth:0.3636,
  },
  ListTextContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    flex:1
  },
  ListInnerTextContainer:{
    // flexDirection:'row',
    flex:1,
    // alignItems:'center'
    marginLeft:5,
    marginRight:5
  },
  ListTextCommon:{
    color:ThemeConfig.themeTextColor,
    fontSize:12,
    
  },
  ListTextStrong:{
    color:ThemeConfig.themeTextColor,
    fontSize:17,
    textAlign:'right',
    flex:1,
  }
})

export {ListHeader};