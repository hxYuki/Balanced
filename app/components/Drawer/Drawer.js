import React, { Component } from 'react';
import { View, DrawerLayoutAndroid, StyleSheet, Text, TouchableOpacity, TouchableNativeFeedback, BackHandler } from 'react-native';
import { Icon } from 'react-native-elements'

import Main from '../MainPage/Main';
import Statistics from '../Statistics/Statistics';
import Cycles from '../Cycyles/Cycles';
import UpDownModal from './Up-Download';
import CheckIdModal from './IdCheck';
import Sqlite from '../../lib/sqlite';
import ThemeConfig from '../../config/ThemeConfig';

type Props = {
  db: Sqlite
}
export default class Drawer extends Component<Props>{
  constructor(props) {
    super(props);
    this.state = { 
      TotalDeposit: 0,
      ShowPageFlag: 'MainPage',
      showingOverlay: 'none',
      checkingId:false,
      refresh:null
    };
    this.DrawerIn = this.DrawerIn.bind(this);
  }

  DrawerIn = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'flex-start' }}>
        <View style={styles.NavigaterHead}><Text style={{ fontSize: 20, color: 'white', fontWeight: '700' }}>Total Deposit: ￥{this.state.TotalDeposit}</Text></View>
        {
          this.state.ShowPageFlag=='MainPage'?
          (
            <View style={[styles.NavigateItem,{backgroundColor:'rgb(238,238,238)'}]}>
              <Icon name='home' type='material' size={35} color={ThemeConfig.themeMainColor} />
              <Text style={[styles.DrawerItemText,{color:ThemeConfig.themeMainColor,fontWeight:'500'}]}>MainPage</Text>
              {/* <View style={styles.right_arrow}>
                <Icon name='chevron-right' type='material' size={35} color='grey' />
              </View> */}
            </View>
          ):
          (
            <TouchableNativeFeedback style={styles.NavigateItem} onPress={() => this._ChangePage(1)}>
              <View style={styles.NavigateItem}>
                <Icon name='home' type='material' size={35} color='grey' />
                <Text style={styles.DrawerItemText}>MainPage</Text>
                <View style={styles.right_arrow}>
                  <Icon name='chevron-right' type='material' size={35} color='grey' />
                </View>
              </View>
            </TouchableNativeFeedback>
          )
        }
        {
          this.state.ShowPageFlag=='Statistics'?
          (
            <View style={[styles.NavigateItem,{backgroundColor:'rgb(238,238,238)'}]}>
              <Icon name='pie-chart' type='material' size={35} color={ThemeConfig.themeMainColor} />
              <Text style={[styles.DrawerItemText,{color:ThemeConfig.themeMainColor,fontWeight:'500'}]}>Statistics</Text>
              {/* <View style={styles.right_arrow}>
                <Icon name='chevron-right' type='material' size={35} color='grey' />
              </View> */}
            </View>
          ):
          (
            <TouchableNativeFeedback style={styles.NavigateItem} onPress={() => this._ChangePage(2)}>
              <View style={styles.NavigateItem}>
                <Icon name='pie-chart' type='material' size={35} color='grey' />
                <Text style={styles.DrawerItemText}>Statistics</Text>
                <View style={styles.right_arrow}>
                  <Icon name='chevron-right' type='material' size={35} color='grey' />
                </View>
              </View>
            </TouchableNativeFeedback>
          )
        }
        {
          this.state.ShowPageFlag=='Cycles'?
          (
            <View style={[styles.NavigateItem,{backgroundColor:'rgb(238,238,238)'}]}>{/* TODO: Link Cycles page */}
              <Icon name='autorenew' type='material' size={35} color={ThemeConfig.themeMainColor} />
              <Text style={[styles.DrawerItemText,{color:ThemeConfig.themeMainColor,fontWeight:'500'}]}>Cycles</Text>
              {/* <View style={styles.right_arrow}>
                <Icon name='chevron-right' type='material' size={35} color='grey' />
              </View> */}
            </View>
          ):
          (
            <TouchableNativeFeedback style={styles.NavigateItem} onPress={() => this._ChangePage(3)}>{/* TODO: Link Cycles page */}
              <View style={styles.NavigateItem}>
                <Icon name='autorenew' type='material' size={35} color='grey' />
                <Text style={styles.DrawerItemText}>Cycles</Text>
                <View style={styles.right_arrow}>
                  <Icon name='chevron-right' type='material' size={35} color='grey' />
                </View>
              </View>
            </TouchableNativeFeedback>
          )
        }
        <TouchableNativeFeedback style={styles.NavigateItem} onPress={()=>{this.setState({showingOverlay:'upload'})}}>
          <View style={styles.NavigateItem}>
            <Icon name='backup' type='material' size={35} color='grey' />
            <Text style={styles.DrawerItemText}>Cloud Backup</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback style={styles.NavigateItem} onPress={()=>{this.setState({showingOverlay:'download'})}}>
          <View style={styles.NavigateItem}>
            <Icon name='cloud-download' type='material' size={35} color='grey' />
            <Text style={styles.DrawerItemText}>Restore</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback style={styles.NavigateItem} onPress={()=>{this.setState({checkingId:true})}} >
          <View style={styles.NavigateItem}>
            <Icon name='error-outline' type='material' size={35} color='grey' />
            <Text style={styles.DrawerItemText}>Check ID</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  };

  openDrawer() {
    this.refs.drawerLayout.openDrawer();
  }

  closeDrawer() {
    this.refs.drawerLayout.closeDrawer()
  }

  _ChangePage = (id) => {
    if(id==1){
      this.setState({
        ShowPageFlag: "MainPage"
      });
    }
    else if(id==2){
      this.setState({
        ShowPageFlag: "Statistics"
      });
    }
    else{
      this.setState({
        ShowPageFlag: "Cycles"
      })
    }
    this.closeDrawer();
  }

  closeModal(){
    if(this.state.showingOverlay!=='none')
      this.setState({showingOverlay:'none'});
  }
  render() {
    return (
      <DrawerLayoutAndroid
        ref={'drawerLayout'}
        drawerWidth={300}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={this.DrawerIn}
      >
        <CheckIdModal isVisible={this.state.checkingId} closeModal={()=>{this.setState({checkingId:false})}} />
        <UpDownModal showing={this.state.showingOverlay} handleBack={()=>{this.closeModal()}} db={this.props.db} refreshMain={this.state.refresh} />
        <Main style={this.state.ShowPageFlag!=='MainPage'?{display:'none'}:{}} db={this.props.db} setTotalDeposit={(totalDeposit) => { this.setState({ TotalDeposit: totalDeposit }) }} openDrawerCB={()=>{this.openDrawer()}} exportRefresh={(ptr)=>{this.setState({refresh:ptr})}} />
        <Statistics style={this.state.ShowPageFlag!=='Statistics'?{display:'none'}:{}} db={this.props.db} openDrawerCB={()=>{this.openDrawer()}} />
        <Cycles style={this.state.ShowPageFlag!=='Cycles'?{display:'none'}:{}} db={this.props.db} openDrawerCB={()=>{this.openDrawer()}} />
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
  NavigaterHead: {
    backgroundColor: '#2089dc',
    height: 100,
    justifyContent: 'center',
    paddingLeft: 10,
    marginBottom:30,
  },
  NavigateItem: {
    height:60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
  },
  right_arrow: {
    // position: 'absolute',
    // right: 5,
  },
  DrawerItemText:{
    fontSize: 20, 
    marginLeft: 20, 
    flex:1,
    fontWeight: '400' }
});