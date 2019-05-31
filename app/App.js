/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {AsyncStorage, ToastAndroid,View} from 'react-native';
import moment from 'moment';
import './extends/Number';

import Drawer from './components/Drawer/Drawer';
import Sqlite from './lib/sqlite';
import { DatabaseConfig, TableBasicAccounting, TableTags, DBVersion, BaseTableFieldTitle } from './config/DatabaseConfig';

var db= new Sqlite(DatabaseConfig);
type Props = {};
export default class App extends Component<Props> {
  constructor(props){
    super(props);
    
    // console.log(DatabaseConfig,{name:'Balanced'});
    
    // checkThings().then(()=>{
    //   // popinSomeData();
    // })
    // clearStorage();
    // clearDB().then(()=>{
    //   return checkThings();
    // }).then(()=>{
    //   popinSomeData();
    // })
    // updateCycles();
  }
  componentDidMount(){
    // clearDB();

  }
  render() {
    return (// TODO : Replace this with Drawer component
      <Drawer db={db} />
    );
  }
}