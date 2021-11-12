import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { colors } from "../Themes/colors";
import Button from "../Component/Button";
import commonStyles from "../Themes/commonStyles";
import { images } from "../Assets/Images";
import constant from "../Utils/ApiConstants";
import { AlertComponent } from "../Utils/Alert";
import Loader from "../Utils/Loader";
import axios from "axios";
import { phoneScreen } from "../Themes/phoneScreen";
import { useSelector } from "react-redux";
import Certificate from "../Component/Certificate";
import Preference from "react-native-preference";

const certificateValidation = (props) => {
  let user = useSelector(state => state.authenticationReducer.user)
  const [loading, setLoading] = useState(false)
  const state = useSelector(state => state)
  const [listOfItems, setListOfItems] = useState([{ date: "21-7-2021 / 4.00 PM", name: "71-77 covet garden  london, ...", time: "2hr ago", status: true }, { date: "21-7-2021 / 4.00 PM", name: "71-77 covet garden  london, ...", time: "2hr ago", status: true }, { date: "21-7-2021 / 4.00 PM", name: "71-77 covet garden  london, ...", time: "2hr ago", status: true }, { date: "21-7-2021 / 4.00 PM", name: "71-77 covet garden  london, ...", time: "2hr ago", status: false }, { date: "21-7-2021 / 4.00 PM", name: "71-77 covet garden  london, ...", time: "2hr ago", status: true }, { date: "21-7-2021 / 4.00 PM", name: "71-77 covet garden  london, ...", time: "2hr ago", status: true }])
  useEffect(() => {
    listOfCertificates()
  }, [])
  const listOfCertificates = () => {
    setLoading(true)
    var config = {
      headers: {
        "Content-Type": "multipart/form-data"
      },
    };
    const data = new FormData();
    data.append('user_id', user.id);
    console.log(constant.get_certificate_list, data)
    axios
      .post(constant.get_certificate_list, data, config)
      .then(function (response) {
        setLoading(false)
        const propertyValues = Object.values(response.data);
        console.log(propertyValues.length)
        setListOfItems(propertyValues)
      })
      .catch(function (error) {
        setLoading(false)
        console.log(error)
        AlertComponent({ msg: error.message })
      });
  }


  return (
    <View style={{ flex: 1, backgroundColor: state.themeChangeReducer.primaryColor }}>
      <View style={[styles.innerViewStyle2, { backgroundColor: state.themeChangeReducer.secondaryColor }]} >
        <Certificate
          outerViewStyle={{ height: Platform.OS === "android" ? phoneScreen.height * 35 / 100 : phoneScreen.height * 25 / 100, }}
          headerViewStyle={[styles.headerViewStyle, { height: "20%" }]}
          headingText={"Certificate of validation - Location"}
          headingTextStyle={[styles.headingStyle, { color: state.themeChangeReducer.secondaryColor }]}
          headingImage={images.greenCheckIcon}
          headingImageStyle={styles.headingImageStyle}
          bodyViewStyle={{
            height: "80%",
            backgroundColor: state.themeChangeReducer.secondaryColor, justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,

            elevation: 4,
          }}
          bodyTextStyle={{ fontSize: 13, fontWeight: "400", textAlign: "center" }}
          bodyText={"This is certify that\n“" + user.Name + "”\n\nwas located at\n" +  props?.route?.params?.certificate?.address + "\n\non\n"+props?.route?.params?.certificate?.date}
          bodyQr={props?.route?.params?.certificate?.qr}
        />
        <View style={[styles.headerViewStyle, { height: 20, backgroundColor: colors.secondaryColor, marginVertical: 10 }]}>
          <Text style={[styles.headingStyle, { color: colors.blackTextColor }]}>{"Certificate Sent Successfully."}</Text>
          <Image style={styles.headingImageStyle} source={images.greenCheckIcon} />
        </View>
        {
          Preference.get("mode") === "general" &&
          <View>
            <Button
              isButton
              buttonStyle={[commonStyles.buttonStyle, { backgroundColor: state.themeChangeReducer.primaryColor, marginTop: 0, paddingHorizontal: 10 }, commonStyles.shadowStyle]}
              button1Style={[commonStyles.buttonStyle, { backgroundColor: state.themeChangeReducer.secondaryColor, marginTop: 0, width: "25%", height: "60%", borderRadius: 5 }]}
              textStyle={[commonStyles.textStyle, { fontSize: 13, fontWeight: "500" }]}
              text={"Send Certificate again"}
              text1={"Send"}
              text1Style={[commonStyles.textStyle, { fontSize: 13, fontWeight: "500", color: colors.blackTextColor }]}
            />
            <Button
              isButton
              buttonStyle={[commonStyles.buttonStyle, { backgroundColor: state.themeChangeReducer.primaryColor, marginTop: 10, paddingHorizontal: 10 }, commonStyles.shadowStyle]}
              button1Style={[commonStyles.buttonStyle, { backgroundColor: state.themeChangeReducer.secondaryColor, marginTop: 0, width: "25%", height: "60%", borderRadius: 5 }]}
              textStyle={[commonStyles.textStyle, { fontSize: 13, fontWeight: "500" }]}
              text={"Send someone else"}
              text1={"Send"}
              text1Style={[commonStyles.textStyle, { fontSize: 13, fontWeight: "500", color: colors.blackTextColor }]}
            />
          </View>
        }
        <Certificate
          list
          outerViewStyle={{ height: Platform.OS === "android" ? phoneScreen.height * 35 / 100 : phoneScreen.height * 20 / 100, }}
          headerViewStyle={styles.headerViewStyle}
          headingText={"Certificate of validation - Location"}
          headingTextStyle={[styles.headingStyle, { color: state.themeChangeReducer.secondaryColor }]}
          headingImage={images.greenCheckIcon}
          headingImageStyle={styles.headingImageStyle}
          bodyViewStyle={{
            height: "70%",
            backgroundColor: state.themeChangeReducer.secondaryColor, justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.23,
            shadowRadius: 2.62,

            elevation: 4,
          }}
          listOfItems={listOfItems}
        />


      </View>
      <Loader visible={loading} />
    </View>
  )
}
export default certificateValidation;

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
    imageStyle: {
      resizeMode: "contain",
      height: "40%",
    },
    headingStyle: {
      fontSize: 14,
      fontWeight: "700",
      fontStyle: "normal",
    },
    innerViewStyle2: {
      height: phoneScreen.height * 85 / 100,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      paddingHorizontal: 20,
      justifyContent: "space-evenly"
    },
    headerViewStyle: {
      flexDirection: "row",
      height: "20%",
      backgroundColor: colors.blackTextColor,
      borderRadius: 6,
      alignItems: "center",
      justifyContent: "center"
    },
    headingImageStyle: {
      width: 11,
      height: 11,
      resizeMode: "contain",
      marginLeft: 5
    },
    // headingStyle: {
    //   fontSize: 24,
    //   fontWeight: "700",
    //   fontStyle: "normal",
    // },
  }
)