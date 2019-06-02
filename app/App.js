/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {AsyncStorage, ToastAndroid,View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import './extends/Number';

import Drawer from './components/Drawer/Drawer';
import Sqlite from './lib/sqlite';
import { DatabaseConfig, TableBasicAccounting, TableTags, DBVersion, BaseTableFieldTitle } from './config/DatabaseConfig';
import { UpDownLoadUrl } from './config/UrlConfig';
import { sha256 } from 'react-native-sha256';


const DeviceID=DeviceInfo.getDeviceId();
const toastShort=(str)=>{ToastAndroid.show(str,ToastAndroid.SHORT);}
const genId = async (str) => sha256(str);
const assignId = async () => {
  let id = await AsyncStorage.getItem('uniqueId');
  
  if(!id){
    let did = DeviceID;
    let resText;
    do{
      id = (await genId(did)).slice(0,9);
      did = DeviceID+'21';
      resText = await fetch(UpDownLoadUrl+`?testId=${id}`,{method:'GET'}).then(res=>res.text())
        .then(res=>res).catch(e=>{console.log('net:',e);});
    }while(resText === 'duplicated'&&(toastShort('Duplicated id encountered, regenerating...'),true));
    
    do{
      toastShort('Registering...');
      resText = await fetch(UpDownLoadUrl, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `id=${id}&data=${JSON.stringify([])}`
      }).then(res => res.text())
        .then(res=>res).catch(e=>{console.log('net:',e);});
    }while(resText==='upload failed'&&(toastShort('Failure, retrying...'),true));
    
    await AsyncStorage.setItem('uniqueId',id);
  }
}


var db= new Sqlite(DatabaseConfig);
type Props = {};
export default class App extends Component<Props> {
  constructor(props){
    super(props);
    
  }
  componentDidMount(){
    assignId();
  }
  render() {
    return (
      <Drawer db={db} />
    );
  }
}