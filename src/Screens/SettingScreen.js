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
import Preference from 'react-native-preference';
const login = StackActions.replace("OnBoarding",{screen:"Welcom"})
const SettingScreen = (props) => {
  const [loading, setLoading] = useState(false)
  const state = useSelector(state => state)
  const user = useSelector(state => state.authenticationReducer.user)
  const [switchValue, setSwitchValue] = useState(false);
  const [userData,setUserData]= useState(null)
  const dispatch = useDispatch()
  const logOut = () => {
    Preference.clear()
    dispatch(signOut())
    props.navigation.dispatch(login)
  }
  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      getUserDetail()
    });
    return unsubscribe;
  }, [props.navigation]);
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
        if(response.data.code==="1"){
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
    <View style={{ flex: 1, alignItems: "center", backgroundColor: colors.skyBlueColor, borderTopRightRadius: 17, borderTopLeftRadius: 17, marginTop: -20,paddingHorizontal:20 }}>
      <Text style={[{ fontWeight: "700", fontSize: 24, lineHeight: 36, color: colors.blackTextColor, marginTop: 25 }]}>{"User Setting"}</Text>
      <InputField
            placeholder={"Full Name"}
            autoComplete={"name"}
            placeholderTextColor={colors.placeholderColor}
            containerStyle={[commonStyles.inputContainerStyle, { marginTop: 18 }]}
            inputStyle={[commonStyles.inputInnerStyle,{color:colors.blackTextColor}]}
            editable={false}
            // onChangeText={(text) => setFullName(text)}
            value={userData?.name}
          />
          <InputField
            placeholder={"Email"}
            autoComplete={"email"}
            placeholderTextColor={colors.placeholderColor}
            containerStyle={[commonStyles.inputContainerStyle, { marginTop: 18 }]}
            inputStyle={[commonStyles.inputInnerStyle,{color:colors.blackTextColor}]}
            // onChangeText={(text) => setEmail(text)}
            keyboardType={"email-address"}
            value={userData?.email}
            onEndEditing={() => setEmail(email.trim())}
            editable={false}
          />
           <InputField
            placeholder={"Mobile Number"}
            placeholderTextColor={colors.placeholderColor}
            containerStyle={[commonStyles.inputContainerStyle, { marginTop: 18 }]}
            inputStyle={[commonStyles.inputInnerStyle,{color:colors.blackTextColor}]}
            keyboardType={"phone-pad"}
            autoComplete={"tel"}
            value={userData?.phone_no}
            maxLength={10}
            image={images.auFlag}
            imageStyle={{ width: 21, height: 13, resizeMode: "contain" }}
            imageViewStyle={commonStyles.mobileFlagStyle}
            // countryCode={"+61"}
            countryCodeStyle={{ fontSize: 16, color: colors.blackTextColor, fontWeight: "400" }}
            textViewStyle={commonStyles.mobileCountryCodeStyle}
            editable={false}
          />
        {/* <View style={{ width: "100%", alignItems: "flex-end" }}>
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
        </View> */}
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