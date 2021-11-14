import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Keyboard, Platform } from "react-native";
import { colors } from "../Themes/colors";
import constant from "../Utils/ApiConstants";
import { AlertComponent } from "../Utils/Alert";
import Loader from "../Utils/Loader";
import axios from "axios";
import Button from "../Component/Button";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { phoneScreen } from "../Themes/phoneScreen";
import { useSelector } from "react-redux";
import commonStyles from "../Themes/commonStyles";
import { images } from "../Assets/Images/index";
import MapInput from "../Component/MapInput";
import MapView, { Marker } from 'react-native-maps';
import { StackActions } from "@react-navigation/native";
import Preference from 'react-native-preference';
const mainApp = StackActions.replace("TabGroup")
const ModeSelection = (props) => {
  const state = useSelector(state => state)
  let user = useSelector(state => state.authenticationReducer.user)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState("quarantine")
  const [region, setRegion] = useState({})
  const [location, setLocation] = useState({})
  const [keyboardHeight, setKeyboardHeight] = useState(0)
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
        if (response.data.code === 1) {
          if (mode === "1") {
            Preference.set("mode", "quarantine")
            setMode("quarantine")
          }
          else if (mode === 0) {
            props.navigation.dispatch(mainApp)
          }
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
          if (mode === 1) {
            Preference.set("mode", "quarantine")
            setMode("quarantine")
          }
          else if (mode === 0) {
            props.navigation.dispatch(mainApp)
            setMode("general")
          }
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
    setKeyboardHeight(e.endCoordinates.height);
  }
  const onKeyboardDidHide = () => {
    setKeyboardHeight(0);
  }
  // useEffect(() => {
  //   Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
  //   Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
  //   return () => {
  //     Keyboard.removeListener('keyboardDidShow', onKeyboardDidShow);
  //     Keyboard.removeListener('keyboardDidHide', onKeyboardDidHide);
  //   };
  // }, []);
  return (
    <View style={[styles.mainViewStyle, { height: phoneScreen.height - keyboardHeight }]}>
      <KeyboardAwareScrollView containerStyle={{ flexGrow: 1, alignItems: "center" }} keyboardShouldPersistTaps='always'>
        <View style={[styles.innerViewStyle1, { backgroundColor: state.themeChangeReducer.primaryColor, height: phoneScreen.height * 20 / 100 /* mode === "quarantine" ? phoneScreen.height * 30 / 100 : phoneScreen.height * 35 / 100 */ }]}>
          <Text style={[styles.headingStyle, { color: state.themeChangeReducer.secondaryColor }]}>{"Quarantine Address"/* "Choose a Mode" */}</Text>
          <View style={{ width: "100%" }}>
            <Text style={[styles.subheadingStyle, { color: state.themeChangeReducer.secondaryColor, marginTop: mode === "quarantine" ? 0 : 10 }]}>{"Where are you planning to quarantine"/* "How would you like to use this app?" */}</Text>
            <Text style={[styles.bodyTextStyle, { color: state.themeChangeReducer.secondaryColor, marginTop: mode === "quarantine" ? 0 : 5 }]}>{"This address will be matched against your location for verification."/* "You can always switch between these modes later on from the app settings." */}</Text>
          </View>
        </View>
        <View style={[styles.innerViewStyle2, { backgroundColor: state.themeChangeReducer.secondaryColor, height: phoneScreen.height * 80 / 100/*  mode === "quarantine" ? phoneScreen.height * 70 / 100 : phoneScreen.height * 65 / 100 */ }]} >
          <View style={styles.buttonOuterViewStyle}>
            <TouchableOpacity style={[styles.buttonStyle, { backgroundColor: state.themeChangeReducer.secondaryColor, paddingHorizontal: 5, justifyContent: "center", alignItems: "center" }, commonStyles.shadowStyle]}
              onPress={() => {
                if (Preference.get("mode") === "notSet") {
                  mode_Selection(1)
                } else {
                  update_mode(1)
                }
              }}
            >
              <View style={[styles.buttonViewStyle, { backgroundColor: mode === "quarantine" ? state.themeChangeReducer.primaryColor : colors.lightGreyColor, borderRadius: 7 }]}>
                <Image style={[styles.imageStyle, { tintColor: mode === "quarantine" ? state.themeChangeReducer.secondaryColor : state.themeChangeReducer.primaryColor }]} source={images.quarantineIcon} />
              </View>
              <Text style={[styles.bodyTextStyle, { color: colors.greyColor, textAlign: "center" }]}>{"Quarantine Mode"}</Text>
              <Text style={styles.bodyText1Style}>{"Verify your location to the health authorities while you are isolating or in quarantine."}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonStyle, { backgroundColor: state.themeChangeReducer.secondaryColor, paddingHorizontal: 5, justifyContent: "center", alignItems: "center", }, commonStyles.shadowStyle]}
              onPress={() => {
                // AlertComponent({ msg: "This mode is under development" })

                if (Preference.get("mode") === "notSet") {
                  mode_Selection(0)
                } else {
                  update_mode(0)
                }
              }}
            >
              <View style={[styles.buttonViewStyle, { backgroundColor: mode === "general" ? state.themeChangeReducer.primaryColor : colors.lightGreyColor, borderRadius: 7 }]}>
                <Image style={[styles.imageStyle, { tintColor: mode === "general" ? state.themeChangeReducer.secondaryColor : state.themeChangeReducer.primaryColor }]} source={images.generalIcon} />
              </View>
              <Text style={[styles.bodyTextStyle, { color: colors.greyColor, textAlign: "center" }]}>{"General Mode"}</Text>
              <Text style={styles.bodyText1Style}>{"Send and receive location verify from your contacts anytime, anywhere using our Patented V&V technology."}</Text>
            </TouchableOpacity>
          </View>
          {
            mode === "quarantine" &&
            <View style={{ flex: 1, marginTop: 20 }}>
              <Text style={{ color: colors.blackTextColor, fontSize: 12 }}>{"Where are you planning to Quarantine?"}</Text>

              <MapInput
                placeholder={"Where To?"}
                preProcess={() => {
                  setRegion({})
                }}
                notifyChange={(loc) => {
                  console.log("loc", loc.lat, loc.lng)

                  setRegion({
                    latitude: loc.lat,
                    longitude: loc.lng,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1
                  })
                  setLocation({
                    latitude: loc.lat,
                    longitude: loc.lng,
                  })
                }}
                renderRightButton={() => {
                  return (
                    <View style={{
                      width: "15%", height: Platform.OS === "android" ? phoneScreen.height * 7 / 100 : phoneScreen.height * 6 / 100, alignItems: "center", justifyContent: "center", backgroundColor: colors.inputField
                    }}>
                      <Image style={{ width: 17, height: 17, resizeMode: "cover" }} source={images.whereTo} />
                    </View>
                  )
                }}
              />

              {region["latitude"] && region["longitude"] &&
                <View style={{ borderColor: state.themeChangeReducer.primaryColor, borderWidth: 1 }}>
                  <MapView
                    region={region}
                    style={{ height: phoneScreen.height * 24 / 100 }}
                  >
                    {location["latitude"] && location["longitude"] &&
                      <Marker
                        coordinate={{ latitude: parseFloat(location.latitude), longitude: parseFloat(location.longitude) }}
                      />}
                  </MapView>

                </View>
              }
              <Button
                buttonStyle={[commonStyles.buttonStyle, { backgroundColor: state.themeChangeReducer.primaryColor, marginTop: 15 }, commonStyles.shadowStyle]}
                textStyle={commonStyles.textStyle}
                text={"Continue"}
                onPress={() => {
                  if (Object.keys(location).length == 0) {
                    alert("Please select your location")
                  }
                  else {
                    let latlng = Object.keys(location).map(function (k) { return location[k] }).join(",");
                    console.log(latlng)
                    props.navigation.navigate("QuarantineWelcom", { location: latlng })
                  }
                }}
              />
            </View>
          }
        </View>

        <Loader visible={loading} />
      </KeyboardAwareScrollView>
    </View>
  )
}
export default ModeSelection;

const styles = StyleSheet.create(
  {
    mainViewStyle: {
      flex: 1,
      backgroundColor: colors.primaryColor,

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