import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { colors } from "../Themes/colors";
import { images } from "../Assets/Images";
// import constant from "../Utils/ApiConstants";
import { AlertComponent } from "../Utils/Alert";
import Loader from "../Utils/Loader";
// import axios from "axios";
import { phoneScreen } from "../Themes/phoneScreen";
import BiggerButton from "../Component/BiggerButton";
import { useSelector } from "react-redux";

const NotificationScreen = (props) => {
  const [loading, setLoading] = useState(false)
  const state = useSelector(state => state)
  const [listOfItems, setListOfItems] = useState([{ date: "21-7-2021 / 4.00 PM", name: "189 Liverpoool Street, Darlinghust, Sydney NSW", time: "2hr ago", status: true }, { date: "21-7-2021 / 4.00 PM", name: "189 Liverpoool Street, Darlinghust, Sydney NSW", time: "2hr ago", status: true }, { date: "21-7-2021 / 4.00 PM", name: "189 Liverpoool Street, Darlinghust, Sydney NSW", time: "2hr ago", status: true }, { date: "21-7-2021 / 4.00 PM", name: "189 Liverpoool Street, Darlinghust, Sydney NSW", time: "2hr ago", status: false }, { date: "21-7-2021 / 4.00 PM", name: "189 Liverpoool Street, Darlinghust, Sydney NSW", time: "2hr ago", status: true }, { date: "21-7-2021 / 4.00 PM", name: "189 Liverpoool Street, Darlinghust, Sydney NSW", time: "2hr ago", status: true }])
  return (
    <View style={{ flex: 1, backgroundColor: state.themeChangeReducer.primaryColor }}>
      <View style={[styles.innerViewStyle2, { backgroundColor: state.themeChangeReducer.secondaryColor }]} >
        <Text style={[styles.headingStyle, { marginTop: Platform.OS === "android" ? 20 : 40, color: state.themeChangeReducer.primaryColor }]}>{"Notifications"}</Text>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          {listOfItems.length > 0 ?
            <FlatList
              numColumns={1}
              data={listOfItems}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              extraData={{ list: listOfItems }}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={false}
              style={{ flex: 1, width: "100%" }}
              renderItem={({ item, index }) => {
                return (
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
                  />
                )
              }}
            /> :
            <View style={{width:"100%",alignItems:"center"}}>
              <View style={{ height: 110, width: 110, borderRadius: 55, backgroundColor: colors.biggerButtonColor, alignItems: "center" }}>
                
              </View>
              <Image style={styles.headingImageStyle} source={images.noNotificationIcon} />
              <Text style={{ fontSize: 14, fontWeight: "500", textAlign: "center"}} >
                {"Nothing here!!!"}
              </Text>
              <Text style={{ fontSize: 12, fontWeight: "400", textAlign: "center" }} >
                {"Tap the notification setting button below and check again."}
              </Text>
            </View>
          }
        </View>
      </View>
      <Loader visible={loading} />
    </View>
  )
}
export default NotificationScreen;

const styles = StyleSheet.create(
  {

    headingStyle: {
      fontSize: 24,
      fontWeight: "700",
      fontStyle: "normal",
    },
    innerViewStyle2: {
      height: phoneScreen.height * 85 / 100,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      paddingHorizontal: 30
    },
    headingImageStyle: {
      width: 108,
      height: 110,
      resizeMode: "contain",
      marginTop: -80
    },
    headerViewStyle: {
      flexDirection: "row",
      height: "15%",
      backgroundColor: colors.blackTextColor,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center"
    },
    headingImage1Style: {
      width: 11,
      height: 11,
      resizeMode: "contain",
      marginLeft: 5
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
    }
  }
)