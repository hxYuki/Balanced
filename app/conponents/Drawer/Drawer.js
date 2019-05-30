import React, {Component} from 'react';
import {View,DrawerLayoutAndroid,StyleSheet,Text} from 'react-native';
import { Icon } from 'react-native-elements'

export default class Drawer extends Component{
  constructor(props){
    super(props);
    this.state={TotalDeposit:0,MainPageFlag:true};
    this.DrawerIn=this.DrawerIn.bind(this);
  }

  DrawerIn=()=>{
    return(
    <View style={{flex:1,justifyContent:'flex-start'}}>
      <View style={styles.NavigaterHead}><Text style={{fontSize:20,color:'white',fontWeight:'700'}}>Total Deposit : ￥</Text></View>
      <View style={styles.NavigateItem}>
        <Icon name = 'pie-chart' type = 'material' size={35} color='grey' />
        <Text style={{fontSize:20,marginLeft:20,fontWeight:'700'}}>Statistics</Text>
        <View  style={styles.right_arrow}>
          <Icon name = 'chevron-right' type = 'material' size={35} color='grey' />
        </View>
      </View>
      <View style={styles.NavigateItem}>
        <Icon name = 'backup' type = 'material' size={35} color='grey' / >
        <Text style={{fontSize:20,marginLeft:20,fontWeight:'700'}}>Cloud Backup</Text>
        <View  style={styles.right_arrow}>
          <Icon name = 'chevron-right' type = 'material' size={35} color='grey' />
        </View>
      </View>
      <View style={styles.NavigateItem}>
        <Icon name = 'cloud-download' type = 'material' size={35} color='grey' / >
        <Text style={{fontSize:20,marginLeft:20,fontWeight:'700'}}>Restore</Text>
        <View  style={styles.right_arrow}>
          <Icon name = 'chevron-right' type = 'material' size={35} color='grey' />
        </View>
      </View>
    </View>
  )};

  openDrawer() {
    this.refs.drawerLayout.openDrawer();
  }

  render(){
    return(
      <DrawerLayoutAndroid 
        refs={'drawerLayout'}
        drawerWidth={300}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={this.DrawerIn}
        >
        <View style={styles.container}>
          <Text style={styles.welcome}>Welcome to React Native!</Text>
          <Text style={styles.instructions}>To get started, edit App.js</Text>
        </View>
      </DrawerLayoutAndroid>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  NavigaterHead : {
    backgroundColor: '#2089dc',
    height:100,
    justifyContent: 'center',
    paddingLeft:10,
  },
  NavigateItem : {
    height:60,
    flexDirection:'row',
    alignItems:'center',
    paddingLeft:20,
  },
  right_arrow : {
    position:'absolute',
    right:20,
  },
});