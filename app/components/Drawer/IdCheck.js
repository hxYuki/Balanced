import React,{Component} from 'react';
import { ProgressBarAndroid, View, Clipboard, ToastAndroid, TouchableOpacity, Text, TextInput, Alert, AsyncStorage, StyleSheet } from 'react-native';
import {Overlay, Button} from 'react-native-elements';


type Props = {
    closeModal:()=>{},
    isVisible:boolean
}
export default class CheckIdModal extends Component<Props>{
    constructor(props){
        super(props);
        this.state={
            id:'',
            input:''
        };
    }
    componentDidMount(){
        this.getId();
    }
    async getId(){
        let id = await AsyncStorage.getItem('uniqueId');
        this.setState({id:id});
    }
    async setId(){
        await AsyncStorage.setItem('uniqueId',this.state.input);
        ToastAndroid.show('Id is set!',ToastAndroid.SHORT);
        this.getId();
        this.state.input='';
        this.props.closeModal();
    }
    copyId(){
        Clipboard.setString(this.state.id);
        ToastAndroid.show('Id clipped!',ToastAndroid.SHORT);
    }
    render(){
        return (<Overlay isVisible={this.props.isVisible}
            height={230}
            onBackdropPress={() => { this.props.closeModal() }}>
            <View style={{alignItems:'center',flex:1}}>
                <Text style={{flex:1}}>Please save your ID properly, in case that you lose your accountings and can't restore it.</Text>
                <TouchableOpacity onPress={()=>{this.copyId()}}>
                    <Text>Your current ID:</Text>
                    <TextInput style={styles.InputStyle} value={this.state.id} editable={false} />
                </TouchableOpacity>
                <View>
                    <Text>Reset your ID as:</Text>
                    <TextInput style={styles.InputStyle} value={this.state.input} onChangeText={(text)=>{this.setState({input:text})}} placeholder={this.state.id} />
                </View>
                <View style={{width:200,flexDirection:'row',justifyContent:'space-around', marginTop:10}}>
                    <Button title='Cancel' type='outline' onPress={()=>{this.setState({input:''});this.props.closeModal();}} />
                    <Button title='Confirm' type='solid' onPress={()=>{this.setId()}}/>
                </View>
            </View>
        </Overlay>)
    }
}

const styles = StyleSheet.create({
    InputStyle: {
        borderWidth: 0.8,
        borderColor:'rgb(200,200,200)',
        borderRadius:3,
        width: 200,
        height: 40,
        textAlign: 'center'
    }
})