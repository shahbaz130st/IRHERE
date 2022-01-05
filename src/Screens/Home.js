import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image,AppState } from "react-native";
import { colors } from "../Themes/colors";
import commonStyles from "../Themes/commonStyles";
import { images } from "../Assets/Images";
import constant from "../Utils/ApiConstants";
import { AlertComponent } from "../Utils/Alert";
import Loader from "../Utils/Loader";
import axios from "axios";
import { phoneScreen } from "../Themes/phoneScreen";
import { useSelector } from "react-redux";
import BiggerButton from "../Component/BiggerButton";
import HomeButton from "../Component/HomeButton";
import Preference from "react-native-preference";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { StatusBarHeight, BottomTab } from "../Utils/Dimensions";
import DeviceInfo from 'react-native-device-info';
import moment from "moment";
import messaging from '@react-native-firebase/messaging';

let date = ""
const Home = (props) => {

  const [loading, setLoading] = useState(false)
  const state = useSelector(state => state)
  const user = useSelector(state => state.authenticationReducer.user)
  const [quarantine, setQuarantine] = useState(null)
  const [endDate, setEndDate] = useState(new Date())
  const [quarantineDay, setQuarantineDay] = useState(0)
  const [showNotification,setShowNotification] = useState("0") 
  useEffect(() => {
    messaging().onMessage(async remoteMessage => {
      checkPendingVerifications()

  });
    const unsubscribe = props.navigation.addListener("focus", () => {
      getUserQuarantinDetail()
      checkPendingVerifications()
    });
    return unsubscribe;
  }, [props.navigation]);
  useEffect(()=>{
    AppState.addEventListener('change', async (state) => {
      if (state === 'active') {
        checkPendingVerifications()
        }
    })
  },[]

  )
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
        var given = moment(response.data.date, "YYYY-MM-DD");
        var current = moment().startOf('day');
        //Difference in number of days
        setQuarantineDay(moment.duration(current.diff(given)).asDays()+1)
        let startdate = moment(response.data.date).format("DD.MM.YYYY");
        var new_date = moment(startdate, "DD.MM.YYYY");
        setEndDate(new_date.add(response.data.quarantine_days, 'days'))
        console.log(date)
      })
      .catch(function (error) {
        setLoading(false)
        console.log(error)
        AlertComponent({ msg: error.message, title: "Error", type: "error" })
      });
  }

  const checkPendingVerifications = () => {
    setLoading(true)
    var config = {
      headers: {
        "Content-Type": "multipart/form-data"
      },
    };
    const data = new FormData();
    data.append('user_id', user.id);
    console.log(constant.check_pending_verifications, data, config)
    axios
      .post(constant.check_pending_verifications, data)
      .then(function (response) {
        setLoading(false)
        console.log(response.data)
        setShowNotification(response.data.code)
      })
      .catch(function (error) {
        setLoading(false)
        console.log(error)
        AlertComponent({ msg: error.message, title: "Error", type: "error" })
      });
  }
  return (
    <View style={styles.mainViewStyle}>
      <View style={[styles.innerViewStyle1, { backgroundColor: state.themeChangeReducer.primaryColor }]}>
        <View style={{ marginTop: DeviceInfo.hasNotch() ? StatusBarHeight + 35 : StatusBarHeight }}>
          <Text style={[{ fontSize: 16, fontWeight: "500", color: state.themeChangeReducer.secondaryColor }]}>{"Good Afternoon,"}</Text>
          <Text style={[styles.headingStyle, { color: state.themeChangeReducer.secondaryColor }]}>{user?.Name}</Text>
        </View>
      </View>
      <View style={[styles.innerViewStyle2, { backgroundColor: colors.skyBlueColor }]} >
        <KeyboardAwareScrollView contentContainerStyle={{
          flexGrow: 1, width: "100%", paddingTop: 27, borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingBottom: 24
        }} showsVerticalScrollIndicator={false} >
          <View style={{ alignItems: "center",width: "100%" }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 5 }}>
              <Text style={{ fontSize: 18, fontWeight: "700" }}>{"You are now in Quarantine"}</Text>
              <Image style={styles.headingImageStyle} source={images.greenCheckIcon} />
            </View>
            <Text style={styles.bodyStyle}>{"You are all set for now! We will randomly send"}</Text>
            <Text style={styles.bodyStyle}>{"you electronic doorbell, Make sure you respond"}</Text>
            <Text style={styles.bodyStyle}>{"to them in time to prove that you are staying at"}</Text>
            <Text style={styles.bodyStyle}>{"your quarantine address during the period of"}</Text>
            <Text style={styles.bodyStyle}>{"your quarantine."}</Text>
            {showNotification==="1"&&
            <View style={{paddingHorizontal:24}}>
            <BiggerButton
              buttonStyle={styles.biggerButtonStyle}
              leftImage={images.bellIcon}
              leftImageStyle={styles.lImageStyle}
              rightImage={images.rightArrowIcon}
              rightImageStyle={styles.rImageStyle}
              textViewStyle={{ flex: 1, marginHorizontal: 5 }}
              text={"Verify Your Location"}
              textStyle={[styles.textStyle, { color: state.themeChangeReducer.secondaryColor }]}
              text1={"You have received a doorbell to verify your location. You have 20 minutes to respond."}
              text1Style={[styles.text1Style, { color: state.themeChangeReducer.secondaryColor }]}
              onPress={() => { props.navigation.navigate('verifyLocation') }}
            />
            </View>
          }
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: quarantineDay > quarantine?.quarantine_days ? "center" : "flex-start", marginTop: 25, width: "100%", paddingHorizontal: quarantineDay > quarantine?.quarantine_days ? 0 : 24 }}>
              <Text style={{ fontSize: 20, fontWeight: "700" }}>{"Quarantine Status"}</Text>
              <View style={{ height: 13, width: 13, borderRadius: 6.5, marginTop: 5, marginLeft: 5, alignItems: "center", justifyContent: "center", borderColor: state.themeChangeReducer.primaryColor, borderWidth: 1, paddingBottom: 3 }}>
                <Text style={{ color: state.themeChangeReducer.primaryColor, fontSize: 10 }}>{"i"}</Text>
              </View>
            </View>
          </View>
       

          {
            quarantineDay > quarantine?.quarantine_days ?
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Image source={images.circularTickIcon} style={{ height: 66, width: 66, resizeMode: "contain", marginBottom: 13 }} />
                <Text style={styles.bodyStyle}>{"You have successfully"}</Text>
                <Text style={styles.bodyStyle}>{"completed your quarantine."}</Text>
              </View> :

              <View style={{ width: "100%",paddingHorizontal:24 }} >
                <HomeButton
                  buttonStyle={[commonStyles.WhiteButtonStyle, { backgroundColor: state.themeChangeReducer.secondaryColor }]}
                  leftImageViewStyle={[commonStyles.leftImageViewStyle, { backgroundColor: state.themeChangeReducer.primaryColor }]}
                  leftImage={images.quarantineDayIcon}
                  leftImageStyle={commonStyles.lWhiteImageStyle}
                  textViewStyle={{ flex: 1, marginHorizontal: 5 }}
                  text={"Your Quarantine Day"}
                  textStyle={[commonStyles.textStyle, { color: state.themeChangeReducer.primaryColor }]}
                  text1={quarantineDay == quarantine?.quarantine_days ? "Day " + quarantineDay + " last Day" : "Day " + quarantineDay}
                  text1Style={[commonStyles.text1Style, { color: colors.blackTextColor }]}
                />
                <HomeButton
                  buttonStyle={[commonStyles.WhiteButtonStyle, { backgroundColor: state.themeChangeReducer.secondaryColor }]}
                  leftImageViewStyle={[commonStyles.leftImageViewStyle, { backgroundColor: state.themeChangeReducer.primaryColor }]}
                  leftImage={images.calendarIcon}
                  leftImageStyle={commonStyles.lWhiteImageStyle}
                  textViewStyle={{ flex: 1, marginHorizontal: 5 }}
                  text={"Quarantine End Date"}
                  textStyle={[commonStyles.textStyle, { color: state.themeChangeReducer.primaryColor }]}
                  text1={moment(endDate).format("D MMM YYYY")}
                  text1Style={[commonStyles.text1Style, { color: colors.blackTextColor }]}
                />
                <HomeButton
                  buttonStyle={[commonStyles.WhiteButtonStyle, { backgroundColor: state.themeChangeReducer.secondaryColor }]}
                  leftImageViewStyle={[commonStyles.leftImageViewStyle, { backgroundColor: state.themeChangeReducer.primaryColor }]}
                  leftImage={images.homeLocationIcon}
                  leftImageStyle={commonStyles.lWhiteImageStyle}
                  textViewStyle={{ flex: 1, marginHorizontal: 5 }}
                  text={"Quarantine Address"}
                  textStyle={[commonStyles.textStyle, { color: state.themeChangeReducer.primaryColor }]}
                  text1={quarantine?.address === "" ? "No address" : quarantine?.address}
                  text1Style={[commonStyles.text1Style, { color: colors.blackTextColor }]}
                />
              </View>
          }

        </KeyboardAwareScrollView>
      </View>
      <Loader visible={loading} />
    </View>
  )
}
export default Home;

const styles = StyleSheet.create(
  {
    mainViewStyle: {
      flex: 1,
      backgroundColor: colors.skyBlueColor
    },
    innerViewStyle1: {
      height: phoneScreen.height * 20 / 100,
      backgroundColor: colors.primaryColor,
      paddingHorizontal: 24
    },
    biggerButtonStyle: {
      flexDirection: "row",
      height: 78,
      width: "100%",
      backgroundColor: colors.redTextColor,
      borderRadius: 16,
      marginTop: 25,
      alignItems: "center",
      paddingHorizontal: 10,
      justifyContent: "space-between"
    },
    lImageStyle: {
      height: 24,
      width: 24,
      resizeMode: "contain",
      tintColor: colors.whiteColor,
      marginRight: 10
    },
    rImageStyle: {
      height: 15,
      width: 15,
      resizeMode: "contain",
      tintColor: colors.whiteColor
    },
    textStyle: {
      fontSize: 14,
      fontWeight: "500",
      fontStyle: "normal",
    },
    text1Style: {
      fontSize: 12,
      fontWeight: "400",
      fontStyle: "normal",
    },
    imageStyle: {
      resizeMode: "contain",
      height: 90.18,
      width: "80%"
    },
    headingStyle: {
      fontSize: 21,
      fontWeight: "700",
      fontStyle: "normal",
    },
    bodyStyle: {
      fontSize: 14,
      fontWeight: "400",
      fontStyle: "normal",
      lineHeight: 17.5
    },
    innerViewStyle2: {
      height: DeviceInfo.hasNotch() ? phoneScreen.height * 80 / 100 - BottomTab.notchHeight + 18 : Platform.OS === "ios" ? phoneScreen.height * 80 / 100 - BottomTab.ios + 18 : phoneScreen.height * 80 / 100 - BottomTab.android + 18,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginTop: -20
    },
    headingImageStyle: {
      width: 12,
      height: 12,
      resizeMode: "contain",
      marginLeft: 5,
      marginTop: 5
    },
  }
)