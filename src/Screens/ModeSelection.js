import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Keyboard, Platform, PermissionsAndroid,TouchableWithoutFeedback } from "react-native";
import { colors } from "../Themes/colors";
import constant from "../Utils/ApiConstants";
import { AlertComponent } from "../Utils/Alert";
import Loader from "../Utils/Loader";
import axios from "axios";
import Button from "../Component/Button";
import RNSettings from 'react-native-settings';
import { KeyboardAwareScrollrView } from 'react-native-keyboard-aware-scrollview';
import { phoneScreen } from "../Themes/phoneScreen";
import { useSelector } from "react-redux";
import commonStyles from "../Themes/commonStyles";
import { images } from "../Assets/Images/index";
import MapInput from "../Component/MapInput";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StackActions } from "@react-navigation/native";
import Preference from 'react-native-preference';
import Header from "../Component/Header";
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { PERMISSIONS, check, request, RESULTS } from 'react-native-permissions';
import { HeaderHeight } from '../Utils/Dimensions';
import RNExitApp from 'react-native-exit-app';
import { ScrollView } from 'react-native-virtualized-view';

const ModeSelection = (props) => {
  const state = useSelector(state => state)
  let user = useSelector(state => state.authenticationReducer.user)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState("quarantine")
  const [region, setRegion] = useState({})
  const [location, setLocation] = useState({})
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [currentAddress, setCurrentAddress] = useState("")
  let displayAddress = ""
  const childRef = useRef();

  useEffect(() => {
    childRef.current?.setAddressText(currentAddress)
  }, [currentAddress])

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {

      const res = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (res === RESULTS.GRANTED) {
        console.log('You can use locations ');
        getLocation();
      } else if (res === RESULTS.DENIED) {
        const res2 = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        res2 === RESULTS.GRANTED;
        if (res2 === RESULTS.GRANTED) {
          getLocation();
        }
      }
    }
    else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            'title': 'Location Permission',
            'message': 'This App needs access to your location ' +
              'so we can know where you are.'
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use locations ")
          getLocation()
        } else {
          console.log("Location permission denied")
        }
      } catch (err) {
        console.warn(err)
      }
    }
  }
  const getLocation = () => {
    Geolocation.getCurrentPosition(async info => {
      console.log(info)
      setLocation({
        latitude: parseFloat(info.coords.latitude,),
        longitude: parseFloat(info.coords.longitude),
      })
      setRegion({
        latitude: parseFloat(info.coords.latitude,),
        longitude: parseFloat(info.coords.longitude),
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      })
      const response = await Geocoder.from(info.coords.latitude, info.coords.longitude);
      const address = response.results[0].formatted_address;
      console.log(address)
      setCurrentAddress(address)
    },
      e => {
        console.log("Error=", e),
          { enableHighAccuracy: true, timeout: 25000, maximumAge: 3600000 }
        if (e.code == 2) {
          RNSettings.openSetting(RNSettings.ACTION_LOCATION_SOURCE_SETTINGS).then(
            result => {
              if (result === RNSettings.ENABLED) {
                getLocation();
              }
            },
          );
        }
        if (e.code == 3) {
          getLocation();
        }
      });
  }
  const mode_Selection = (mode) => {
    setLoading(true)
    var config = {
      headers: {
        "Content-Type": "multipart/form-data"
      },
    };
    const data = new FormData();
    data.append('user_id', user.id);
    data.append('mode_code', mode);
    console.log(constant.set_user_mode, data)
    axios
      .post(constant.set_user_mode, data, config)
      .then(function (response) {
        console.log(response.data)
        setLoading(false)
        if (response.data.code === "1") {
          Preference.set("mode", "quarantine")
          setMode("quarantine")
        }
        else {
          setShowAlert(true)
          setAlertHeader("Error")
          setAlertBody(response.data.desc)
          // AlertComponent({ msg: response.data.desc })
        }
      })
      .catch(function (error) {
        setLoading(false)
        AlertComponent({ msg: error.message })
      });
  }
  const update_mode = (mode) => {
    setLoading(true)
    var config = {
      headers: {
        "Content-Type": "multipart/form-data"
      },
    };
    const data = new FormData();
    data.append('user_id', user.id);
    data.append('mode_code', mode);
    console.log(constant.update_user_mode, data)
    axios
      .post(constant.update_user_mode, data, config)
      .then(function (response) {
        console.log(response.data)
        setLoading(false)
        if (response.data.code === "1") {
          Preference.set("mode", "quarantine")
          setMode("quarantine")
        }
        else {
          setShowAlert(true)
          setAlertHeader("Error")
          setAlertBody(response.data.desc)
          // AlertComponent({ msg: response.data.desc })
        }
      })
      .catch(function (error) {
        setLoading(false)
        AlertComponent({ msg: error.message })
      });
  }
  const onKeyboardDidShow = (e) => {
    setRegion({})
    setLocation({})
    setKeyboardHeight(e.endCoordinates.height);
  }
  const onKeyboardDidHide = () => {
    setKeyboardHeight(0);
  }
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
    return () => {
      Keyboard.removeListener('keyboardDidShow', onKeyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', onKeyboardDidHide);
    };
  }, []);
  return (
    <TouchableWithoutFeedback style={[commonStyles.mainViewStyle, { backgroundColor: state.themeChangeReducer.secondaryColor }]} onPress={()=>Keyboard.dismiss()}>
       <View style={[commonStyles.mainViewStyle, { backgroundColor: state.themeChangeReducer.secondaryColor }]}>
      <Header
        leftIcon={images.unboldIcon}
        backIconPress={() => { 
          RNExitApp.exitApp(); }}
        headerText={"Your Quarantine Address"} />
      <View style={{ height: phoneScreen.height - HeaderHeight }} >
        <Text style={{ paddingHorizontal: 30, paddingTop: 20, paddingBottom: 5, color: colors.blackTextColor, fontSize: 14, fontWeight: "400" }}>{"Where are you planning to Quarantine?"}</Text>
        <View style={Object.keys(location).length === 0 ? styles.inputSearch : styles.inputSearch1}>
          <MapInput
            ref={childRef}
            inputFieldStyle={[commonStyles.inputContainerStyle, { paddingHorizontal: 0, borderColor: Object.keys(location).length === 0 ? colors.greyColor : state.themeChangeReducer.primaryColor }]}
            inputStyle={[commonStyles.passwordInputinnerStyle]}
            placeholder={"Type Address here"}
            notifyChange={(loc, details) => {
              setCurrentAddress(childRef.current?.getAddressText())
              console.log("loc", details)
              setLocation({
                latitude: parseFloat(loc.lat),
                longitude: parseFloat(loc.lng),
              })
              setRegion({
                latitude: parseFloat(loc.lat),
                longitude: parseFloat(loc.lng),
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              })

            }}
            renderRightButton={() => {
              return (
                <TouchableOpacity style={{
                  width: "15%", height: "100%", alignItems: "center", justifyContent: "center", backgroundColor: colors.whiteColor, borderTopRightRadius: phoneScreen.height * 1 / 100, borderBottomRightRadius: phoneScreen.height * 1 / 100
                }}
                  onPress={async () => {
                    Geocoder.init(Platform.OS === "ios" ? constant.ios_map_key : constant.android_map_key);
                    await requestLocationPermission()
                  }}>
                  <Image style={{ width: "60%", height: "60%", resizeMode: "contain" }} source={images.location} />
                </TouchableOpacity>
              )
            }}
          />
        </View>
        {
          region["latitude"] && region["longitude"] &&
          <View style={{ flex: 1 }}>
            <MapView
              region={region}
              style={{ flex: 1 }}
            >
              {location["latitude"] && location["longitude"] &&
                <Marker
                  coordinate={{ latitude: parseFloat(location.latitude), longitude: parseFloat(location.longitude) }}
                />}
            </MapView>


          </View>
        }
        <View style={{ paddingHorizontal: 30 }}>
          {
            Object.keys(location).length === 0 &&
            <Text style={[styles.bodyTextStyle, { color: colors.placeholderColor, marginTop: mode === "quarantine" ? 0 : 5, fontSize: 14 }]}>{"This address will be matched against your location for verification."}</Text>
          }
          <Button
            image
            imageStyle={{ height: 25, width: 25, tintColor: Object.keys(location).length === 0 ? colors.placeholderColor : state.themeChangeReducer.secondaryColor, position: "absolute", zIndex: 1111, right: 20 }}
            buttonStyle={[commonStyles.buttonStyle, { backgroundColor: Object.keys(location).length > 0 ? state.themeChangeReducer.primaryColor : colors.greyColor, marginVertical: 18 }]}
            textStyle={[commonStyles.textStyle, { color: Object.keys(location).length === 0 ? colors.placeholderColor : state.themeChangeReducer.secondaryColor }]}
            text={"Continue"}
            onPress={() => {
              if (Object.keys(location).length == 0) {
                AlertComponent({ msg: "Please select your location", title: "Error", type: "error" })

              }
              else {
                let latlng = Object.keys(location).map(function (k) { return location[k] }).join(",");
                console.log(latlng)
                props.navigation.navigate("QuarantineWelcom", { location: latlng,address:currentAddress })
              }
            }}
          />
        </View>
      </View>
      </View>
    </TouchableWithoutFeedback >
    // <View style={[styles.mainViewStyle, { height: phoneScreen.height - keyboardHeight }]}>
    //   <KeyboardAwareScrollView containerStyle={{ flexGrow: 1, alignItems: "center" }} keyboardShouldPersistTaps='always'>
    //     <View style={[styles.innerViewStyle1, { backgroundColor: state.themeChangeReducer.primaryColor, height: phoneScreen.height * 20 / 100 /* mode === "quarantine" ? phoneScreen.height * 30 / 100 : phoneScreen.height * 35 / 100 */ }]}>
    //       <Text style={[styles.headingStyle, { color: state.themeChangeReducer.secondaryColor }]}>{"Quarantine Address"/* "Choose a Mode" */}</Text>
    //       <View style={{ width: "100%" }}>
    //         <Text style={[styles.subheadingStyle, { color: state.themeChangeReducer.secondaryColor, marginTop: mode === "quarantine" ? 0 : 10 }]}>{"Where are you planning to quarantine"/* "How would you like to use this app?" */}</Text>
    //         <Text style={[styles.bodyTextStyle, { color: state.themeChangeReducer.secondaryColor, marginTop: mode === "quarantine" ? 0 : 5 }]}>{"This address will be matched against your location for verification."/* "You can always switch between these modes later on from the app settings." */}</Text>
    //       </View>
    //     </View>
    //     <View style={[styles.innerViewStyle2, { backgroundColor: state.themeChangeReducer.secondaryColor, height: phoneScreen.height * 80 / 100/*  mode === "quarantine" ? phoneScreen.height * 70 / 100 : phoneScreen.height * 65 / 100 */ }]} >
    //       {/* <View style={styles.buttonOuterViewStyle}>
    //         <TouchableOpacity style={[styles.buttonStyle, { backgroundColor: state.themeChangeReducer.secondaryColor, paddingHorizontal: 5, justifyContent: "center", alignItems: "center" }, commonStyles.shadowStyle]}
    //           onPress={() => {
    //             if (Preference.get("mode") === "notSet") {
    //               mode_Selection(1)
    //             } else {
    //               update_mode(1)
    //             }
    //           }}
    //         >
    //           <View style={[styles.buttonViewStyle, { backgroundColor: mode === "quarantine" ? state.themeChangeReducer.primaryColor : colors.lightGreyColor, borderRadius: 7 }]}>
    //             <Image style={[styles.imageStyle, { tintColor: mode === "quarantine" ? state.themeChangeReducer.secondaryColor : state.themeChangeReducer.primaryColor }]} source={images.quarantineIcon} />
    //           </View>
    //           <Text style={[styles.bodyTextStyle, { color: colors.greyColor, textAlign: "center" }]}>{"Quarantine Mode"}</Text>
    //           <Text style={styles.bodyText1Style}>{"Verify your location to the health authorities while you are isolating or in quarantine."}</Text>
    //         </TouchableOpacity>
    //         <TouchableOpacity style={[styles.buttonStyle, { backgroundColor: state.themeChangeReducer.secondaryColor, paddingHorizontal: 5, justifyContent: "center", alignItems: "center", }, commonStyles.shadowStyle]}
    //           onPress={() => {
    //             AlertComponent({ msg: "This mode is under development" })
    //             setMode("general")
    //           }}
    //         >
    //           <View style={[styles.buttonViewStyle, { backgroundColor: mode === "general" ? state.themeChangeReducer.primaryColor : colors.lightGreyColor, borderRadius: 7 }]}>
    //             <Image style={[styles.imageStyle, { tintColor: mode === "general" ? state.themeChangeReducer.secondaryColor : state.themeChangeReducer.primaryColor }]} source={images.generalIcon} />
    //           </View>
    //           <Text style={[styles.bodyTextStyle, { color: colors.greyColor, textAlign: "center" }]}>{"General Mode"}</Text>
    //           <Text style={styles.bodyText1Style}>{"Send and receive location verify from your contacts anytime, anywhere using our Patented V&V technology."}</Text>
    //         </TouchableOpacity>
    //       </View> */}
    //       {
    //         mode === "quarantine" &&
    //         <View style={{ flex: 1, marginTop: 20 }}>
    //           <Text style={{ color: colors.blackTextColor, fontSize: 12 }}>{"Where are you planning to Quarantine?"}</Text>

    //           <MapInput
    //             placeholder={"Where To?"}
    //             preProcess={() => {
    //               setRegion({})
    //             }}
    //             notifyChange={(loc) => {
    //               console.log("loc", loc.lat, loc.lng)

    //               setRegion({
    //                 latitude: loc.lat,
    //                 longitude: loc.lng,
    //                 latitudeDelta: 0.1,
    //                 longitudeDelta: 0.1
    //               })
    //               setLocation({
    //                 latitude: loc.lat,
    //                 longitude: loc.lng,
    //               })
    //             }}
    //             renderRightButton={() => {
    //               return (
    //                 <View style={{
    //                   width: "15%", height: Platform.OS === "android" ? phoneScreen.height * 7 / 100 : phoneScreen.height * 6 / 100, alignItems: "center", justifyContent: "center", backgroundColor: colors.inputField
    //                 }}>
    //                   <Image style={{ width: 17, height: 17, resizeMode: "cover" }} source={images.whereTo} />
    //                 </View>
    //               )
    //             }}
    //           />

    //           {region["latitude"] && region["longitude"] &&
    //             <View style={{ borderColor: state.themeChangeReducer.primaryColor, borderWidth: 1 }}>
    //               <MapView
    //                 region={region}
    //                 style={{ height: phoneScreen.height * 24 / 100 }}
    //               >
    //                 {location["latitude"] && location["longitude"] &&
    //                   <Marker
    //                     coordinate={{ latitude: parseFloat(location.latitude), longitude: parseFloat(location.longitude) }}
    //                   />}
    //               </MapView>

    //             </View>
    //           }
    //           <Button
    //             buttonStyle={[commonStyles.buttonStyle, { backgroundColor: state.themeChangeReducer.primaryColor, marginTop: 15 }, commonStyles.shadowStyle]}
    //             textStyle={commonStyles.textStyle}
    //             text={"Continue"}
    //             onPress={() => {
    //               if (Object.keys(location).length == 0) {
    //                 alert("Please select your location")
    //               }
    //               else {
    //                 let latlng = Object.keys(location).map(function (k) { return location[k] }).join(",");
    //                 console.log(latlng)
    //                 props.navigation.navigate("QuarantineWelcom", { location: latlng })
    //               }
    //             }}
    //           />
    //         </View>
    //       }
    //     </View>

    //     <Loader visible={loading} />
    //   </KeyboardAwareScrollView>
    // </View>
  )
}
export default ModeSelection;

const styles = StyleSheet.create(
  {
    mainViewStyle: {
      flex: 1,
      backgroundColor: colors.secondaryColor,
    },
    inputSearch: {
      flex: 1,
      paddingHorizontal: 30
    },
    inputSearch1: {
      paddingHorizontal: 30,
      height: Platform.OS === "android" ? phoneScreen.height * 7 / 100 : phoneScreen.height * 6 / 100,
      marginBottom: 20
    },
    innerViewStyle1: {
      height: phoneScreen.height * 30 / 100,
      backgroundColor: colors.primaryColor,
      alignItems: "center",
      paddingHorizontal: 15,
      paddingTop: Platform.OS === "android" ? phoneScreen.height * 5 / 100 : phoneScreen.height * 10 / 100
    },
    headingStyle: {
      fontSize: 24,
      fontWeight: "700",
      fontStyle: "normal",
    },
    subheadingStyle: {
      fontSize: 15,
      fontWeight: "600",
      fontStyle: "normal",
    },
    bodyTextStyle: {
      fontSize: 12,
      fontWeight: "500",
      fontStyle: "normal"
    },
    bodyText1Style: {
      fontSize: 9,
      fontWeight: "400",
      fontStyle: "normal",
      color: colors.placeholderColor,
      textAlign: "center"
    },
    buttonOuterViewStyle: {
      flexDirection: "row",
      height: Platform.OS === "android" ? phoneScreen.height * 24 / 100 : phoneScreen.height * 20 / 100,
      marginTop: -phoneScreen.height * 10 / 100,
      width: "100%",
      justifyContent: "space-between"
    },
    buttonViewStyle: {
      height: Platform.OS === "android" ? phoneScreen.height * 9 / 100 : phoneScreen.height * 6 / 100,
      width: Platform.OS === "android" ? phoneScreen.height * 9 / 100 : phoneScreen.height * 6 / 100,
      borderRadius: 7,
      backgroundColor: colors.lightGreyColor,
      alignItems: "center",
      justifyContent: "center"
    },
    imageStyle: {
      height: Platform.OS === "android" ? phoneScreen.height * 5 / 100 : phoneScreen.height * 3 / 100,
      width: Platform.OS === "android" ? phoneScreen.height * 5 / 100 : phoneScreen.height * 3 / 100,
      resizeMode: "contain"
    },
    buttonStyle: {
      height: "100%",
      width: "48%",
      borderRadius: 20
    },
    innerViewStyle2: {
      height: phoneScreen.height * 70 / 100,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      padding: 15
    }
  }
)