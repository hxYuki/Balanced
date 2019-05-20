import React, {Component} from 'react';
import {DrawerLayoutAndroid} from 'react-native';
import {} from 'react-native-elements';


const DrawerIn=()=>(

);

export default class Drawer extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <DrawerLayoutAndroid 
        drawerWidth="300"
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={DrawerIn}
        >

      </DrawerLayoutAndroid>
    );
  }
}