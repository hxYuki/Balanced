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
import Sqlite from './lib/sqlite';
import { DatabaseConfig, TableBasicAccounting, TableTags, DBVersion } from './config/DatabaseConfig';


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
    
    let cycles = await db.in(TableBasicAccounting.name).where('cycleCount is not null AND nextTriggerTime is not null').select();
    console.log(cycles);
    
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
      firstTime: new Date()
    },
    {
      amount:25,
      note:'',
      method:0,
      usage:0,
      firstTime: (new Date()).toString()
    },
    {
      amount:100,
      note:'',
      method:0,
      usage:0,
      firstTime: (new Date()).toString()
    }
  ];
  await db.in('BaseTable').insert(data);
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
        updateCycles();
        break;
      case 'updated':
        break;
      case 'unchecked':
        ToastAndroid.show('Up-to-date Check Failed.',ToastAndroid.SHORT);
    }
  });
}

var db= new Sqlite(DatabaseConfig);
type Props = {};
export default class App extends Component<Props> {
  constructor(props){
    super(props);
    
    // console.log(DatabaseConfig,{name:'Balanced'});
    
    // checkThings().then(()=>{
      // popinSomeData();
    // })
    // clearStorage();
    // clearDB();
    // updateCycles();
  }
  componentDidMount(){
    // clearDB();

  }
  render() {
    return (// TODO : Replace this with Drawer component
      <View>
        <Main openDrawer={()=>{}} db={db} />

      </View>
    );
  }
}