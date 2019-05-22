import React,{} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Card} from 'react-native-elements';
import ThemeConfig from '../../config/ThemeConfig';

const ListHeader = ({income, expense, deposit}) => (
  <View style={ListHeaderStyle.Container}>
    <Text h2 style={ListHeaderStyle.ListTextCommon}>This week: {(income - expense).formatCurrency()}</Text>
    <View style={ListHeaderStyle.ListTextContainer}>
      <Text style={ListHeaderStyle.ListTextCommon}>Income: {income.formatCurrency()}</Text>
      <Text style={ListHeaderStyle.ListTextCommon}>Expense: {expense.formatCurrency()}</Text>
      <Text style={ListHeaderStyle.ListTextCommon}>Deposit: {deposit.formatCurrency()}</Text>
    </View>
  </View>
);
const ListHeaderStyle = StyleSheet.create({
  Container:{
    backgroundColor:ThemeConfig.themeColor,
    paddingBottom:10,
    paddingLeft:10,
    paddingRight:10
  },
  ListTextContainer:{
    flexDirection:'row',
    justifyContent:'space-between'
  },
  ListTextCommon:{
    color:ThemeConfig.themeTextColor,
    fontSize:17
  }
})

export {ListHeader};