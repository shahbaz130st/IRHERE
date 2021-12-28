import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image,Linking,TouchableOpacity } from "react-native";
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
import Header from "../Component/Header";
import SessionDetailItem from "../Component/SessionDetailItem";
import moment from "moment";
const certificateValidation = (props) => {
  let user = useSelector(state => state.authenticationReducer.user)
  const [loading, setLoading] = useState(false)
  const state = useSelector(state => state)
  const [checkBox, setCheckBox] = useState(true)
  const [listOfItems, setListOfItems] = useState([{ date: "21-7-2021 / 4.00 PM", name: "71-77 covet garden  london, ...", time: "2hr ago", status: true }, { date: "21-7-2021 / 4.00 PM", name: "71-77 covet garden  london, ...", time: "2hr ago", status: true }, { date: "21-7-2021 / 4.00 PM", name: "71-77 covet garden  london, ...", time: "2hr ago", status: true }, { date: "21-7-2021 / 4.00 PM", name: "71-77 covet garden  london, ...", time: "2hr ago", status: false }, { date: "21-7-2021 / 4.00 PM", name: "71-77 covet garden  london, ...", time: "2hr ago", status: true }, { date: "21-7-2021 / 4.00 PM", name: "71-77 covet garden  london, ...", time: "2hr ago", status: true }])
  const [quarantine, setQuarantine] = useState(null)
  const [quarantineDay, setQuarantineDay] = useState(0)
  useEffect(() => {
    getUserQuarantinDetail()
  }, [])
  const getUserQuarantinDetail = () => {
    setLoading(true)
    var config = {
      headers: {
        "Content-Type": "multipart/form-data"
      },
    };
    const data = new FormData();
    data.append('user_id', user.id);
    console.log(constant.get_user_list_id, data, config)
    axios
      .post(constant.get_user_list_id, data)
      .then(function (response) {
        setLoading(false)
        console.log(response.data)
        setQuarantine(response.data)
        console.log(response.data.date)
        var given = moment(response.data.date, "YYYY-MM-DD");
        var current = moment().startOf('day');

        //Difference in number of days
        console.log(moment.duration(current.diff(given)).asDays())
        setQuarantineDay(moment.duration(current.diff(given)).asDays() + 1)
      })
      .catch(function (error) {
        setLoading(false)
        console.log(error)
        AlertComponent({ msg: error.message, title: "Error", type: "error" })
      });
  }

  return (
    <View style={[commonStyles.mainViewStyle, { backgroundColor: state.themeChangeReducer.secondaryColor, borderColor: colors.whiteColor, borderWidth: 1 }]}>
      <Header
        leftIcon={images.unboldIcon}
        backIconPress={() => { props.navigation.goBack() }}
        headerText={""} />
      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        <View style={{ height: "40%", backgroundColor: state.themeChangeReducer.primaryColor, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: "5%", alignItems: "center", justifyContent: "space-evenly" }}>
          <Text style={[styles.headingStyle, { color: state.themeChangeReducer.secondaryColor, fontSize: 24, textAlignVertical: "center" }]}>{"Validation Certificate"}</Text>
          <View style={{ height: 22, backgroundColor: "#479597", width: 120, marginTop: 10, borderRadius: 11, alignItems: "center", justifyContent: "center" }}>
            <Text style={[styles.headingStyle, { color: state.themeChangeReducer.secondaryColor, fontSize: 12, textAlignVertical: "center" }]}>{"Success"}</Text>
          </View>
          {
            quarantineDay > quarantine?.quarantine_days ?
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Image source={images.circularTickIcon} style={{ height: 66, width: 66, resizeMode: "contain", marginBottom: 13, tintColor: colors.whiteColor }} />
                <Text style={styles.bodyStyle}>{"You have successfully"}</Text>
                <Text style={styles.bodyStyle}>{"completed your quarantine."}</Text>
              </View> :
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    marginVertical: 5
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <SessionDetailItem
                      label={"Name"}
                      value={user?.Name ? user.Name : ""}
                      valueStyle={{ fontSize: 12, lineHeight: 20 }}
                    />
                  </View>
                  <View style={{ alignItems: "flex-end", width: "50%" }}>
                    <SessionDetailItem
                      label={"Your Quarantine Day"}
                      value={quarantineDay == quarantine?.quarantine_days ? "Day " + quarantineDay + " last Day" : "Day " + quarantineDay}
                      valueStyle={{ fontSize: 12, lineHeight: 20 }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    marginTop: 18
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <SessionDetailItem
                      label={"Verification Date"}
                      value={moment(props?.route?.params?.certificate?.date).format("D MMM, YYYY h:mm A")}
                      valueStyle={{ fontSize: 12, lineHeight: 20 }}
                    />
                  </View>

                  <View style={{ alignItems: "flex-end", width: "50%" }}>
                    <SessionDetailItem
                      numberOfLines={2}
                      label={"You Were At"}
                      value={props?.route?.params?.certificate?.address}
                      valueStyle={{ fontSize: 10, lineHeight: 20 }}
                    />
                  </View>
                </View>
              </View>}
        </View>
        <View style={{ flexDirection: "row", backgroundColor: state.themeChangeReducer.primaryColor, alignItems: "center", justifyContent: "center" }}>
          <View style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: colors.whiteColor }} />
          <View style={{
            height: 1, width: "93%", borderColor: colors.primaryColor,
            borderWidth: 1,
            borderStyle: "dashed",
            borderRadius: 1,
          }} />
          <View style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: colors.whiteColor }} />
        </View>
        <View style={{ height: "45%", backgroundColor: state.themeChangeReducer.primaryColor, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, alignItems: "center", justifyContent: "space-evenly" }}>
          <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => { Linking.openURL(props?.route?.params?.certificate?.url) }}>
            <Image source={images.linkIcon} style={{ height: 14, width: 14, marginRight: 5, tintColor: state.themeChangeReducer.secondaryColor }} />
            <Text style={{
              color: colors.whiteColor,
              fontSize: 14,
              fontWeight: "400"
            }}>{"Open QR Code"}</Text>
          </TouchableOpacity>
          <Image source={{ uri: `data:image/gif;base64,${props?.route?.params?.certificate?.qr}` }} style={{ height: "70%", width: "70%", resizeMode: "contain", borderRadius: 20 }} />
          <Text style={{
            color: colors.whiteColor,
            fontSize: 10,
            fontWeight: "400",
          }}>{"Generated using V&V Technology"}</Text>
        </View>
        <View style={{ marginTop: 20, width: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <View style={{ height: 24, width: 24, borderRadius: 12, borderColor: colors.greyColor, borderWidth: 1, marginRight: 10 }}>
            <Image source={images.tickBlueIcon} style={{ width: "150%", height: "150%", resizeMode: "contain", bottom: 10 }} />
          </View>
          <Text style={[commonStyles.checkLabelStyle, { color: colors.placeholderColor }]}>{"Certificate Successfully Sent"}</Text>
        </View>
      </View>

      {/* <Certificate
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
        /> */}
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
      fontSize: 20,
      fontWeight: "700",
      fontStyle: "normal",
    },
    innerViewStyle2: {
      height: phoneScreen.height * 85 / 100,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      paddingHorizontal: 20,
      // justifyContent: "space-evenly"
      // justifyContent: "center"
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
    bodyStyle: {
      fontSize: 14,
      fontWeight: "400",
      fontStyle: "normal",
      lineHeight: 17.5,
      color: colors.whiteColor
    },
    // headingStyle: {
    //   fontSize: 24,
    //   fontWeight: "700",
    //   fontStyle: "normal",
    // },
  }
)