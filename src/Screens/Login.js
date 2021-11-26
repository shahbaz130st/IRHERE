import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform, SafeAreaView } from "react-native";
import { colors } from "../Themes/colors";
import InputField from "../Component/InputField";
import Button from "../Component/Button";
import commonStyles from "../Themes/commonStyles";
import { images } from "../Assets/Images";
import { reg } from "../Utils/ValidationConstants";
import constant from "../Utils/ApiConstants";
import { AlertComponent } from "../Utils/Alert";
import Loader from "../Utils/Loader";
import CustomCheckBox from "../Component/CustomCheckBox";
import axios from "axios";

import { StackActions } from "@react-navigation/native";
import { phoneScreen } from "../Themes/phoneScreen";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import Preference from 'react-native-preference';
import AlertModal from "../Utils/AlertModal";
import messaging from '@react-native-firebase/messaging';

const modeSelection = StackActions.replace("ModeSelection")
const mainApp = StackActions.replace("TabGroup")
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../Store/ActionsCreator";
import Header from "../Component/Header";
import { StatusBarHeight, HeaderHeight } from '../Utils/Dimensions';
import Toast from 'react-native-toast-message';
const Login = (props) => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const state = useSelector(state => state)
  const [checkBox, setCheckBox] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertHeader, setAlertHeader] = useState("")
  const [alertBody, setAlertBody] = useState("")

  useEffect(() => {
    onAppBootstrap()
  }, [])
  const onAppBootstrap = async () => {
    // Register the device with FCM
    // await messaging().registerDeviceForRemoteMessages();
    // Get the token
    const token = await messaging().getToken();
    // Save the token
    console.log("loginscreenfcmToken", "_---------------------------------->" + token);
    Preference.set("fcmToken", token)
    // await AsyncStorage.setItem('fcmToken', token);
    //await postToApi('/users/1234/tokens', { token });
  }
  const loginValidation = () => {
    if (email === "") {
      // showToast()
       AlertComponent({msg:"Email is required",title:"Error",type:"error"})
    }
    else if (reg.test(email) == false) {
      AlertComponent({ msg: "Email is invalid",type:"error" })
    }
    else if (password == "") {
      AlertComponent({ msg: "Password is required",type:"error",title:"Error" })
    }
    else if (password.length <= 7) {
      AlertComponent({ msg: "Password must be 8 characters",type:"error",title:"Error" })
    }
    else {
      Login_Auth();
    }
  }
  const Login_Auth = () => {
    setLoading(true)
    var config = {
      headers: {
        "Content-Type": "multipart/form-data"
      },
    };
    const data = new FormData();
    data.append('email', email);
    data.append('password', password);
    data.append("device_id", Preference.get("fcmToken"))
    console.log(constant.signin, data)
    axios
      .post(constant.signin, data, config)
      .then(function (response) {
        console.log(response.data)
        setLoading(false)
        if (response.data.code === "1") {
          dispatch(signIn({ userData: response.data, isLogin: true }))
          Preference.set("isLogin", "done")
          check_mode(response.data.id)
        }
        else {
          // setShowAlert(true)
          // setAlertHeader("Error")
          // setAlertBody(response.data.desc)
          AlertComponent({ msg: response.data.desc,type:"error",title:"Error" })
        }
      })
      .catch(function (error) {
        console.log(error)
        setLoading(false)
        AlertComponent({ msg: error.message,type:"error",title:"Error" })
      });
  }
  const check_mode = (id) => {
    setLoading(true)
    var config = {
      headers: {
        "Content-Type": "multipart/form-data"
      },
    };
    const data = new FormData();
    data.append('user_id', id);
    console.log(constant.check_mode_status, data)
    axios
      .post(constant.check_mode_status, data, config)
      .then(function (response) {
        console.log(response.data)
        setLoading(false)
        if (response.data.code === "1") {
          if (response.data.user_mode === "1" && response.data.is_mode_active === "1") {
            Preference.set("mode", "quarantine")
            Preference.set("CompleteQuestionaire", "done")
            props.navigation.dispatch(mainApp)
          }
          else if (response.data.user_mode === "1") {
            // props.navigation.dispatch(modeSelection)
            Preference.set("mode", "quarantine")
            props.navigation.dispatch(modeSelection)
          }
          else {
            Preference.set("mode", "general")
            props.navigation.dispatch(mainApp)
          }
        }
        else if (response.data.code === "0" && response.data.desc === "User mode not created yet.") {
          mode_Selection(1, id)
          // Preference.set("mode", "notSet")
          // props.navigation.dispatch(modeSelection)
        }
        else {
          // setShowAlert(true)
          // setAlertHeader("Error")
          // setAlertBody(response.data.desc)
          AlertComponent({ title:"Error",msg: response.data.desc ,type:"error",title:"Error"})
        }
      })
      .catch(function (error) {
        setLoading(false)
        AlertComponent({ msg: error.message,type:"error",title:"Error" })
      });
  }

  const mode_Selection = (mode, id) => {
    setLoading(true)
    var config = {
      headers: {
        "Content-Type": "multipart/form-data"
      },
    };
    const data = new FormData();
    data.append('user_id', id);
    data.append('mode_code', mode);
    console.log(constant.set_user_mode, data)
    axios
      .post(constant.set_user_mode, data, config)
      .then(function (response) {
        console.log(response.data)
        setLoading(false)
        if (response.data.code === "1") {
          Preference.set("mode", "quarantine")
          props.navigation.dispatch(modeSelection)
          // setMode("quarantine")
        }
        else {
          // setShowAlert(true)
          // setAlertHeader("Error")
          // setAlertBody(response.data.desc)
          AlertComponent({ msg: response.data.desc,type:"error",title:"Error" })
        }
      })
      .catch(function (error) {
        setLoading(false)
        AlertComponent({ msg: error.message,type:"error",title:"Error" })
      });
  }
  return (
    <View style={[commonStyles.mainViewStyle, { backgroundColor: state.themeChangeReducer.secondaryColor }]}>
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} >
        <Header
          leftIcon={images.unboldIcon}
          backIconPress={() => { props.navigation.goBack() }}
          headerText={"Login"} />

        <View style={[commonStyles.innerViewStyle, { backgroundColor: state.themeChangeReducer.secondaryColor }]} >
          <InputField
            placeholder={"Email"}
            placeholderTextColor={colors.placeholderColor}
            containerStyle={commonStyles.inputContainerStyle}
            inputStyle={commonStyles.inputInnerStyle}
            onChangeText={(text) => setEmail(text)}
            keyboardType={"email-address"}
            autoComplete={"email"}
            value={email}
            onEndEditing={() => setEmail(email.trim())}
          />
          <InputField
            placeholder={"Password"}
            autoComplete={"password"}
            placeholderTextColor={colors.placeholderColor}
            containerStyle={[commonStyles.inputContainerStyle, { marginTop: 18 }]}
            inputStyle={commonStyles.passwordInputinnerStyle}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            value={password}
          />

          <TouchableOpacity style={{ marginVertical: 18 }} onPress={props.onResetPress}>
            <Text style={{ color: state.themeChangeReducer.primaryColor, fontSize: 16, fontWeight: "400" }} >{"Forgot password? "}</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <Button
            buttonStyle={[commonStyles.buttonStyle, { backgroundColor: state.themeChangeReducer.primaryColor }]}
            textStyle={commonStyles.textStyle}
            text={"Log In"}
            onPress={()=>{
              loginValidation() }}
          />
          <View style={{ alignItems: "center", width: "100%" }}>
            <TouchableOpacity style={{ marginTop: 34 }} onPress={() => { props.navigation.navigate("Register") }}>
              <Text style={{ color: state.themeChangeReducer.primaryColor, fontSize: 16, fontWeight: "500" }} >{"Create an Account"}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {
          showAlert &&
          <AlertModal
            showAlert={showAlert}
            ok_Button={() => { setShowAlert(false) }}
            header={alertHeader}
            body={alertBody}
          />
        }
        <Loader visible={loading} />
      </KeyboardAwareScrollView>
    </View>
  )
}
export default Login;

const styles = StyleSheet.create(
  {
    mainViewStyle: {
      flex: 1
    },
    innerViewStyle1: {
      height: phoneScreen.height * 20 / 100,
      backgroundColor: colors.primaryColor,
      alignItems: "center",
      justifyContent: "space-evenly"
    },
    imageStyle: {
      resizeMode: "contain",
      height: "40%",
    },
    headingStyle: {
      fontSize: 24,
      fontWeight: "700",
      fontStyle: "normal",
    },
    innerViewStyle2: {
      height: phoneScreen.height - HeaderHeight,
      paddingBottom: 50,
      padding: 30
    }
  }
)