import React, { Component, useState } from 'react';

import {  StyleSheet, View, Text, Modal,  TouchableOpacity,} from 'react-native';
import commonStyles from "../Themes/commonStyles";
import { useSelector } from "react-redux";


const AlertModal = (props) => {

  const [Alert_Visibility, setAlertVisibility] = useState(props.showAlert)
  const state = useSelector(state => state)
  const Show_Custom_Alert = (visible) => {

    setAlertVisibility(visible)

  }
  return (
    <Modal
      visible={props.showAlert}
      transparent={true}
      animationType={"fade"}
      onRequestClose={() => { Show_Custom_Alert(!Alert_Visibility) }} >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
        <View style={[styles.Alert_Main_View, commonStyles.shadowStyle]}>
          <Text style={styles.Alert_Title}>{props.header}</Text>
          <View style={{ width: '100%', height: 2, backgroundColor: '#fff' }} />
          <Text style={styles.Alert_Message}>{props.body}</Text>
          <View style={{ width: '100%', height: 1, backgroundColor: '#fff' }} />
          <View style={{ flexDirection: 'row', height: '30%' }}>
            <TouchableOpacity
              style={[styles.buttonStyle,{backgroundColor:state.themeChangeReducer.primaryColor}]}
              onPress={props.ok_Button}
              activeOpacity={0.7}
            >
              <Text style={styles.TextStyle}> OK </Text>
            </TouchableOpacity>
            <View style={{ width: 1, height: '100%', backgroundColor: '#fff' }} />
          </View>
        </View>
      </View>
    </Modal>

  );
}
export default AlertModal;
const styles = StyleSheet.create({
  Alert_Main_View: {

    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "white",
    height: 200,
    width: '90%',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 7,

  },

  Alert_Title: {

    fontSize: 25,
    color: "black",
    textAlign: 'center',
    padding: 10,
    height: '28%'

  },

  Alert_Message: {

    fontSize: 14,
    color: "black",
    textAlign: 'center',
    padding: 10,
    height: '30%'

  },

  buttonStyle: {

    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#90EE90",
    borderRadius: 10

  },

  TextStyle: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 22,
    marginTop: -5
  }

});