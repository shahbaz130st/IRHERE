import React, { useState, useEffect, useRef, forwardRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, PermissionsAndroid, FlatList, Alert, Dimensions, Platform } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { colors } from "../Themes/colors";
import ModalOpenField from "../Component/modalOpenField";
import Button from "../Component/Button";
import commonStyles from "../Themes/commonStyles";
import { images } from "../Assets/Images";
import constant from "../Utils/ApiConstants";
import { AlertComponent } from "../Utils/Alert";
import Loader from "../Utils/Loader";
import axios from "axios";
import { phoneScreen } from "../Themes/phoneScreen";
import { useDispatch, useSelector } from "react-redux";
import Preference from "react-native-preference";
import BiggerButton from "../Component/BiggerButton";
import {
  launchCamera
} from 'react-native-image-picker';
import RNSettings from 'react-native-settings';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import AlertModal from "../Utils/AlertModal";
import { signOut } from "../Store/ActionsCreator";
import { StackActions } from "@react-navigation/native";
import CustomBottomSheet from "../Component/CustomBottomSheet";
import { RNCamera } from 'react-native-camera';
import Header from "../Component/Header";
import { PERMISSIONS, check, request, RESULTS } from 'react-native-permissions';
import CustomCheckBoxBottomSheet from "../Component/CustomCheckBoxBottomSheet";
import DropDownPicker from 'react-native-dropdown-picker';
import * as Animatable from "react-native-animatable";
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
const overlayColor = "rgba(0,0,0,0.5)"; // this gives us a black color with a 50% transparency

const rectDimensions = SCREEN_WIDTH * 0.65; // this is equivalent to 255 from a 393 device width
const rectBorderWidth = SCREEN_WIDTH * 0.005; // this is equivalent to 2 from a 393 device width
const rectBorderColor = "#fff";

const scanBarWidth = SCREEN_WIDTH * 0.46; // this is equivalent to 180 from a 393 device width
const scanBarHeight = SCREEN_WIDTH * 0.0025; //this is equivalent to 1 from a 393 device width
const scanBarColor = "red";

const iconScanColor = "#fff";
const login = StackActions.replace("OnBoarding")
let called_pattern = {}
const SecureIdVerification = (props) => {
  const cameraRef= useRef(null)
  const [loading, setLoading] = useState(false)
  const state = useSelector(state => state)
  const [location, setLocation] = useState({})
  const [filePath, setFilePath] = useState("")
  const [currentAddress, setCurrentAddress] = useState("")
  const [status, setStatus] = useState("Make a video")
  const [resultImage, setResultImage] = useState("")
  const user = useSelector(state => state.authenticationReducer.user)
 

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
        res2 === RESULTS.GRANTED;
      }
    }
  };
  const captureImage = async (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: Platform.OS === "ios" ? 0.8 : 0.3,
      videoQuality: Platform.OS === "ios" ? "medium" : 'low',
      durationLimit: 3, //Video max duration in seconds
      saveToPhotos: false,
      cameraType: "front"
    };
    let isCameraPermitted = await requestCameraPermission();
    if (isCameraPermitted) {
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
        if (type === "video") {
          setStatus("Video is recorded.Please verify it.")
          // setFilePath({ uri: response.assets[0].uri, type: 'video/mp4', name: response.assets[0].fileName });
        }
        uploadVideo({ uri: Platform.OS === "ios" ? response.assets[0].uri.replace('file://', '') : response.assets[0].uri, type: 'video/mp4', name: Platform.OS === "ios" ? response.assets[0].uri.split("/").pop() : response.assets[0].fileName })
        
        // setAvatar(response.assets[0].uri)
        // setFilePath({ uri: response.assets[0].uri, type: 'image/jpeg', name: response.assets[0].fileName });
      });
    }
  };
  const makeSlideOutTranslation = (translationType, fromValue) => {
    return {
      from: {
        [translationType]: SCREEN_WIDTH * -0.18
      },
      to: {
        [translationType]: fromValue
      }
    };
  }
  const Camera = forwardRef((props, ref) => {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />
        
        <View style={styles.rectangleContainer}>
          <View style={{ flexDirection: "row",width:"100%",height:"100%",justifyContent:"center",alignItems:"center" }}>
            {/* <View style={styles.leftAndRightOverlay} /> */}
            {/* <View style={styles.rectangle}> */}
            {/* <View style={styles.bottomOverlay} /> */}
              <Image source={images.scannerIcon}
                style={{  height: phoneScreen.height * 35 / 100,
                  width: phoneScreen.width * 100 / 100, resizeMode: "contain" }} />
               {/* <View style={styles.bottomOverlay} /> */}
            {/* </View> */}
            {/* <View style={styles.leftAndRightOverlay} /> */}
          </View>
         
        </View>
      </View>
    )
  }
  )



  return (
    <View style={[commonStyles.mainViewStyle, { backgroundColor: state.themeChangeReducer.secondaryColor }]}>
      <Header
        leftIcon={images.unboldIcon}
        backIconPress={() => { props.navigation.goBack() }}
        headerText={"Secure ID Verification"} />

      <View style={[commonStyles.innerViewStyle, { backgroundColor: state.themeChangeReducer.secondaryColor, paddingHorizontal: 0 }]} >
        <Camera 
        ref={cameraRef}/>

        <View style={{ alignItems: "center", paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 14, fontWeight: "700", lineHeight: 24, color: colors.blackTextColor, marginTop: 18 }}>{"Scan the front side of your ID in the"}</Text>
          <Text style={{ fontSize: 14, fontWeight: "700", lineHeight: 24, color: colors.blackTextColor }}>{"frame above"}</Text>
          <Text style={{ fontSize: 14, fontWeight: "400", lineHeight: 20, color: colors.blackTextColor, marginTop: 18 }}>{"In order to verify its really you, please scan your"}</Text>
          <Text style={{ fontSize: 14, fontWeight: "400", lineHeight: 20, color: colors.blackTextColor }}>{props.route.params?.type +". Use a well lit area, a simple"}</Text>
          <Text style={{ fontSize: 14, fontWeight: "400", lineHeight: 20, color: colors.blackTextColor }}>{"dark background and make sure the edges are"}</Text>
          <Text style={{ fontSize: 14, fontWeight: "400", lineHeight: 20, color: colors.blackTextColor }}>{"within the highlighted area."}</Text>
        </View>
      
        <View style={{ flex: 1 }} />
        <View style={{ alignItems: "center", paddingHorizontal: 24 }}>
        <Button
            buttonStyle={[commonStyles.buttonStyle, { backgroundColor: state.themeChangeReducer.primaryColor }]}
            textStyle={commonStyles.textStyle}
            text={"Capture"}
            onPress={async () => {
              if (cameraRef) {
                const options = { quality: 0.5 };
                const data = await cameraRef.current.takePictureAsync(options);
                // console.log(data);
                setFilePath({ uri: data.uri, type: 'image/jpeg', name: data.uri.split("/").pop() });
                if(data.uri){
                  props.navigation.navigate("Register",{img:{ uri: data.uri, type: 'image/jpeg', name: data.uri.split("/").pop() }})
                }
              }
            }}
          />
          <Text style={{ fontSize: 12, fontWeight: "400", lineHeight: 16, color: colors.placeholderColor,marginTop:18 }}>{"We do not store an image of your ID. Instead, we encrypt"}</Text>
          <Text style={{ fontSize: 12, fontWeight: "400", lineHeight: 16, color: colors.placeholderColor }}>{"and save the information on your ID for verification"}</Text>
          <Text style={{ fontSize: 12, fontWeight: "400", lineHeight: 16, color: colors.placeholderColor }}>{"purposes."}</Text>
        </View>
        <Loader visible={loading} />
      </View>
    </View>
  )
}
export default SecureIdVerification;

const styles = StyleSheet.create(
  {
    mainViewStyle: {
      flex: 1
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
      height: phoneScreen.height * 85 / 100,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      paddingHorizontal: 30,
      paddingTop: 10
    },
    biggerButtonStyle: {
      flexDirection: "row",
      height: Platform.OS === "android" ? phoneScreen.height * 18 / 100 : phoneScreen.height * 15 / 100,
      width: "100%",
      backgroundColor: colors.biggerButtonColor,
      borderRadius: 20,
      marginTop: 10,
      alignItems: "center",
      paddingHorizontal: 10,
      justifyContent: "space-between"
    },
    lImageStyle: {
      height: 24,
      width: 24,
      resizeMode: "contain"
    },
    rImageStyle: {
      height: 15,
      width: 15,
      resizeMode: "contain"
    },
    textStyle: {
      fontSize: 14,
      fontWeight: "600",
      fontStyle: "normal",
    },
    text1Style: {
      fontSize: 11,
      fontWeight: "400",
      fontStyle: "normal",
    },
    preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      height: Dimensions.get('window').height - 400,
      width: Dimensions.get('window').width,
      position: "absolute",
      zIndex: 111
    },
    bodyStyle: {
      fontSize: 14,
      fontWeight: "400",
      color: colors.blackTextColor
    },
    container: {
      // flex: 1,
      // flexDirection: 'column',
      height: phoneScreen.height * 35 / 100,
      width: phoneScreen.width,
      backgroundColor: 'black',
      overflow: 'hidden'
    },
    preview: {
      height: phoneScreen.height * 35 / 100,
      width: phoneScreen.width,
      // justifyContent: 'flex-end',
      // alignItems: 'center',
    },
    capture: {
      flex: 0,
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: 15,
      paddingHorizontal: 20,
      alignSelf: 'center',
      margin: 20,
    },
    rectangleContainer: {
      height: phoneScreen.height * 35 / 100,
      width: phoneScreen.width,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      position: "absolute",
    },
    rectangle: {
      height: phoneScreen.height * 28 / 100,
      width: phoneScreen.width * 80 / 100,
      borderWidth: rectBorderWidth,
      borderColor: "green" /* rectBorderColor */,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
    },
    leftAndRightOverlay: {
      height: phoneScreen.height * 35 / 100,
      width: phoneScreen.width * 10 / 100,
      backgroundColor: overlayColor
    },
    bottomOverlay: {
      height: phoneScreen.height * 3.5 / 100,
      width: phoneScreen.width * 80 / 100,
      backgroundColor: overlayColor
    },
    scanBar: {
      width: "70%",
      height: 1,
      backgroundColor: colors.primaryColor
    }
  }
)