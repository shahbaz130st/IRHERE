import React,{useEffect} from "react";
import { View, Text, Image,StyleSheet,Dimensions,AppState,PermissionsAndroid } from "react-native";
import commonStyles from "../Themes/commonStyles";
import { images } from "../Assets/Images";
import {  useSelector } from "react-redux";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import Header from "../Component/Header";
import { phoneScreen } from "../Themes/phoneScreen";
import { colors } from "../Themes/colors";
import Button from "../Component/Button";
import { AlertComponent } from "../Utils/Alert";
import {PERMISSIONS, check, request, RESULTS, openSettings } from 'react-native-permissions';
const UnablePermisssion = (props) => {
    const state = useSelector(state => state)
    useEffect(()=>{
      if(props?.route?.name==="UnablePermisssion"){
        AppState.addEventListener('change', async (state) => {
          if (state === 'active'&&props?.route?.params?.for==="Location") {
           await requestLocationPermission()
            }
            else if (state === 'active'&&props?.route?.params?.for==="Camera") {
              await requestCameraPermission()
               }
        })
      }
    },[])
    
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              AlertComponent({ msg: 'This feature is not available (on this device / in this context)', title: "Error", type: "error" })
              break;
            case RESULTS.DENIED:
               request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
              break;
            case RESULTS.LIMITED:
              AlertComponent({ msg: 'The permission is limited: some actions are possible', title: "Error", type: "error" })
              break;
            case RESULTS.GRANTED:
              props.navigation.goBack()
              break;
            case RESULTS.BLOCKED:
              props.navigation.navigate("UnablePermisssion",{for:"Location"})
              break;
          }
        })
        .catch((error) => {
          AlertComponent({ msg: error.message, title: "Error", type: "error" })
        });
      }
      else {
        try {
          const granted = await PermissionsAndroid.request( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
          // If CAMERA Permission is granted
          
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              props.navigation.goBack()
          }
          else if(granted===PermissionsAndroid.RESULTS.DENIED){
              try {
                  const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
                  // If CAMERA Permission is granted
                  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    props.navigation.goBack()
                  }
                  else if(granted===PermissionsAndroid.RESULTS.DENIED){
                     
                  }
                  else if(granted==="never_ask_again"){
                      props.navigation.navigate("UnablePermisssion", { for: "Location" })
                  }
              } catch (err) {
                  console.warn(err);
              }
          }
          else if(granted==="never_ask_again"){
              props.navigation.navigate("UnablePermisssion", { for: "Location" })
          }
      } catch (err) {
          console.warn(err);
          return false;
      }
        // try {
        //   const granted = await PermissionsAndroid.request(
        //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        //     {
        //       'title': 'Location Permission',
        //       'message': 'This App needs access to your location ' +
        //         'so we can know where you are.'
        //     }
        //   )
        //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //     console.log("You can use locations ")
        //     getLocation()
        //   } else {
        //     console.log("Location permission denied")
        //   }
        // } catch (err) {
        //   console.warn(err)
        // }
      }
    }
    const requestCameraPermission = async () => {
      if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
            // If CAMERA Permission is granted
            
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                props.navigation.goBack()
            }
            else if(granted===PermissionsAndroid.RESULTS.DENIED){
                try {
                    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
                    // If CAMERA Permission is granted
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                      props.navigation.goBack()
                    }
                    else if(granted===PermissionsAndroid.RESULTS.DENIED){
                        return false
                    }
                    else if(granted==="never_ask_again"){
                        props.navigation.navigate("UnablePermisssion", { for: "Camera" })
                    }
                } catch (err) {
                    console.warn(err);
                    return false;
                }
            }
            else if(granted==="never_ask_again"){
                props.navigation.navigate("UnablePermisssion", { for: "Camera" })
            }
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
              if (res2 === RESULTS.GRANTED) {
                  return res2 === RESULTS.GRANTED;
                }
                else if (res2 === RESULTS.BLOCKED) {
                  props.navigation.navigate("UnablePermisssion",{for: "Camera"})
                 }
          }
          else if (res === RESULTS.BLOCKED) {
              props.navigation.navigate("UnablePermisssion",{for: "Camera"})
             }
      }
  };
    return (
        <View style={[commonStyles.mainViewStyle, { backgroundColor: state.themeChangeReducer.secondaryColor }]}>
            <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} >
                <Header
                    leftIcon={images.unboldIcon}
                    backIconPress={() => { props.navigation.goBack() }}
                    headerText={props?.route?.params?.for==="Location"?"We Are Unable To Locate You":"We Are Unable To\n Access Your Camera"} 
                    headerTStyle={{textAlign:"center" }}/>
                <View style={{ flex: 1, alignItems: "center",marginTop:30 }}>
                    <Text style={[styles.bodyStyle, { marginTop: 10, color: colors.placeholderColor, fontSize: 14 }]}>{props?.route?.params?.for==="Location"?"In order for this app to function properly, give":"In order for this app to function properly, give"}</Text>
                    <Text style={[styles.bodyStyle, { marginTop: 10, color: colors.placeholderColor, fontSize: 14 }]}>{props?.route?.params?.for==="Location"?"us your permission to locate you. We only ever":"us your permission to locate you. We only ever"}</Text>
                    <Text style={[styles.bodyStyle, { marginTop: 10, color: colors.placeholderColor, fontSize: 14 }]}>{props?.route?.params?.for==="Location"?"use your location at the time of verification.":"use your camera while verification."}</Text>
                    <View style={{ flex: 1 }} />
                    <Image source={props?.route?.params?.for==="Location"?images.unblockLocation:images.unableCamera} style={{ width: 250, height: 194, resizeMode: "contain" }} />
                    <View style={{ flex: 1 }} />
                    <Button
                        image
                        imageStyle={{ height: 25, width: 25, tintColor: state.themeChangeReducer.secondaryColor, position: "absolute", zIndex: 1111, right: 20 }}
                        buttonStyle={[commonStyles.buttonStyle, { backgroundColor: state.themeChangeReducer.primaryColor, marginVertical: 18, width: "90%" }]}
                        textStyle={commonStyles.textStyle}
                        text={"Open Settings"}
                        onPress={() => {
                            openSettings().catch(() => console.warn('cannot open settings'));
                        }}
                    />
                </View>
            </KeyboardAwareScrollView>
        </View>
    )

}
export default UnablePermisssion;
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
      }
    }
  )