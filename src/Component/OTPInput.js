import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Alert,
    TouchableOpacity,
    StyleSheet,
    Keyboard,
} from 'react-native';

import FloatingLabelInputField from './FloatingLabelInputField'

const inputAccessoryViewID = 'OTPInput'

export default class OTPInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            codeDigOne: '',
            codeDigOneFocus: false,
            codeDigTwo: '',
            codeDigTwoFocus: false,
            codeDigThree: '',
            codeDigThreeFocus: false,
            codeDigFour: '',
            codeDigFourFocus: false,
        }
    }

    emptyOtp = () => {
        this.setState({
            codeDigOne: '',
            codeDigTwo: '',
            codeDigThree: '',
            codeDigFour: '',
        })
    }
     componentDidMount() {
        if (this.fieldCodeDigOne) this.fieldCodeDigOne.focus()
    }
    getCode = () => {
        const { codeDigOne, codeDigTwo, codeDigThree, codeDigFour} = this.state
        console.log("hddh",codeDigOne + codeDigTwo + codeDigThree + codeDigFour)
        return codeDigOne + codeDigTwo + codeDigThree + codeDigFour
       
    }

    render() {
        const { codeDigOne, codeDigTwo, codeDigThree, codeDigFour, codeDigOneFocus, codeDigTwoFocus, codeDigThreeFocus, codeDigFourFocus} = this.state

        return (
            <View style={{ flexDirection: 'row',justifyContent:"center"}}>
                <FloatingLabelInputField
                    fieldRef={ref => this.fieldCodeDigOne = ref}
                    hideLabel={true}
                    onParentPress={() => { if (this.fieldCodeDigOne) this.fieldCodeDigOne.focus() }}
                    value={codeDigOne}
                    inputContainer={{ width: "20%" }}
                    inputStyle={{ fontSize: 20, textAlign: 'center',fontWeight:"600"}}
                    autoCapitalize={'none'}
                    // placeholder={'*'}
                    // placeholderTextColor={"lightgrey"}
                    // caretHidden={true}
                    
                    keyboardType={'numeric'}
                    onChangeText={(text) => {
                        if (text.length <= 1) this.setState({ codeDigOne: text },()=>{
                            if (this.fieldCodeDigTwo) this.fieldCodeDigTwo.focus()
                        })
                    }}
                    onFocus={(event) => {
                        this.setState({ codeDigOne: '', codeDigTwo: '', codeDigThree: '', codeDigFour: '', codeDigOneFocus: true})
                    }}
                    onKeyPress={(event) => {
                        if (event.key == 'Backspace') {
                            this.setState({ codeDigOne: '' })
                        } else if (/^[0-9]/g.test(event.key)) {
                            // if (this.fieldCodeDigTwo) this.fieldCodeDigTwo.focus()
                        }
                    }}
                    inputAccessoryViewID={inputAccessoryViewID}
                />
                <FloatingLabelInputField
                    fieldRef={ref => this.fieldCodeDigTwo = ref}
                    onParentPress={() => { if (this.fieldCodeDigTwo) this.fieldCodeDigTwo.focus() }}
                    value={codeDigTwo}
                    hideLabel={true}
                    inputContainer={{ width: "20%" }}
                    inputStyle={{ fontSize: 20, textAlign: 'center',fontWeight:"600"}}
                    autoCapitalize={'none'}
                    // placeholder={'*'}
                    // placeholderTextColor={"lightgrey"}
                    // caretHidden={true}
                    keyboardType={'numeric'}
                    onChangeText={(text) => {
                        if (text.length < 2) this.setState({ codeDigTwo: text },()=>{
                            if (this.fieldCodeDigThree) this.fieldCodeDigThree.focus()
                        })
                    }}
                    onFocus={() => {
                        if (codeDigOne == '') if (this.fieldCodeDigOne) this.fieldCodeDigOne.focus()
                        this.setState({ codeDigTwo: '', codeDigThree: '', codeDigFour: ''})
                    }}
                    onKeyPress={(event) => {
                        if (event.key == 'Backspace') {
                            this.setState({ codeDigTwo: '' })
                            if (this.fieldCodeDigOne) this.fieldCodeDigOne.focus()
                        } else if (/^[0-9]/g.test(event.key)) {
                            // if (this.fieldCodeDigThree) this.fieldCodeDigThree.focus()
                        }
                    }}
                    inputAccessoryViewID={inputAccessoryViewID}
                />
                <FloatingLabelInputField
                    fieldRef={ref => this.fieldCodeDigThree = ref}
                    onParentPress={() => { if (this.fieldCodeDigThree) this.fieldCodeDigThree.focus() }}
                    value={codeDigThree}
                    hideLabel={true}
                    inputContainer={{ width: "20%",  }}
                    inputStyle={{ fontSize: 20, textAlign: 'center',fontWeight:"600" }}
                    autoCapitalize={'none'}
                    // placeholder={'*'}
                    // placeholderTextColor={"lightgrey"}
                    // caretHidden={true}
                    keyboardType={'numeric'}
                    onChangeText={(text) => {
                        if (text.length < 2) this.setState({ codeDigThree: text },()=>{
                            if (this.fieldCodeDigFour) this.fieldCodeDigFour.focus()
                        })
                    }}
                    onFocus={() => {
                        if (codeDigTwo == '') if (this.fieldCodeDigTwo) this.fieldCodeDigTwo.focus()
                        this.setState({ codeDigThree: '', codeDigFour: ''})
                    }}
                    onKeyPress={(event) => {
                        if (event.key == 'Backspace') {
                            this.setState({ codeDigThree: '' })
                            if (this.fieldCodeDigTwo) this.fieldCodeDigTwo.focus()
                        } else if (/^[0-9]/g.test(event.key)) {
                            // if (this.fieldCodeDigFour) this.fieldCodeDigFour.focus()
                        }
                    }}
                    inputAccessoryViewID={inputAccessoryViewID}
                />
                <FloatingLabelInputField
                    fieldRef={ref => this.fieldCodeDigFour = ref}
                    onParentPress={() => { if (this.fieldCodeDigFour) this.fieldCodeDigFour.focus() }}
                    value={codeDigFour}
                    hideLabel={true}
                    inputContainer={{ width: "20%" }}
                    inputStyle={{ fontSize: 20, textAlign: 'center',fontWeight:"600" }}
                    autoCapitalize={'none'}
                    // placeholder={'*'}
                    // placeholderTextColor={"lightgrey"}
                    // caretHidden={true}
                    keyboardType={'numeric'}
                    onChangeText={(text) => {
                        if (text.length < 2) this.setState({ codeDigFour: text },()=>{
                            // if (this.fieldCodeDigFive) this.fieldCodeDigFive.focus()
                            Keyboard.dismiss()
                        })
                    }}
                    onFocus={() => {
                        if (codeDigThree == '') if (this.fieldCodeDigThree) this.fieldCodeDigThree.focus()
                        this.setState({ codeDigFour: ''})
                    }}
                    onKeyPress={(event) => {
                        if (event.key == 'Backspace') {
                            this.setState({ codeDigFour: '' })
                            if (this.fieldCodeDigThree) this.fieldCodeDigThree.focus()
                        } else if (/^[0-9]/g.test(event.key)) {
                            // Keyboard.dismiss()
                        }
                    }}
                    inputAccessoryViewID={inputAccessoryViewID}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({

});

