import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { colors } from "../Themes/colors";
import commonStyles from "../Themes/commonStyles";
import InputField from "../Component/InputField";
import { images } from "../Assets/Images";
import constant from "../Utils/ApiConstants";
import { AlertComponent } from "../Utils/Alert";
import Loader from "../Utils/Loader";
import axios from "axios";
import { phoneScreen } from "../Themes/phoneScreen";
import { signOut } from "../Store/ActionsCreator";
import SwitchToggle from "../Component/SwitchToggle";
import SettingMenue from "../Component/SettingMenu";
import { useDispatch, useSelector } from "react-redux";
import { StackActions } from "@react-navigation/native";
import AvatarComponent from "../Component/AvatarComponent";
import Preference from 'react-native-preference';
import HomeButton from "../Component/HomeButton";
import { PERMISSIONS, check, request, RESULTS } from 'react-native-permissions';
const login = StackActions.replace("OnBoarding", { screen: "Welcom" })
const SettingScreen = (props) => {
  const [loading, setLoading] = useState(false)
  const state = useSelector(state => state)
  const user = useSelector(state => state.authenticationReducer.user)
  const [switchValue, setSwitchValue] = useState(false);
  const [cameraPermission,setCameraPermission] =useState(false)
  const [locationPermission,setLocationPermission] =useState(false)
  const [userData, setUserData] = useState({})
  const dispatch = useDispatch()
  const logOut = () => {
    Preference.clear()
    dispatch(signOut())
    props.navigation.dispatch(login)
  }
  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      getUserDetail()
      requestCameraPermission()
      requestLocationPermission()
    });
    return unsubscribe;
  }, [props.navigation]);
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Cool Photo App Camera Permission",
            message:
              "Cool Photo App needs access to your camera " +
              "so you can take awesome pictures.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the camera");
        } else {
          console.log("Camera permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      const res = await check(PERMISSIONS.IOS.CAMERA);
      if (res === RESULTS.GRANTED) {
        console.log('You can use camera');
        setCameraPermission(true)

      } else if (res === RESULTS.DENIED) {
        const res2 = await request(PERMISSIONS.IOS.CAMERA);
        if (res2 === RESULTS.GRANTED) {
          console.log('You can use camera');
          setCameraPermission(true)
        }
        else if (res2 === RESULTS.BLOCKED) {
          setCameraPermission(false)
        }
      }
      else if (res === RESULTS.BLOCKED) {
        setCameraPermission(false)
      }
    }
  };
  const allowRequestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Cool Photo App Camera Permission",
            message:
              "Cool Photo App needs access to your camera " +
              "so you can take awesome pictures.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the camera");
        } else {
          console.log("Camera permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      const res = await check(PERMISSIONS.IOS.CAMERA);
      if (res === RESULTS.GRANTED) {
        console.log('You can use camera');
        setCameraPermission(true)

      } else if (res === RESULTS.DENIED) {
        const res2 = await request(PERMISSIONS.IOS.CAMERA);
        if (res2 === RESULTS.GRANTED) {
          console.log('You can use camera');
          setCameraPermission(true)
        }
        else if (res2 === RESULTS.BLOCKED) {
          props.navigation.navigate("UnablePermisssion", { for: "Camera" })
        }
      }
      else if (res === RESULTS.BLOCKED) {
        props.navigation.navigate("UnablePermisssion", { for: "Camera" })
      }
    }
  };
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const res = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      console.log(res)
      if (res === RESULTS.GRANTED) {
        console.log('You can use locations ');
       setLocationPermission(true)
      } else if (res === RESULTS.DENIED) {
        const res2 = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        res2 === RESULTS.GRANTED;
        if (res2 === RESULTS.GRANTED) {
          setLocationPermission(true)
        }
        else if (res2 === RESULTS.BLOCKED) {
          setLocationPermission(false)
         }
      }
      else if (res === RESULTS.BLOCKED) {
        setLocationPermission(false)
      }
    }
    else {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        // If CAMERA Permission is granted
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setLocationPermission(true)
        }
        else if(granted===PermissionsAndroid.RESULTS.DENIED){
            try {
                const granted = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                  setLocationPermission(true)
                }
                else if(granted===PermissionsAndroid.RESULTS.DENIED){
                  setLocationPermission(false)
                }
                else if(granted==="never_ask_again"){
                  setLocationPermission(false)
                }
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        else if(granted==="never_ask_again"){
          setLocationPermission(false)
        }
    } catch (err) {
        console.warn(err);
        return false;
    }
    }
  }
  const allowRequestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const res = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      console.log(res)
      if (res === RESULTS.GRANTED) {
        console.log('You can use locations ');
       setLocationPermission(true)
      } else if (res === RESULTS.DENIED) {
        const res2 = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        res2 === RESULTS.GRANTED;
        if (res2 === RESULTS.GRANTED) {
          setLocationPermission(true)
        }
        else if (res2 === RESULTS.BLOCKED) {
          props.navigation.navigate("UnablePermisssion",{for:"Location"})
         }
      }
      else if (res === RESULTS.BLOCKED) {
       props.navigation.navigate("UnablePermisssion",{for:"Location"})
      }
    }
    else {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        // If CAMERA Permission is granted
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setLocationPermission(true)
        }
        else if(granted===PermissionsAndroid.RESULTS.DENIED){
            try {
                const granted = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                  setLocationPermission(true)
                }
                else if(granted===PermissionsAndroid.RESULTS.DENIED){
                    return false
                }
                else if(granted==="never_ask_again"){
                    props.navigation.navigate("UnablePermisssion", { for: "Location" })
                }
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        else if(granted==="never_ask_again"){
            props.navigation.navigate("UnablePermisssion", { for: "Location" })
        }
    } catch (err) {
        console.warn(err);
        return false;
    }
    }
  }
  const getUserDetail = () => {
    setLoading(true)
    var config = {
      headers: {
        "Content-Type": "multipart/form-data"
      },
    };
    const data = new FormData();
    data.append('user_id', user.id);
    console.log(constant.fetch_user_info, data)
    axios
      .post(constant.fetch_user_info, data)
      .then(function (response) {
        setLoading(false)
        console.log(response.data)
        if (response.data.code === "1") {
          setUserData(response.data)
        }

      })
      .catch(function (error) {
        setLoading(false)
        console.log(error)
        AlertComponent({ msg: error.message, title: "Error", type: "error" })
      });
  }
  return (
    <View style={{ flex: 1, backgroundColor: state.themeChangeReducer.secondaryColor }}>
      <View style={{ height: 75, width: "100%", backgroundColor: state.themeChangeReducer.primaryColor }} />
      <View style={{ flex: 1, alignItems: "center", backgroundColor: colors.skyBlueColor, borderTopRightRadius: 17, borderTopLeftRadius: 17, marginTop: -20, paddingHorizontal: 20 }}>
        <Text style={[{ fontWeight: "700", fontSize: 24, lineHeight: 36, color: colors.blackTextColor, marginTop: 25 }]}>{"User Setting"}</Text>
        <View style={{ alignItems: "center" }}>
          <AvatarComponent
            style={{ height: 150, width: 150, borderRadius: 75, marginTop: 30 }}
            imageStyle={{ height: 150, width: 150, resizeMode: "cover", borderRadius: 75 }}
            defaultSource={images.imagePlaceholder}
            source={images.imagePlaceholder}
          />
          <View style={{ marginTop: 20, alignItems: "center" }}>
   
              <Text style={{ fontSize: 20, fontWeight: "700" }}>{userData?.name}</Text>
            
              <Text style={{
                fontSize: 14,
                fontWeight: "400",
                fontStyle: "normal",
                lineHeight: 22.5,
              }}>{userData?.email}</Text>
          
              <Text style={{
                fontSize: 14,
                fontWeight: "400",
                fontStyle: "normal",
                lineHeight: 22.5
              }}>{userData?.phone_no}</Text>
               <Text style={[{ fontWeight: "700", fontSize: 24, lineHeight: 36, color: colors.blackTextColor, marginTop: 25 }]}>{"Permissions"}</Text>
               {
                 cameraPermission?
                 <HomeButton
                 buttonStyle={[commonStyles.WhiteButtonStyle, { backgroundColor: state.themeChangeReducer.secondaryColor,height:48,borderRadius:8 }]}
                 leftImageViewStyle={[commonStyles.leftImageViewStyle, { backgroundColor: colors.whiteColor,width:20 }]}
                 leftImage={images.cameraPermission}
                 leftImageStyle={{height:20,width:20,resizeMode:"contain"}}
                 textViewStyle={{ flex: 1 }}
                 text={"Camera"}
                 textStyle={[commonStyles.textStyle, { fontWeight:"600" }]}
                 rightImageViewStyle={[commonStyles.leftImageViewStyle, { backgroundColor: colors.whiteColor,width:20 }]}
                 rightImage={images.permissionAllow}
                 rightImageStyle={{height:16,width:16,resizeMode:"contain"}}
               />:  
               <HomeButton
               buttonStyle={[commonStyles.WhiteButtonStyle, { backgroundColor: state.themeChangeReducer.secondaryColor,height:48,borderRadius:8 }]}
               leftImageViewStyle={[commonStyles.leftImageViewStyle, { backgroundColor: colors.whiteColor,width:20 }]}
               leftImage={images.cameraPermission}
               leftImageStyle={{height:20,width:20,resizeMode:"contain"}}
               textViewStyle={{ flex: 1 }}
               text={"Camera"}
               textStyle={[commonStyles.textStyle, { fontWeight:"600" }]}
               onAllowPress={()=>{allowRequestCameraPermission()}}
               buttonText={"Allow"}
               button1Style={{ backgroundColor: state.themeChangeReducer.primaryColor, marginVertical: 20,height:28,width:71,borderRadius:5 }}
             />
               }
             {
               locationPermission?
               <HomeButton
               buttonStyle={[commonStyles.WhiteButtonStyle, { backgroundColor: state.themeChangeReducer.secondaryColor,height:48,borderRadius:8 }]}
               leftImageViewStyle={[commonStyles.leftImageViewStyle, { backgroundColor: colors.whiteColor,width:20 }]}
               leftImage={images.locationPermission}
               leftImageStyle={{height:21,width:16,resizeMode:"contain"}}
               textViewStyle={{ flex: 1 }}
               text={"Location"}
               textStyle={[commonStyles.textStyle, {fontWeight:"600" }]}
               rightImageViewStyle={[commonStyles.leftImageViewStyle, { backgroundColor: colors.whiteColor,width:20 }]}
               rightImage={images.permissionAllow}
               rightImageStyle={{height:16,width:16,resizeMode:"contain"}}
             />:
             <HomeButton
             buttonStyle={[commonStyles.WhiteButtonStyle, { backgroundColor: state.themeChangeReducer.secondaryColor,height:48,borderRadius:8 }]}
             leftImageViewStyle={[commonStyles.leftImageViewStyle, { backgroundColor: colors.whiteColor,width:20 }]}
             leftImage={images.locationPermission}
             leftImageStyle={{height:21,width:16,resizeMode:"contain"}}
             textViewStyle={{ flex: 1 }}
             text={"Location"}
             textStyle={[commonStyles.textStyle, {fontWeight:"600" }]}
             onAllowPress={()=>{allowRequestLocationPermission()}}
             buttonText={"Allow"}
             button1Style={{ backgroundColor: state.themeChangeReducer.primaryColor, marginVertical: 20,height:28,width:71,borderRadius:5  }}
           />
             }
                
          </View>
        </View>
        <View style={{ flex: 1, width: "100%", alignItems: "center", marginBottom: 10, justifyContent: "flex-end" }}>
          <TouchableOpacity style={{ flexDirection: "row" }}
            onPress={() => {
              Alert.alert(
                "",
                "Are you sure you want to logout?",
                [
                  {
                    text: "Ok",
                    onPress: () => {
                      logOut();
                    },
                  },
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel is Pressed"),
                  },
                ],
                { cancelable: false }
              );
            }}>
            <Image style={{ width: 18, height: 18, resizeMode: "contain" }} source={images.logoutIcon} />
            <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: "500", color: state.themeChangeReducer.primaryColor }}>{"Log Out"}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Loader visible={loading} />
    </View>
  )
}
export default SettingScreen;

const styles = StyleSheet.create(
  {
    mainViewStyle: {
      flex: 1
    },
    innerViewStyle1: {
      height: phoneScreen.height * 40 / 100,
      backgroundColor: colors.primaryColor,
      alignItems: "center",
      justifyContent: "space-evenly"
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
    imageStyle: {
      resizeMode: "contain",
      height: "40%",
    },
    headingStyle: {
      fontSize: 24,
      fontWeight: "700",
      fontStyle: "normal",
    },
    bodyStyle: {
      fontSize: 16,
      fontWeight: "500",
      fontStyle: "normal",
    },
    innerViewStyle2: {
      height: phoneScreen.height * 85 / 100,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      paddingTop: 30,
      paddingHorizontal: 30
    },
  }
)