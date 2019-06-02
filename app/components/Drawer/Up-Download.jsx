import React,{Component} from 'react';
import { ProgressBarAndroid, View, BackHandler, Alert } from 'react-native';
import {Overlay} from 'react-native-elements';
import Sqlite from '../../lib/sqlite';

type Props = {
  showing:string,
  handleBack:()=>{},
  db:Sqlite
};
enum TransStatus{done='done',uploading='uploading',downloading='downloading'};
var db:Sqlite;
export default class UpDownModal extends Component<Props>{
  constructor(props){
    super(props);
    this.state={
      transfering:TransStatus.done
    }
    db=this.props.db;
  }
  
  render(){
    return (
      <Overlay isVisible={this.props.showing!=='none'}
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
        {this.props.showing==='upload'?<Upload />:<Download />}
      </Overlay>
    );
  }
}

const Upload = ()=>(
  <View>
    <ProgressBarAndroid styleAttr="Horizontal" />
  </View>
);

const Download = ()=>(
  <View>
    <ProgressBarAndroid styleAttr="Horizontal" color="#2196F3" />
  </View>
);