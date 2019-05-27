/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {AsyncStorage, ToastAndroid,View} from 'react-native';
import './extends/Number';

import Main from './conponents/MainPage/Main';
import Floatwindow from './conponents/FloatWindow/FloatWindow';
import Sqlite from './lib/sqlite';
import { Database, TableBasicAccounting, TableTags, DBVersion } from './config/DatabaseConfig';


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
const clearStorage = async () => {
  try {
    AsyncStorage.clear();
  } catch (e) {
    
  }
}
const initDB = async () => {
  try {
    db.createTable(TableBasicAccounting);
    db.createTable(TableTags);
  } catch (e) {
    console.log('Init err: ',e);
    return false;
  }
}
const checkDatabase = async () => {
  try{
    let dbVersion = await AsyncStorage.getItem('dbVersion');
    if(!dbVersion){
      ToastAndroid.show('Initializing...',ToastAndroid.LONG);
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
        break;
      case 'updated':
        break;
      case 'unchecked':
        ToastAndroid.show('Up-to-date Check Failed.',ToastAndroid.SHORT);
    }
  });
}
let db = new Sqlite(Database);
type Props = {};
export default class App extends Component<Props> {
  constructor(props){
    super(props);
    
    checkThings();
    // clearStorage();
  }
  render() {
    return (// TODO: Replace this with Drawer component
      <View>
        <Main />

      </View>
    );
  }
}