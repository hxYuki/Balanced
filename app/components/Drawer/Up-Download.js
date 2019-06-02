import React,{Component} from 'react';
import { ProgressBarAndroid, View, Text, BackHandler, Alert, AsyncStorage } from 'react-native';
import {Overlay} from 'react-native-elements';
import Sqlite from '../../lib/sqlite';
import { UpDownLoadUrl } from '../../config/UrlConfig';
import { TableBasicAccounting } from '../../config/DatabaseConfig';


type Props = {
  showing:string,
  handleBack:()=>{},
  db:Sqlite
};
type TransStatus='done'|'uploading'|'downloading';
var db:Sqlite;
export default class UpDownModal extends Component<Props>{
  constructor(props){
    super(props);
    this.state={
      transfering:'done',
      statusText:'IDLING'
    }
    db=this.props.db;
  }
  componentWillUpdate(next){
    console.log('props:','prev',this.props.showing,'next',next.showing);
    if(this.props.showing!==next.showing&&next.showing!=='none'){
      switch(next.showing){
        case 'upload': this.upload(); break;
        case 'download':this.download(); break;
      }
    }
  }
  shutTransfer(){
    this.setState({transfering:'done',statusText:'Idling'});
    // Other things may be to be done
  }
  async upload(){
    this.setState({statusText:'Preparing...',transfering:'uploading'})
    let id = await AsyncStorage.getItem('uniqueId');
    this.setState({statusText:'Exporting data...'})
    let collections = await db.in(TableBasicAccounting.name).select();
    this.setState({statusText:'Uploading...'});
    let resText = await fetch(UpDownLoadUrl,{
      method:'POST',
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body:`id=${id}&data=${JSON.stringify(collections)}`
    }).then(res=>res.text()).then(res=>res).catch(e=>console.log('net:',e));
    if(resText==='uploaded'){
      Alert.alert('Backup','Success!',[{text:'Read',onPress:()=>{this.shutTransfer();this.props.handleBack()}}],{cancelable:false});
    }else{
      console.log('res',resText);
      
      Alert.alert('Backup','Failed.',[{text:'Cancel',onPress:()=>{this.shutTransfer();this.props.handleBack()}},{text:'Retry',onPress:()=>{this.upload()}}],{cancelable:false});
    }
  }
  async download(){
    this.setState({statusText:'Preparing...',transfering:'downloading'})
    let id = await AsyncStorage.getItem('uniqueId');
    this.setState({statusText:'Downloading...'});
    let collections = await fetch(UpDownLoadUrl,{
      method:'POST',
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body:`id=${id}`
    }).then(res=>res.json()).then(res=>(console.log(res),res)).catch(e=>console.log('net:',e));
    if(!collections instanceof Array){
      Alert.alert('Restore','Failed.',[{text:'Cancel',onPress:()=>{this.shutTransfer();this.props.handleBack()}},{text:'Retry',onPress:()=>{this.download()}}],{cancelable:false});
    }else{
      this.setState({statusText:'Importing data...'});
      await db.dropTable(TableBasicAccounting.name);
      await db.createTable(TableBasicAccounting);
      let c = await db.in(TableBasicAccounting.name).insert(collections);
      Alert.alert('Restore',`${c.length} item(s) imported.`,[{text:'Read',onPress:()=>{this.shutTransfer();this.props.handleBack()}}],{cancelable:false});
    }
  }
  render(){
    return (
      <Overlay isVisible={this.props.showing!=='none'}
        height={150}
        onBackdropPress={()=>{
          if(this.state.transfering==="done")
            this.props.handleBack()
          else Alert.alert('Attention',`It is ${this.state.transfering}, quit?`,[
            {text:'Cancel',style:'cancel'},
            {text:'Confirm',onPress:()=>{this.shutTransfer();this.props.handleBack()}}
          ]);
          }
        }
      >
        {this.props.showing==='upload'?
          <Upload statusText={this.state.statusText} />:
          <Download statusText={this.state.statusText} />
        }
      </Overlay>
    );
  }
}

const Upload = ({statusText})=>(
  <View style={{height:150}}>
    <Text style={{flex:1}}>Uploading...</Text>
    <ProgressBarAndroid styleAttr="Horizontal" />
    <View style={{flex:1}}>
      <Text style={{textAlign:'right',color:'black'}}>{statusText}</Text>
    </View>
  </View>
);

const Download = ({statusText})=>(
  <View style={{height:150}}>
    <Text style={{flex:1}}>Downloading...</Text>
    <ProgressBarAndroid styleAttr="Horizontal" color="#2196F3" />
    <View style={{flex:1}}>
      <Text style={{textAlign:'right',color:'black'}}>{statusText}</Text>
    </View>
  </View>
);