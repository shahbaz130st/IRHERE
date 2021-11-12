import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { colors } from "../Themes/colors";
import ModalOpenField from "../Component/modalOpenField";
import Button from "../Component/Button";
import commonStyles from "../Themes/commonStyles";
import { images } from "../Assets/Images";
// import constant from "../Utils/ApiConstants";
import { AlertComponent } from "../Utils/Alert";
import Loader from "../Utils/Loader";
import CustomCheckBox from "../Component/CustomCheckBox";
// import axios from "axios";
import { StackActions } from "@react-navigation/native";
import { phoneScreen } from "../Themes/phoneScreen";
import Certificate from "../Component/Certificate";

const mainApp = StackActions.replace("DrawerGroup")
import { useSelector } from "react-redux";

const HistoryScreen = (props) => {
  const [verification, setVerification] = useState("")
  const [loading, setLoading] = useState(false)
  const state = useSelector(state => state)
  const [listOfItems, setListOfItems] = useState([{ date: "21-7-2021 / 4.00 PM", name: "189 Liverpoool Street, Darlinghust, Sydney NSW", time: "2hr ago", status: true }, { date: "21-7-2021 / 4.00 PM", name: "189 Liverpoool Street, Darlinghust, Sydney NSW", time: "2hr ago", status: true }, { date: "21-7-2021 / 4.00 PM", name: "189 Liverpoool Street, Darlinghust, Sydney NSW", time: "2hr ago", status: true }, { date: "21-7-2021 / 4.00 PM", name: "189 Liverpoool Street, Darlinghust, Sydney NSW", time: "2hr ago", status: false }, { date: "21-7-2021 / 4.00 PM", name: "189 Liverpoool Street, Darlinghust, Sydney NSW", time: "2hr ago", status: true }, { date: "21-7-2021 / 4.00 PM", name: "189 Liverpoool Street, Darlinghust, Sydney NSW", time: "2hr ago", status: true }])
  const [showItem, setShowItem] = useState(false)
  FlatListItemSeparator = () => {
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
    <View style={{ flex: 1, backgroundColor: state.themeChangeReducer.primaryColor }}>
      <View style={[styles.innerViewStyle2, { backgroundColor: state.themeChangeReducer.secondaryColor }]} >
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text style={[styles.headingStyle, { marginTop: Platform.OS === "android" ? 10 : 40, color: state.themeChangeReducer.primaryColor }]}>{"Your Verification History"}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", backgroundColor: state.themeChangeReducer.primaryColor, height: 47, borderTopLeftRadius: 12, borderTopRightRadius: 12, marginTop: 20 }}>
            <View style={{ width: "25%", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 14, fontWeight: "400", textAlign: "center", color: state.themeChangeReducer.secondaryColor }}>
                {"Date"}
              </Text>
            </View>
            <View style={{ width: "25%", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 14, fontWeight: "400", textAlign: "center", color: state.themeChangeReducer.secondaryColor }} >
                {"Location"}
              </Text>
            </View>
            <View style={{ width: "25%", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 14, fontWeight: "400", textAlign: "center", color: state.themeChangeReducer.secondaryColor }} >
                {"Status"}
              </Text>
            </View>
            <View style={{ width: "25%", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 14, fontWeight: "400", textAlign: "center", color: state.themeChangeReducer.secondaryColor }} >
                {"Action"}
              </Text>
            </View>
          </View>
          <FlatList
            numColumns={1}
            data={listOfItems}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            ItemSeparatorComponent={() => <FlatListItemSeparator />}
            extraData={{ list: listOfItems }}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={false}
            style={{ flex: 1, width: "100%" }}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity style={{ flexDirection: "row", paddingVertical: 10 }} onPress={() => { setShowItem(true) }}>
                  <View style={{ width: "25%", alignItems: "center", justifyContent: "center", paddingHorizontal: 15 }}>
                    <Text style={{ fontSize: 10, fontWeight: "400", textAlign: "center", color: colors.blackTextColor }}>
                      {item.date}
                    </Text>
                  </View>
                  <View style={{ width: "25%", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 10, fontWeight: "400", textAlign: "center", color: state.themeChangeReducer.primaryColor }} >
                      {item.name}
                    </Text>
                  </View>
                  <View style={{ width: "25%", alignItems: "center", justifyContent: "center" }}>
                    <View style={{ height: 20, width: "60%", backgroundColor: item.status ? colors.greanColor : colors.redColor, alignItems: "center", justifyContent: "center", borderRadius: 3 }}>
                      <Text style={{ fontSize: 10, fontWeight: "400", color: state.themeChangeReducer.secondaryColor }}>{item.status ? "Verified" : "Unverified"}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={{ width: "25%", alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                    <Image style={styles.headingImageStyle} source={images.optionIcon} />
                  </TouchableOpacity>
                </TouchableOpacity>
              )
            }}
          />
        </View>
      </View>
      {showItem &&
        <View style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "#090A0A36", alignItems: "center", justifyContent: "center", width: phoneScreen.width }}>
          <Certificate
            outerViewStyle={{ height: Platform.OS === "android" ? phoneScreen.height * 35 / 100 : phoneScreen.height * 25 / 100, width: phoneScreen.width * 90 / 100 }}
            headerViewStyle={styles.headerViewStyle}
            headingText={"Certificate of validation - Location"}
            headingTextStyle={[styles.headingStyle, { color: state.themeChangeReducer.secondaryColor }]}
            headingImage={images.greenCheckIcon}
            headingImageStyle={styles.headingImage1Style}
            bodyViewStyle={{
              height: "85%",
              borderRadius: 8,
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
            bodyText={"This is certify that\n“John Doe”\n\nwas located at\n71-77 covet garden  london, United kingdom\n\non\n21-7-2021 / 4.00 PM"}
          />
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
      width: 4,
      height: 16,
      resizeMode: "contain",
      marginLeft: 5
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
    }
  }
)