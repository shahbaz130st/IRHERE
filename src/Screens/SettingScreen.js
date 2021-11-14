import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { colors } from "../Themes/colors";
import commonStyles from "../Themes/commonStyles";
import { images } from "../Assets/Images";
// import constant from "../Utils/ApiConstants";
import { AlertComponent } from "../Utils/Alert";
import Loader from "../Utils/Loader";
// import axios from "axios";
import { phoneScreen } from "../Themes/phoneScreen";
import { signOut } from "../Store/ActionsCreator";
import SwitchToggle from "../Component/SwitchToggle";
import SettingMenue from "../Component/SettingMenu";
import { useDispatch, useSelector } from "react-redux";
import { StackActions } from "@react-navigation/native";
import Preference from 'react-native-preference';
const login = StackActions.replace("OnBoarding")
const SettingScreen = (props) => {
  const [loading, setLoading] = useState(false)
  const state = useSelector(state => state)
  const [switchValue, setSwitchValue] = useState(false);
  const dispatch = useDispatch()
  const logOut = () => {
    Preference.clear()
    dispatch(signOut())
    props.navigation.dispatch(login)
  }
  return (
    <View style={{ flex: 1, backgroundColor: state.themeChangeReducer.primaryColor }}>
      <View style={[styles.innerViewStyle2, { backgroundColor: state.themeChangeReducer.secondaryColor }]} >
        <View style={{ width: "100%", alignItems: "flex-end" }}>
          <SwitchToggle
            onChange={() => setSwitchValue(!switchValue)}
            value={switchValue}
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={[styles.headingStyle, { color: state.themeChangeReducer.primaryColor }]}>{"Settings"}</Text>
          <Text style={[styles.bodyStyle, { color: state.themeChangeReducer.primaryColor, fontSize: 10 }]}>{"Switch to Quarantine Mode"}</Text>
        </View>
        <View style={{ flex: 1, paddingTop: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image style={{ width: 13, height: 14, resizeMode: "contain" }} source={images.accountIcon} />
            <Text style={{ marginLeft: 5, fontSize: 16, fontWeight: "500" }}>{"Account"}</Text>
          </View>
          <SettingMenue
            title={"Edit Profile"}
            rightIcon={images.rightArrowIcon}
          />
          <SettingMenue
            title={"Change Password"}
            rightIcon={images.rightArrowIcon}
          />
          <SettingMenue
            title={"Trusted Contacts"}
            rightIcon={images.rightArrowIcon} />
          <SettingMenue
            title={"Help & Support"}
            rightIcon={images.rightArrowIcon}

          />
          <SettingMenue
            title={"Add Relevant Addresses"}
            rightIcon={images.rightArrowIcon}
          />
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