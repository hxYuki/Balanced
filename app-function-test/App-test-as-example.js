/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, TextInput, Button, ToastAndroid} from 'react-native';
import Sqlite from './../app/lib/sqlite';

const databaseConfig={
  name:'testDB',
  // success:(act)=>{
  //   ToastAndroid.show(act+" success",ToastAndroid.SHORT);
  // },
  // failed:(act,err)=>{
  //   ToastAndroid.show(act+" failed",ToastAndroid.SHORT);
  //   ToastAndroid.show(JSON.stringify(err),ToastAndroid.LONG);
  // }
}
const tableConfig={
  name:"test",
  fields:{
    'ID':'INTEGER PRIMARY KEY AUTOINCREMENT',
    'name':'TEXT NOT NULL',
    'age':'INT NOT NULL',
  }
}


var db:Sqlite;
type Props = {};
export default class App extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      dataList: [],
      inputContent:"",
    };
  }
  componentDidMount(){
    this.connect();
    // ToastAndroid.show('hi',ToastAndroid.SHORT);
  }
  componentWillUnmount(){
    db.close();
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList style={styles.list}
          data={this.state.dataList}
          renderItem = {({item,index}) => (
            <View key={index} style={{height: 70}}> 
              <Text>{item.name}</Text>
              <Text>{item.age}</Text>
            </View>
          )} 
          keyExtractor={(item,index)=>(item.name)}
          />
        <View style={styles.rowContainer}>
          <TextInput style={styles.input} onChangeText={(text)=>{this.setState({inputContent:text})}}></TextInput>
          <Button style={styles.button} title="Confirm" onPress={()=>{this.deleteData()}}></Button>
        </View>
        <View>
          <Button title="new table" onPress={()=>{db.createTable(tableConfig)}}></Button>
          <Button title="drop table" onPress={()=>{db.dropTable(tableConfig.name)}}></Button>
          <Button title="insert data" onPress={()=>{this.insertData()}}></Button>
          <Button title="load data" onPress={()=>{this.queryData()}}></Button>
          <Button title="update data" onPress={()=>{this.updateData()}}></Button>
        </View>
      </View>
    );
  }

  connect(){
    db=new Sqlite(databaseConfig);
    // db.createTable(tableConfig);
    // db.dropTable();
  }

  insertData(){
    let d=[{name:"Tom",age:18},{name:"Jack",age:19}];
    d.forEach(v=>{db.in(tableConfig.name).insert(v);});
  }

  async queryData(){
    let data = await db.in(tableConfig.name).select();  

    this.setState({dataList:data});
  }

  deleteData(){
    db.in(tableConfig.name).where(`name='${this.state.inputContent}'`).delete();
  }

  updateData(){
    db.in(tableConfig.name).where('1').update({age:80});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowContainer:{
    height:50,
    flexDirection:"row",
  },
  list:{
    flex:1
  },
  input:{
    flex:1,
    // height:50,
    borderWidth:1,
    borderColor:'black',
  },
  button:{
    width:70
  },
});
