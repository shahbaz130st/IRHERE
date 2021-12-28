import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, PermissionsAndroid } from "react-native";
import { colors } from "../Themes/colors";
import InputField from "../Component/InputField";
import ModalOpenField from "../Component/modalOpenField";
import Button from "../Component/Button";
import commonStyles from "../Themes/commonStyles";
import { images } from "../Assets/Images";
import { reg } from "../Utils/ValidationConstants";
import constant from "../Utils/ApiConstants";
import Header from "../Component/Header";
import { AlertComponent } from "../Utils/Alert";
import Loader from "../Utils/Loader";
import CustomCheckBox from "../Component/CustomCheckBox";
import axios from "axios";
import { StackActions } from "@react-navigation/native";
import { phoneScreen } from "../Themes/phoneScreen";
import BottomSheet from "../Component/BottomSheet";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import {
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';
import AlertModal from "../Utils/AlertModal";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../Store/ActionsCreator";
import CustomModal from "../Component/CustomModal";
import { PERMISSIONS, check, request, RESULTS } from 'react-native-permissions';
import CustomRadioButtonBottomSheet from "../Component/CustomRadioButtonBottomSheet";
import messaging from '@react-native-firebase/messaging';
import Preference from 'react-native-preference';

const modeSelection = StackActions.replace("ModeSelection")
const mainApp = StackActions.replace("TabGroup")

const Register = (props) => {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [number, setNumber] = useState("")
  const [verification, setVerification] = useState("")
  const [verificationNumber, setverificationNumber] = useState(-1)
  const [loading, setLoading] = useState(false)
  const [checkBox, setCheckBox] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [listOfItems, setListOfItems] = useState([{ name: "Passport", number: 3, isChecked: false }, { name: "Photo ID", number: 1, isChecked: false }, { name: "Driver’s License", number: 2, isChecked: false },])
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [filePath, setFilePath] = useState(null);
  const [showAlert, setShowAlert] = useState(false)
  const [alertHeader, setAlertHeader] = useState("")
  const [alertBody, setAlertBody] = useState("")
  const [showRadioBottomSheet, setShowRadioBottomSheet] = useState(false)

  const dispatch = useDispatch()
  const state = useSelector(state => state)
  useEffect(() => {
    if (props.route.params?.img) {
      console.log(props.route.params?.img)
      setFilePath(props.route.params?.img)
      // Post updated, do something with `route.params.post`
      // For example, send the post to the server
    }
  }, [props.route.params?.img]);
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

  const validation = () => {
    console.log(number.length)
    if (fullName === "") {
      AlertComponent({ msg: "Full name is required", title: "Error", type: "error" })
    }
    else if(email === ""&&number.length == ""){
      AlertComponent({ msg: "Email or Mobile number is required", title: "Error", type: "error" })
    }
    else if (reg.test(email) == false&&number.length == "") {
      AlertComponent({ msg: "Email is invalid", title: "Error", type: "error" })
    }
    else if (password == "") {
      AlertComponent({ msg: "Password is required", title: "Error", type: "error" })
    }
    else if (password.length <= 7) {
      AlertComponent({ msg: "Password must be 8 characters", title: "Error", type: "error" })
    }
    // else if (number.length == "") {
    //   AlertComponent({ msg: "Mobile number is required", title: "Error", type: "error" })
    // }
    else if (!number==""&& number.length <= 8) {
      AlertComponent({ msg: "Mobile number is invalid", title: "Error", type: "error"})
    }
    else if (verificationNumber === -1) {
      AlertComponent({ msg: "Select verification type", title: "Error", type: "error" })
    }
    else if (!filePath) {
      AlertComponent({ msg: "Select image for verficiation", title: "Error", type: "error" })
    }
    else {
      register()
    }
  }
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      const res = await check(PERMISSIONS.IOS.CAMERA);

      if (res === RESULTS.GRANTED) {
        console.log('You can use camera');
        return res === RESULTS.GRANTED;

      } else if (res === RESULTS.DENIED) {
        const res2 = await request(PERMISSIONS.IOS.CAMERA);
        return res2 === RESULTS.GRANTED;
      }
    }
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    }
    else return true;
  };

  const captureImage = async (type) => {
    let options = {
      mediaType: type
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, (response) => {
        console.log('Response = ', response);

        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        // setAvatar(response.assets[0].uri)
        setFilePath({ uri: response.assets[0].uri, type: 'image/jpeg', name: response.assets[0].fileName });
      });
    }
  };

  const chooseFile = (type) => {

    let options = {
      mediaType: type,
    };
    launchImageLibrary(options, (response) => {

      console.log('Response = ', response);

      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      setFilePath({ uri: response.assets[0].uri, type: 'image/jpeg', name: response.assets[0].fileName });
    });

  };
  const register = () => {
    setLoading(true)
    var config = {
      headers: {
        // "Content-Type": "multipart/form-data"
      },
    };
    const data = new FormData();
    data.append('full_name', fullName);
    data.append('email', email);
    data.append('password', password);
    if(number!==""&&!number.length <= 8){
      data.append('phone_no', "+61" + number);
    }
    else{
      data.append('phone_no', "");
    }
    
    data.append('verification_method', verificationNumber);
    data.append('file', filePath);
    data.append("device_id", Preference.get("fcmToken"))
    console.log(constant.registration, data)
    axios
      .post(constant.registration, data, config)
      .then(function (response) {
        setLoading(false)
        console.log(response.data)
        setLoading(false)
        if (response.data.code === "1") {
          dispatch(signIn({ userData: response.data, isLogin: true }))
          Preference.set("isLogin", "done")
          check_mode(response.data.id)
        }
        else {
          AlertComponent({ msg: response.data.desc, title: "Error", type: "error" })
          // setFilePath(null)
          // setShowAlert(true)
          // setAlertHeader("Error")
          // setAlertBody(response.data.desc)

        }
      })
      .catch(function (error) {
        setLoading(false)
        console.log(error)
        AlertComponent({ msg: error.message, title: "Error", type: "error" })
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
      <Header
        leftIcon={images.unboldIcon}
        backIconPress={() => { props.navigation.goBack() }}
        headerText={"Create an Account"} />
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} >
        <View style={[commonStyles.innerViewStyle, { backgroundColor: state.themeChangeReducer.secondaryColor }]} >
          <InputField
            placeholder={"Full Name"}
            autoComplete={"name"}
            placeholderTextColor={colors.placeholderColor}
            containerStyle={{
              flex: 1, backgroundColor: colors.whiteColor,
              width: "100%",
              borderRadius: phoneScreen.height * 1 / 100,
              paddingHorizontal: 15,
              borderColor: colors.greyColor,
              borderWidth: 2,
              flexDirection: "row",
            }/* commonStyles.inputContainerStyle */}
            inputStyle={commonStyles.inputInnerStyle}
            onChangeText={(text) => setFullName(text)}
            value={fullName}
          />
          <InputField
            placeholder={"Email"}
            autoComplete={"email"}
            placeholderTextColor={colors.placeholderColor}
            // containerStyle={[commonStyles.inputContainerStyle, { marginTop: 18 }]}
            containerStyle={{
              flex: 1, backgroundColor: colors.whiteColor,
              width: "100%",
              borderRadius: phoneScreen.height * 1 / 100,
              paddingHorizontal: 15,
              borderColor: colors.greyColor,
              borderWidth: 2,
              flexDirection: "row",
              marginTop: 12
            }/* commonStyles.inputContainerStyle */}
            inputStyle={commonStyles.inputInnerStyle}
            onChangeText={(text) => setEmail(text)}
            keyboardType={"email-address"}
            value={email}
            onEndEditing={() => setEmail(email.trim())}
          />
          <InputField
            placeholder={"Password"}
            autoComplete={"password"}
            placeholderTextColor={colors.placeholderColor}
            // containerStyle={[commonStyles.inputContainerStyle, { marginTop: 18 }]}
            containerStyle={{
              flex: 1, backgroundColor: colors.whiteColor,
              width: "100%",
              borderRadius: phoneScreen.height * 1 / 100,
              paddingHorizontal: 15,
              borderColor: colors.greyColor,
              borderWidth: 2,
              flexDirection: "row",
              marginTop: 12
            }/* commonStyles.inputContainerStyle */}
            inputStyle={commonStyles.passwordInputinnerStyle}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
          <InputField
            placeholder={"Mobile Number"}
            placeholderTextColor={colors.placeholderColor}
            // containerStyle={[commonStyles.inputContainerStyle, { marginTop: 18, flexDirection: "row", alignItems: "center" }]}
            containerStyle={{
              flex: 1, backgroundColor: colors.whiteColor,
              width: "100%",
              borderRadius: phoneScreen.height * 1 / 100,
              paddingHorizontal: 15,
              borderColor: colors.greyColor,
              borderWidth: 2,
              flexDirection: "row", marginTop: 12
            }/* commonStyles.inputContainerStyle */}
            inputStyle={commonStyles.mobileInputInnerStyle}
            onChangeText={(text) => setNumber(text)}
            keyboardType={"phone-pad"}
            autoComplete={"tel"}
            value={number}
            maxLength={10}
            image={images.auFlag}
            imageStyle={{ width: 21, height: 13, resizeMode: "contain" }}
            imageViewStyle={commonStyles.mobileFlagStyle}
            countryCode={"+61"}
            countryCodeStyle={{ fontSize: 16, color: colors.blackTextColor, fontWeight: "400" }}
            textViewStyle={commonStyles.mobileCountryCodeStyle}
          />
          <ModalOpenField
            containerStyle={{
              flex: 1, backgroundColor: colors.whiteColor,
              width: "100%",
              borderRadius: phoneScreen.height * 1 / 100,
              paddingHorizontal: 15,
              borderColor: colors.greyColor,
              borderWidth: 2,
              flexDirection: "row", marginTop: 12
            }}
            textViewStyle={commonStyles.selectionInputTextStyle}
            value={verification === "" ? "Verification Document" : verification}
            valueStyle={{ fontSize: 16, color: colors.placeholderColor, fontWeight: "400" }}
            rightImage={images.bottomArrowIcon}
            rightImageViewStyle={commonStyles.selectionRightArrowView}
            rightImageStyle={commonStyles.selectionRightArrow}
            onPress={() => { setShowRadioBottomSheet(true)/* setShowPicker(true) */ }}
          />
          <TouchableOpacity style={{ flex: 1, marginVertical: 18 }} onPress={props.onResetPress}>
            <Text style={{ color: state.themeChangeReducer.primaryColor, fontSize: 16, fontWeight: "400" }} >{"Why do I need a verification Document?"}</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1, width: "100%" }}>
            <Text style={{ color: colors.placeholderColor, fontSize: 14, fontWeight: "400" }} >{"By signing up, you agree to our "}<Text style={{ textDecorationLine: "underline", color: colors.placeholderColor, fontSize: 14, fontWeight: "400" }}>{"Terms of use"}</Text>{" as well as our "}<Text style={{ textDecorationLine: "underline", color: colors.placeholderColor, fontSize: 14, fontWeight: "400" }}>{"Privacy"}</Text>{" , and "}<Text style={{ textDecorationLine: "underline", color: colors.placeholderColor, fontSize: 14, fontWeight: "400" }}>{"Cookies policies"}</Text></Text>
          </View>
          <Button
            buttonStyle={[commonStyles.buttonStyle, { flex: 1, backgroundColor: state.themeChangeReducer.primaryColor, marginTop: 18 }]}
            textStyle={commonStyles.textStyle}
            text={"Sign Up"}
            onPress={() => { validation() }}
          />
          <View style={{ alignItems: "center", width: "100%" }}>
            <TouchableOpacity style={{ marginTop: 34 }} onPress={() => { props.navigation.navigate("Login") }}>
              <Text style={{ color: state.themeChangeReducer.primaryColor, fontSize: 16, fontWeight: "500" }} >{"Login Instead"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {imageModalVisible && (
          <BottomSheet
            visible={imageModalVisible}
            customHeaderText={verification}
            backIconPress={() => {
              setImageModalVisible(false)
              setShowRadioBottomSheet(true)
            }}
            onDragDown={() => setImageModalVisible(false)}
            fromCamera={() => {
              setImageModalVisible(false);
              props.navigation.navigate("SecureIdVerification",{type:verification})
              // captureImage("photo");
            }}
            fromGallery={() => {
              setImageModalVisible(false);
              setTimeout(() => {
                chooseFile("photo");
              }, 500)
            }}
          />
        )}
        {
          showAlert &&
          <AlertModal
            showAlert={showAlert}
            ok_Button={() => { setShowAlert(false) }}
            header={alertHeader}
            body={alertBody}
          />
        }
      
      </KeyboardAwareScrollView>
      {
        showRadioBottomSheet &&
        <CustomRadioButtonBottomSheet
          visible={showRadioBottomSheet}
          listOfItems={listOfItems}
          headerText={"Verification Document"}
          onDragDown={() => setShowRadioBottomSheet(false)}
          subHeaderText={"Choose one"}
          ItemSeparatorComponent={() =>
            <View
              style={{
                height: 1,
                backgroundColor: colors.lightGreyColor
              }}
            />
          }
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", height: 48, alignItems: "center" }}
                onPress={() => {
                  let tempArray = listOfItems
                  for (let i = 0; i < tempArray.length; i++) {
                    if (i === index) {
                      tempArray[i].isChecked = true
                      setVerification(tempArray[i].name)
                      setverificationNumber(tempArray[i].number)
                    }
                    else {
                      tempArray[i].isChecked = false
                    }
                  }
                  setListOfItems([...tempArray])
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "400", color: colors.blackTextColor }}>{item.name}</Text>
                <View style={{ borderColor: item.isChecked ? state.themeChangeReducer.primaryColor : "#CDCFD0", backgroundColor: item.isChecked ? state.themeChangeReducer.primaryColor : colors.whiteColor, width: 24, height: 24, borderWidth: 1, borderRadius: 12, alignItems: "center", justifyContent: "center" }}>
                  <View style={{ height: 8, width: 8, backgroundColor: colors.whiteColor, borderRadius: 4 }}></View>
                </View>
              </TouchableOpacity>
            );
          }}
          onSelectPress={() => {
            if (verification === "") {
              AlertComponent({ msg: "Please select one option" })
            }
            else {
              setShowRadioBottomSheet(false)
              console.log(verification)
              setImageModalVisible(true)
            }
          }}
        />
      }
        <Loader visible={loading} />
    </View> 
  )
}
export default Register;

const styles = StyleSheet.create(
  {
    mainViewStyle: {
      flex: 1,
      backgroundColor: "white"
    },
    innerViewStyle1: {
      height: phoneScreen.height * 20 / 100,
      backgroundColor: colors.primaryColor,
      alignItems: "center",
      justifyContent: "space-evenly",
      paddingBottom: 30
    },
    innerStyle1: {
      height: phoneScreen.height * 24 / 100,
      backgroundColor: colors.primaryColor,
      flexDirection: "row",
      paddingTop: 40
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
      height: phoneScreen.height * 80 / 100 + 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 30,
      paddingTop: 30
    },
    leftArrowIconStyle: {
      height: 33,
      width: 33,
      borderWidth: 1,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center"
    }
  }
)