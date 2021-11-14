import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../Themes/colors";
import commonStyles from "../Themes/commonStyles";
import { images } from "../Assets/Images";
// import constant from "../Utils/ApiConstants";
import { AlertComponent } from "../Utils/Alert";
import Loader from "../Utils/Loader";
// import axios from "axios";
import { phoneScreen } from "../Themes/phoneScreen";
import { useSelector } from "react-redux";
import BiggerButton from "../Component/BiggerButton";
import Preference from "react-native-preference";

const Home = (props) => {

  const [loading, setLoading] = useState(false)
  const state = useSelector(state => state)
  const user = useSelector(state => state.authenticationReducer.user)

  return (
    <View style={{ flex: 1, backgroundColor: state.themeChangeReducer.primaryColor }}>
      <View style={[styles.innerViewStyle2, { backgroundColor: state.themeChangeReducer.secondaryColor }]} >
        <Text style={[styles.headingStyle, { marginTop: Platform.OS === "android" ? 20 : 40, color: state.themeChangeReducer.primaryColor }]}>{"Hello, " + user?.Name + " !"}</Text>
        <Text style={[styles.bodyStyle, { marginTop: 20, color: colors.blackTextColor }]}>{"What do you need?"}</Text>
        {(Preference.get("mode") === "general" || Preference.get("mode") === "quarantine") &&
          <BiggerButton
            buttonStyle={styles.biggerButtonStyle}
            leftImage={images.locationIcon}
            leftImageStyle={styles.lImageStyle}
            rightImage={images.rightArrowIcon}
            rightImageStyle={styles.rImageStyle}
            textViewStyle={{ flex: 1, marginHorizontal: 5 }}
            text={"Verify Your Location"}
            textStyle={[styles.textStyle, { color: state.themeChangeReducer.primaryColor }]}
            text1={"Let authorities know that you are self isolating by sending them your location."}
            text1Style={[styles.text1Style, { color: state.themeChangeReducer.primaryColor }]}
            onPress={() => { props.navigation.navigate("verifyLocation") }}
          />
        }
        {
          Preference.get("mode") === "general" &&
          <View>
            <BiggerButton
              buttonStyle={styles.biggerButtonStyle}
              leftImage={images.requestLocationIcon}
              leftImageStyle={styles.lImageStyle}
              rightImage={images.rightArrowIcon}
              rightImageStyle={styles.rImageStyle}
              textViewStyle={{ flex: 1, marginHorizontal: 5 }}
              text={"Request Someone’s Location"}
              textStyle={[styles.textStyle, { color: state.themeChangeReducer.primaryColor }]}
              text1={"Tap here to ask someone to verify their location."}
              text1Style={[styles.text1Style, { color: state.themeChangeReducer.primaryColor }]}
              onPress={() => { props.navigation.navigate("verifyLocation") }}
            />
            <BiggerButton
              buttonStyle={styles.biggerButtonStyle}
              leftImage={images.contactIcon}
              leftImageStyle={[styles.lImageStyle, { tintColor: state.themeChangeReducer.primaryColor }]}
              rightImage={images.rightArrowIcon}
              rightImageStyle={styles.rImageStyle}
              textViewStyle={{ flex: 1, marginHorizontal: 5 }}
              text={"Trusted Contacts"}
              textStyle={[styles.textStyle, { color: state.themeChangeReducer.primaryColor }]}
              text1={"Add people to your trusted contacts so that they can ask you for verification."}
              text1Style={[styles.text1Style, { color: state.themeChangeReducer.primaryColor }]}
              onPress={() => { props.navigation.navigate("verifyLocation") }}
            />
          </View>
        }
      </View>
      <Loader visible={loading} />
    </View>
  )
}
export default Home;

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
      padding: 30,
    },
  }
)