import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import { colors } from "../Themes/colors";
import { images } from "../Assets/Images/index";
import commonStyles from "../Themes/commonStyles";
import AvatarComponent from "../Component/AvatarComponent";
import {useSelector} from "react-redux";
export default function Drawer(props) {
  const { navigation } = props;
  const user = useSelector(state => state.authenticationReducer.user)
  const DrawerItem = props => {
    const { navigation, route, title, icon, iconStyle } = props;
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          if (route !== "") {
            if (route == "Logout") {
              Alert.alert(
                "",
                "Are you sure you want to logout?",
                [
                  {
                    text: "Ok",
                    onPress: () => {
                      navigation.closeDrawer();
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
            }
            else {
              navigation.closeDrawer();
              navigation.navigate(route);
            }
          }
          else {
            navigation.closeDrawer()
          }
        }}
      >
        <View
          style={{
            flexDirection: "row",
            height: 32,
            width: 232,
          }}
        >
          <View style={{ height: 32, width: 48, alignItems: "flex-start", justifyContent: "center" }}>
            <Image style={iconStyle} source={icon} resizeMode="contain" />
          </View>

          <View style={{ width: 184, height: 35, backgroundColor: colors.inputField, justifyContent: "center", }}>
            <Text style={styles.textStyle}>{title}</Text>
          </View>

        </View>

      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <LinearGradient
        start={{ x: 1.0, y: 0.0 }}
        end={{ x: 1.2, y: 1.0 }}
        colors={[
          colors.gradient1,
          "#D1ADB6",
          "#9DF1F1"
        ]}
        style={{ height: 160, width: "100%", borderBottomLeftRadius: 36, borderBottomRightRadius: 36 }}>
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1111, alignItems: "center" }}>
          <Text style={{ fontWeight: "700", fontSize: 25, lineHeight: 30, color: colors.whiteColor, marginTop: 35 }}>{user?.fullname ? user.fullname : "Rick Anderson"}</Text>
        </View>
      </LinearGradient>

      <View style={[commonStyles.shadowStyle, { height: 128, width: 128, borderRadius: 64, borderWidth: 18, borderColor: colors.whiteColor, marginTop: -64 }]}>
        <AvatarComponent
          style={{ height: "100%", width: "100%", borderRadius: 45, }}
          imageStyle={{ height: "100%", width: "100%", resizeMode: "cover", borderRadius: 45 }}
          defaultSource={images.imagePlaceholder}
          source={user?.avatar ? user.avatar : null}
        />
        {/* <Image style={{ height: "100%", width: "100%", resizeMode: "contain", borderRadius: 45 }} source={images.imagePlaceholder} /> */}
      </View>
      <View style={{ marginTop: 50 }}>
        <DrawerItem
          navigation={navigation}
          route={"Rider"}
          title={"Rider"}
          icon={images.ride}
          iconStyle={{ height: 32, width: 32, resizeMode: "contain" }}
        />
        <DrawerItem
          navigation={navigation}
          route={"Home"}
          title={"Map Your Ride"}
          icon={images.mapYourRide}
          iconStyle={{ height: 22, width: 19, resizeMode: "contain" }}
        />
        <DrawerItem
          navigation={navigation}
          route={""}
          title={"Friends"}
          icon={images.friends}
          iconStyle={{ height: 25, width: 28, resizeMode: "contain" }}
        />
        <DrawerItem
          navigation={navigation}
          route={"Deals"}
          title={"Deals"}
          icon={images.deals}
          iconStyle={{ height: 22, width: 23, resizeMode: "contain" }}
        />
        <DrawerItem
          navigation={navigation}
          route={"Setting"}
          title={"Settings"}
          icon={images.settings}
          iconStyle={{ height: 22, width: 22, resizeMode: "contain" }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    /* width:200, */
    // justifyContent: "center",
  },
  contenContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
  },
  logoutContainer: {
    height: 150,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
  },
  itemContainer: {
    height: 32,
    width: "100%",
    alignItems: "center",
    marginBottom: 35
    // borderColor:"red",
    // borderWidth:1
  },
  imageContainer: {
    width: "100%",
    height: 200,
  },
  imageStyle: {
    resizeMode: "contain",
    height: 29,
    width: 29,
  },
  textStyle: {
    marginLeft: 10,
    fontSize: 15,
    lineHeight: 17,
    fontWeight: "400",
    color: colors.blackTextColor,
  },
  closeDrawerImageStyle: {
    padding: 20,
    width: 60,
    height: 60,
    marginLeft: 10,
    /*  position: 'absolute',
        left: 10 */
  },
  valueStyle: {
    marginLeft: 5,
    fontSize: Platform.OS == "ios" ? 12 : 10,
  },
  labelStyle: {
    fontSize: Platform.OS == "ios" ? 12 : 10,
  },
  image: {
    /* flex: 1, */
    resizeMode: "cover",
    width: "100%",
    height: 230,
    alignItems: "center",
  },
});
