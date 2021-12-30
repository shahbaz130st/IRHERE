import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity,Linking } from "react-native";
import { colors } from "../Themes/colors";
import { images } from "../Assets/Images";
import constant from "../Utils/ApiConstants";
import Loader from "../Utils/Loader";
import axios from "axios";
import { phoneScreen } from "../Themes/phoneScreen";
import Certificate from "../Component/Certificate";
import moment from "moment";
import { useSelector } from "react-redux";
import { AlertComponent } from "../Utils/Alert";
import SessionDetailItem from "../Component/SessionDetailItem";
import { BottomTab, HeaderHeight, StatusBarHeight } from "../Utils/Dimensions";
import DeviceInfo from 'react-native-device-info';

const HistoryScreen = (props) => {
  const [loading, setLoading] = useState(false)
  const state = useSelector(state => state)
  const user = useSelector(state => state.authenticationReducer.user)
  const [listOfItems, setListOfItems] = useState([/* { date: "21-7-2021 / 4.00 PM", name: "189 Liverpoool Street, Darlinghust, Sydney NSW", time: "2hr ago", status: true }, { date: "21-7-2021 / 4.00 PM", name: "189 Liverpoool Street, Darlinghust, Sydney NSW", time: "2hr ago", status: true }, { date: "21-7-2021 / 4.00 PM", name: "189 Liverpoool Street, Darlinghust, Sydney NSW", time: "2hr ago", status: true }, { date: "21-7-2021 / 4.00 PM", name: "189 Liverpoool Street, Darlinghust, Sydney NSW", time: "2hr ago", status: false }, { date: "21-7-2021 / 4.00 PM", name: "189 Liverpoool Street, Darlinghust, Sydney NSW", time: "2hr ago", status: true }, { date: "21-7-2021 / 4.00 PM", name: "189 Liverpoool Street, Darlinghust, Sydney NSW", time: "2hr ago", status: true } */])
  const [showItem, setShowItem] = useState(false)
  const [item, setItem] = useState(null)
  const [quarantine, setQuarantine] = useState(null)
  const [quarantineDay, setQuarantineDay] = useState(0)
  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      locationVerficationHistory()
      getUserQuarantinDetail()
    });
    props.navigation.addListener("blur", () => {
      setShowItem(false)
    });
    return unsubscribe;
  }, [props.navigation]);
  const getUserQuarantinDetail = () => {
    setLoading(true)
    var config = {
      headers: {
        "Content-Type": "multipart/form-data"
      },
    };
    const data = new FormData();
    data.append('user_id', user.id);
    axios
      .post(constant.get_user_list_id, data)
      .then(function (response) {
        // setLoading(false)
        setQuarantine(response.data)
        var given = moment(response.data.date, "YYYY-MM-DD");
        var current = moment().startOf('day');

        //Difference in number of days
        setQuarantineDay(moment.duration(current.diff(given)).asDays() + 1)
      })
      .catch(function (error) {
        setLoading(false)
        console.log(error)
        AlertComponent({ msg: error.message, title: "Error", type: "error" })
      });
  }
  const locationVerficationHistory = () => {
    setLoading(true)
    var config = {
      headers: {
        "Content-Type": "multipart/form-data"
      },
    };
    const data = new FormData();
    data.append('user_id', user.id);
    console.log(constant.get_certificate_list_id, data, config)
    axios
      .post(constant.get_certificate_list_id, data)
      .then(function (response) {

        let tempArray = response.data, certificateArray = [];
        for (let i = 0; i < tempArray.length; i++) {
          // console.log(tempArray[i].status,tempArray[i].true_status)
          if (((tempArray[i].status === "True" || tempArray[i].status === true || tempArray[i].status === "true") && (tempArray[i].true_status === "True" || tempArray[i].true_status === true || tempArray[i].true_status === "true")) || ((tempArray[i].status === "False" || tempArray[i].status === false || tempArray[i].status === "false") && (tempArray[i].true_status === "False" || tempArray[i].true_status === false || tempArray[i].true_status === "false"))) {
            //  if(tempArray[i].date.unix()>tempArray[i+1].date.unix()){
            certificateArray.push(tempArray[i])
            //  }
          }
        }
        setListOfItems(certificateArray.reverse())
        setLoading(false)
      })
      .catch(function (error) {
        setLoading(false)
        console.log(error)
        AlertComponent({ msg: error.message, title: "Error", type: "error" })
      });
  }
  const FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          marginHorizontal: 20,
          backgroundColor: "#E5E5E5",
        }}
      />
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: state.themeChangeReducer.secondaryColor }}>
      <View style={{ height: 75, width: "100%", backgroundColor: state.themeChangeReducer.primaryColor }} />
      <View style={{ flex: 1, alignItems: "center", backgroundColor: colors.skyBlueColor, borderTopRightRadius: 17, borderTopLeftRadius: 17, marginTop: -20 }}>
        <Text style={[{ fontWeight: "700", fontSize: 24, lineHeight: 36, color: colors.blackTextColor, marginTop: 25 }]}>{"Recent Validations"}</Text>
        <View style={{ flexDirection: "row", backgroundColor: state.themeChangeReducer.secondaryColor, height: 47, width: "90%", marginTop: 16, borderRadius: 6 }}>
          <View style={{ width: "25%", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 14, fontWeight: "500", textAlign: "center", color: state.themeChangeReducer.primaryColor }}>
              {"Date"}
            </Text>
          </View>
          <View style={{ width: "25%", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 14, fontWeight: "500", textAlign: "center", color: state.themeChangeReducer.primaryColor }} >
              {"Location"}
            </Text>
          </View>
          <View style={{ width: "25%", alignItems: "center", /* alignItems: "flex-end", */ justifyContent: "center", paddingRight: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: "500", textAlign: "center", color: state.themeChangeReducer.primaryColor }} >
              {"Status"}
            </Text>
          </View>
          <View style={{ width: "25%", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 14, fontWeight: "500", textAlign: "center", color: state.themeChangeReducer.primaryColor }} >
              {"Action"}
            </Text>
          </View>
        </View>
        {
          listOfItems.length > 0 ?
            <FlatList
              numColumns={1}
              data={listOfItems}
              ItemSeparatorComponent={({ item, index }) => {
                return (<FlatListItemSeparator />)
              }
              }
              extraData={{ list: listOfItems }}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => {
                return item.id
              }}
              style={{ flex: 1, width: "90%", paddingTop: 6, marginBottom: 18 }}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity style={{ flexDirection: "row", paddingVertical: 10 }} disabled={true}/* onPress={() => { setShowItem(true) }} */>
                    <View style={{ width: "25%", alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ fontSize: 12, fontWeight: "400", textAlign: "center", color: colors.blackTextColor }}>
                        {moment(item.date).format("D MMM YYYY")}
                      </Text>
                      <Text style={{ fontSize: 12, fontWeight: "400", textAlign: "center", color: colors.blackTextColor }}>
                        {moment(item.date).format("h:mm A")}
                      </Text>
                    </View>
                    <View style={{ width: "25%", alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ fontSize: 12, fontWeight: "400", textAlign: "center", color: state.themeChangeReducer.primaryColor }} >
                        {item.address}
                      </Text>
                    </View>
                    <View style={{ width: "25%", alignItems: "center", justifyContent: "center" }}>
                      <View style={{ height: 20, width: "70%", backgroundColor: (item.status === "True" || item.status === true || item.status === "true") && (item.true_status === "True" || item.true_status === true || item.true_status === "true") ? colors.greanColor : colors.redColor, alignItems: "center", justifyContent: "center", borderRadius: 3 }}>
                        <Text style={{ fontSize: 12, fontWeight: "600", color: state.themeChangeReducer.secondaryColor }}>{(item.status === "True" || item.status === true || item.status === "true") && (item.true_status === "True" || item.true_status === true || item.true_status === "true") ? "Verified" : "Unverified"}</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={{ width: "25%", alignItems: "center", justifyContent: "center" }} onPress={() => {
                      setItem(item)
                      setShowItem(true)
                    }}>
                      <Image style={styles.headingImageStyle} source={images.certificateItem} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                )
              }}
            /> :
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>{"No Record Found"}</Text>
            </View>

        }
      </View>
      {showItem &&
        <View style={{ flex: 1, paddingHorizontal: 24, position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: colors.whiteColor/* "#090A0A36" */, alignItems: "center", justifyContent: "center", width: phoneScreen.width }}
          onPress={() => setShowItem(false)}>
          <View style={{ width: "100%", alignItems: "flex-end", }}>
            <TouchableOpacity style={{ paddingTop: StatusBarHeight }}
              onPress={() => setShowItem(false)}>
              <Image style={{ height: 20, width: 20, resizeMode: "cover" }} source={images.crossIcon} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, width: "100%", justifyContent: "center" }}>
            <View style={{ width: "100%", height: "40%", backgroundColor: state.themeChangeReducer.primaryColor, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: "5%", alignItems: "center", justifyContent: "space-evenly" }}>
              <Text style={[styles.headingStyle, { color: state.themeChangeReducer.secondaryColor, fontSize: 24, textAlignVertical: "center" }]}>{"Validation Certificate"}</Text>
              <View style={{ height: 22, backgroundColor: (item.status === "True" || item.status === true || item.status === "true") && (item.true_status === "True" || item.true_status === true || item.true_status === "true") ? "#479597" : colors.redColor, width: 120, marginTop: 10, borderRadius: 11, alignItems: "center", justifyContent: "center" }}>
                <Text style={[styles.headingStyle, { color: state.themeChangeReducer.secondaryColor, fontSize: 12, textAlignVertical: "center" }]}>{(item.status === "True" || item.status === true || item.status === "true") && (item.true_status === "True" || item.true_status === true || item.true_status === "true") ? "Success" : "Failure"}</Text>
              </View>

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
                      value={item?.name ? item?.name : ""}
                      valueStyle={{ fontSize: 12, lineHeight: 20 }}
                    />
                  </View>
                  <View style={{ alignItems: "flex-end", width: "50%" }}>
                    <SessionDetailItem
                      label={"Your Quarantine Day"}
                      value={moment.duration(moment(item?.date, "YYYY-MM-DD").diff(moment(item?.quarantine_date, "YYYY-MM-DD"))).asDays()+1}
                      valueStyle={{ fontSize: 12, lineHeight: 20 }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    marginVertical: 5
                  }}
                >
                  <View style={{ flex: 1 }}>

                    <SessionDetailItem
                      label={"Verification Date"}
                      value={moment(item?.date).format("D MMM, YYYY h:mm A")}
                      valueStyle={{ fontSize: 12, lineHeight: 20 }}
                    />
                  </View>

                  <View style={{ alignItems: "flex-end", width: "50%" }}>
                    <SessionDetailItem
                      numberOfLines={2}
                      label={"You Were At"}
                      value={item?.address}
                      valueStyle={{ fontSize: 10, lineHeight: 20 }}
                    />
                  </View>
                </View>
              </View>

            </View>
            <View style={{ flexDirection: "row", backgroundColor: state.themeChangeReducer.primaryColor, alignItems: "center", justifyContent: "center" }}>
              <View style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: colors.whiteColor, marginLeft: -6 }} />
              <View style={{
                flex: 1,
                height: 1, borderColor: colors.primaryColor,
                borderWidth: 1,
                borderStyle: "dashed",
                borderRadius: 1,
              }} />
              <View style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: colors.whiteColor, marginRight: -6 }} />
            </View>
            <View style={{ height: "50%", backgroundColor: state.themeChangeReducer.primaryColor, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
              <TouchableOpacity style={{flexDirection:"row",alignItems:"center"}} onPress={()=>{Linking.openURL(item.url)}}>
                <Image source={images.linkIcon} style={{height:14,width:14,marginRight:5,tintColor:state.themeChangeReducer.secondaryColor}}/>
                <Text style={{
                  color: colors.whiteColor,
                  fontSize: 14,
                  fontWeight: "400"
                }}>{"Open QR Code"}</Text>
              </TouchableOpacity>

              <Image source={{ uri: `data:image/gif;base64,${item.qr}` }} style={{ height: "70%", width: "70%", resizeMode: "contain", borderRadius: 20 }} />
              <Text style={{
                color: colors.whiteColor,
                fontSize: 14,
                fontWeight: "400"
              }}>{"Generated using V&V Technology"}</Text>
            </View>
          </View>
        </View>
      }
      <Loader visible={loading} />
    </View>
  )
}
export default HistoryScreen;

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

    },
    headingImageStyle: {
      width: 20,
      height: 20,
      resizeMode: "contain",
      tintColor: colors.primaryColor
    },
    headerViewStyle: {
      flexDirection: "row",
      backgroundColor: colors.blackTextColor,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10
    },
    headingImage1Style: {
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
  }
)