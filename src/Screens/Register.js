import React, { useState } from "react";
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
const mainApp = StackActions.replace("DrawerGroup")
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../Store/ActionsCreator";
import CustomModal from "../Component/CustomModal";
import { PERMISSIONS, check, request, RESULTS } from 'react-native-permissions';

const Register = (props) => {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [number, setNumber] = useState("")
  const [verification, setVerification] = useState("")
  const [verificationNumber, setverificationNumber] = useState(1)
  const [loading, setLoading] = useState(false)
  const [checkBox, setCheckBox] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [listOfItems, setListOfItems] = useState([{ name: "Passport", number: 2 }, { name: "Driver’s License", number: 3 }, { name: "Photo ID", number: 4 }])
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [filePath, setFilePath] = useState(null);
  const [showAlert, setShowAlert] = useState(false)
  const [alertHeader, setAlertHeader] = useState("")
  const [alertBody, setAlertBody] = useState("")

  const dispatch = useDispatch()
  const state = useSelector(state => state)

  const validation = () => {
    if (fullName === "") {
      AlertComponent({ msg: "Full name is required" })
    }
    else if (email === "") {
      AlertComponent({ msg: "Email is required" })
    }
    else if (reg.test(email) == false) {
      AlertComponent({ msg: "Email is invalid" })
    }
    else if (password == "") {
      AlertComponent({ msg: "Password is required" })
    }
    else if (password.length <= 7) {
      AlertComponent({ msg: "Password must be 8 characters" })
    }
    else if (number.length == "") {
      AlertComponent({ msg: "Mobile number is required" })
    }
    else if (number.length <= 7) {
      AlertComponent({ msg: "Mobile number is invalid" })
    }
    else if (verificationNumber === 1) {
      AlertComponent({ msg: "Select verification type" })
    }
    else if (!filePath) {
      AlertComponent({ msg: "Select image for verficiation" })
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
    } else return true;
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
    data.append('phone_no', "+61" + number);
    data.append('verification_method', verificationNumber);
    data.append('file', filePath);
    console.log(constant.registration, data)
    axios
      .post(constant.registration, data, config)
      .then(function (response) {
        setLoading(false)
        if (response.data.code === "1") {
          console.log(response.data)
          props.navigation.navigate("Login")
          // dispatch(signIn({ userData: response.data.user, isLogin: true }))
          // props.navigation.dispatch(mainApp)
        }
        else {
          // AlertComponent({ msg: response.data.desc })
          setFilePath(null)
          setShowAlert(true)
          setAlertHeader("Error")
          setAlertBody(response.data.desc)

        }
      })
      .catch(function (error) {
        setLoading(false)
        console.log(error)
        AlertComponent({ msg: error.message })
      });
  }
  return (
    // <View>
    //   {
    //     loading ?
    //       <View style={styles.mainViewStyle}>
    //         <View style={[styles.innerStyle1, { backgroundColor: state.themeChangeReducer.primaryColor }]}>
    //           <TouchableOpacity style={[styles.leftArrowIconStyle, { borderColor: state.themeChangeReducer.secondaryColor, position: "absolute", top: 40, left: 20, zIndex: 222222 }]}
    //             onPress={() => { props.navigation.goBack() }}>
    //             <Image source={images.leftArrowIcon} style={styles.imageStyle} />
    //           </TouchableOpacity>
    //           <View style={{ width: "100%", alignItems: "center" }}>
    //             <Text style={[styles.headingStyle, { color: state.themeChangeReducer.secondaryColor, textAlign: "center", width: "100%" }]}>{"Verify Your ID"}</Text>
    //             <Text style={[styles.headingStyle, { color: state.themeChangeReducer.secondaryColor, fontSize: 12, textAlign: "center" }]}>{"Scan you Driver’s License in the \ncamera below to verify your identity"}</Text>
    //           </View>
    //         </View>

    //         <View style={[styles.innerViewStyle2, { backgroundColor: state.themeChangeReducer.secondaryColor, justifyContent: "center", alignItems: "center" }]} >
    //           <View style={{ width: 260, height: 310, borderColor: state.themeChangeReducer.primaryColor, borderWidth: 2 }}>
    //             <View style={{ marginLeft: -2, marginTop: -2, width: 260, height: 310, borderColor: state.themeChangeReducer.secondaryColor, borderWidth: 30, borderRadius: 30 }}>
    //               {/* <Image source={images.filePathuir}/> */}

    //             </View>
    //           </View>
    //           <Loader visible={loading} />
    //         </View>
    //       </View>
    //       :
    <View style={styles.mainViewStyle}>
      <KeyboardAwareScrollView containerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} >
        <View style={[styles.innerViewStyle1, { backgroundColor: state.themeChangeReducer.primaryColor }]}>

          <Header
            iconStyle={{ tintColor: colors.whiteColor, height: 30, width: 30, resizeMode: "contain" }}
            leftIcon={images.unboldIcon}
            backIconPress={() => { props.navigation.goBack() }}
            headerText={"Sign Up"}
            headerTStyle={styles.headingStyle, { color: state.themeChangeReducer.secondaryColor }}
            containerStyle={{ paddingHorizontal: 30 }} />
          {/* <Image source={images.logo} style={styles.imageStyle} /> */}
        </View>
        <View style={[styles.innerViewStyle2, { backgroundColor: state.themeChangeReducer.secondaryColor }]} >

          <InputField
            placeholder={"Full Name"}
            placeholderTextColor={colors.placeholderColor}
            containerStyle={[commonStyles.inputContainerStyle, { height: Platform.OS === "android" ? phoneScreen.height * 7 / 100 : phoneScreen.height * 6 / 100 }]}
            inputStyle={commonStyles.inputInnerStyle}
            onChangeText={(text) => setFullName(text)}
            value={fullName}
          />
          <InputField
            placeholder={"Email"}
            placeholderTextColor={colors.placeholderColor}
            containerStyle={[commonStyles.inputContainerStyle, { marginTop: 15, height: Platform.OS === "android" ? phoneScreen.height * 7 / 100 : phoneScreen.height * 6 / 100 }]}
            inputStyle={commonStyles.inputInnerStyle}
            onChangeText={(text) => setEmail(text)}
            value={email}
            onEndEditing={() => setEmail(email.trim())}
          />
          <InputField
            placeholder={"Password"}
            placeholderTextColor={colors.placeholderColor}
            containerStyle={[commonStyles.inputContainerStyle, { marginTop: 15, height: Platform.OS === "android" ? phoneScreen.height * 7 / 100 : phoneScreen.height * 6 / 100 }]}
            inputStyle={commonStyles.inputInnerStyle}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
          <InputField
            placeholder={"Mobile Number"}
            placeholderTextColor={colors.placeholderColor}
            containerStyle={[commonStyles.inputContainerStyle, { marginTop: 15, height: Platform.OS === "android" ? phoneScreen.height * 7 / 100 : phoneScreen.height * 6 / 100, flexDirection: "row", alignItems: "center" }]}
            inputStyle={[commonStyles.inputInnerStyle, { flex: 1 }]}
            onChangeText={(text) => setNumber(text)}
            value={number}
            maxLength={8}
            image={images.auFlag}
            imageStyle={{ width: 18, height: 10, resizeMode: "contain" }}
            imageViewStyle={{ width: 30 }}
            countryCode={"+61"}
            countryCodeStyle={{ fontSize: 14, color: number == "" ? colors.placeholderColor : colors.blackTextColor }}
            textViewStyle={{ width: 30 }}
          />
          <ModalOpenField
            value={verification === "" ? "Verification" : verification}
            containerStyle={[commonStyles.inputContainerStyle, { marginTop: 15, height: Platform.OS === "android" ? phoneScreen.height * 7 / 100 : phoneScreen.height * 6 / 100 }]}
            inputStyle={[commonStyles.inputInnerStyle, { color: verification === "" ? colors.placeholderColor : colors.greyColor }]}
            onPress={() => { setShowPicker(true) }}
          />
          <Button
            buttonStyle={[commonStyles.buttonStyle, { backgroundColor: state.themeChangeReducer.primaryColor, marginTop: 15 }, commonStyles.shadowStyle]}
            textStyle={commonStyles.textStyle}
            text={"Sign Up"}
            onPress={() => { validation()/* props.navigation.navigate("ModeSelection") */ }}
          />
          <View style={{ marginTop: 10, alignItems: "center", width: "100%" }}>
            <CustomCheckBox
              checkstyle={{ borderWidth: 0.8, borderColor: colors.greyColor }}
              onChange={() => { setCheckBox(!checkBox) }}
              isChecked={checkBox}
              tintColor={colors.checkBoxLightGreyColor}
              labelStyle={{ fontSize: 12, color: colors.placeholderColor }}
              label={"By signing in you agree to our "}
              label1={"Terms & Conditions"}
              label1Style={{ textDecorationLine: "underline", fontSize: 12, color: colors.placeholderColor }}
            />
            <TouchableOpacity style={{ marginVertical: 5 }} onPress={() => { props.navigation.navigate("Login") }}>
              <Text style={{ color: colors.greyColor, fontSize: 12, fontWeight: "400" }} ><Text style={{ color: colors.placeholderColor, fontSize: 12, }}>{"Don’t have an account? "}</Text>{"Login"}</Text>
            </TouchableOpacity>
          </View>

        </View>
       
        {imageModalVisible && (
          <BottomSheet
            visible={imageModalVisible}
            customHeaderText={verification}
            onDragDown={() => setImageModalVisible(false)}
            fromCamera={() => {
              setImageModalVisible(false);
              captureImage("photo");
            }}
            fromGallery={() => {
              setImageModalVisible(false);
              chooseFile("photo");
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
        <Loader visible={loading} />
      </KeyboardAwareScrollView>
      {
          showPicker &&
          <CustomModal
            listOfItems={listOfItems}
            headingStyle={{ fontSize: 18, fontWeight: "500", color: state.themeChangeReducer.primaryColor }}
            ItemSeparatorComponent={() =>
              <View
                style={{
                  height: 1,
                  backgroundColor: "#E5E5E5",
                }}
              />
            }
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  style={{ width: "100%", paddingVertical: 13 }}
                  onPress={() => {
                    setVerification(item.name)
                    setverificationNumber(item.number)
                    setShowPicker(false)
                    setImageModalVisible(true)
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: "400" }}>{item.name}</Text>
                </TouchableOpacity>
              );
            }} />
        }
    </View>
    //   }


    // </View>
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
      marginTop: -20,
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