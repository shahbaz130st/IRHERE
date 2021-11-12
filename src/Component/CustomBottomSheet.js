import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    StyleSheet,
    PermissionsAndroid,
    ScrollView
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { images } from "../Assets/Images/index";
import Button from "./Button";
import commonStyles from "../Themes/commonStyles";
import { useSelector } from "react-redux";
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import { colors } from "../Themes/colors";
import ModalOpenField from "../Component/modalOpenField";
import { phoneScreen } from "../Themes/phoneScreen";
import { PERMISSIONS, check, request, RESULTS } from 'react-native-permissions';
const CustomBottomSheet = ({
    visible,
    crossIcon = () => { },
    fingers,
    headPositon,
    recordVideoPress = () => { }
}) => {
    const refRBSheet = useRef();
    const [sheetVisible, setSheetVisible] = useState(visible);
    const [currentAddress, setCurrentAddress] = useState("")
    useEffect(() => {
        if (sheetVisible) {
            refRBSheet.current.open();
        }
    }, [sheetVisible]);
    useEffect(async () => {
        Geocoder.init("AIzaSyBosJOS3Vh5CqFhPW58AVdZ0AlZ_eWBE-I");
        await requestLocationPermission()
    }, [])

    const requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            const res = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

            if (res === RESULTS.GRANTED) {
                console.log('You can use locations ');
                getLocation();
            } else if (res === RESULTS.DENIED) {
                const res2 = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
                res2 === RESULTS.GRANTED;
            }
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        'title': 'Location Permission',
                        'message': 'This App needs access to your location ' +
                            'so we can know where you are.'
                    }
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("You can use locations ")
                    getLocation()
                } else {
                    console.log("Location permission denied")
                }
            } catch (err) {
                console.warn(err)
            }
        }
    }
    const getLocation = () => {
        Geolocation.getCurrentPosition(async info => {
            console.log(info)
            const response = await Geocoder.from(info.coords.latitude, info.coords.longitude);
            const address = response.results[0].formatted_address;
            console.log(address)
            setCurrentAddress(address)
        },
            e => {
                console.log("Error=", e),
                    { enableHighAccuracy: true, timeout: 25000, maximumAge: 3600000 }
                if (e.code == 2) {
                    RNSettings.openSetting(RNSettings.ACTION_LOCATION_SOURCE_SETTINGS).then(
                        result => {
                            if (result === RNSettings.ENABLED) {
                                getLocation();
                            }
                        },
                    );
                }
                if (e.code == 3) {
                    getLocation();
                }
            });
    }
    const state = useSelector(state => state)

    return (
        <RBSheet
            ref={refRBSheet}
            closeOnPressMask={false}
            closeOnDragDown={false}
            // onClose={onDragDown}
            customStyles={{
                container: {
                    backgroundColor: "white",
                    alignItems: "center",
                },
                wrapper: {
                    backgroundColor: "#0000001A",
                },
                draggableIcon: {
                    marginTop: 25,
                    backgroundColor: "rgb(57,57,68)",
                    width: 91
                },
            }}
            height={Dimensions.get("window").height}>
            <ScrollView>
                <View style={{ height: "100%", width: "100%", alignItems: "center", marginBottom: 11, justifyContent: "space-between" }}>
                    <View style={{ height: 70, width: "100%",marginTop:Platform.OS==="ios"?15:0 }}>
                        <View style={{ width: "100%", height: 70, justifyContent: "center", borderBottomColor: "grey", borderBottomWidth: 0.8 }}>
                            <TouchableOpacity style={{ position: "absolute", left: 15 }}
                                onPress={crossIcon}>
                                <Image source={images.crossIcon} style={{ height: 25, width: 25, resizeMode: "contain" }} />
                            </TouchableOpacity>
                            <View style={{ width: "100%", alignItems: "center" }}>
                                <Text style={{ fontSize: 22, fontWeight: "bold" }}>{"Face Verification"}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ alignItems: "center", width: "100%", paddingTop: 20 }}>
                        <Text style={{ width: "90%", textAlign: "left", fontWeight: "bold" }}>{"Your current location"}</Text>
                        <ModalOpenField
                            value={currentAddress === "" ? "Location" : currentAddress}
                            containerStyle={[commonStyles.inputContainerStyle, { marginTop: 15, height: Platform.OS === "android" ? phoneScreen.height * 7 / 100 : phoneScreen.height * 6 / 100, width: "90%" }]}
                            inputStyle={[commonStyles.inputInnerStyle, { color: currentAddress === "" ? colors.placeholderColor : colors.greyColor }]}
                        />
                    </View>
                    <Image source={images.selfImage} style={{ height: 200, width: "100%", resizeMode: "contain" }} />
                    <Text style={{ fontSize: 22, fontWeight: "bold", width: "70%", textAlign: "center" }}>{"Verify Your Identity"}</Text>

                    <View style={{ flex: 1, paddingHorizontal: 20 }}>

                        <Text style={{ fontSize: 12, fontWeight: "500", marginTop: 10, paddingHorizontal: 10 }}>{"To make sure its really you, please record your video while performing the following actions"}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingTop: 10 }}>
                            <Image style={{ width: 10, height: 10, resizeMode: "contain", marginRight: 10 }}
                                source={require("../Assets/Images/check.png")}
                            />
                            <Text style={{ fontSize: 12, fontWeight: "500", width: "96%" }}>{"Raise " + fingers + " fingers of your hand."}</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingTop: 10 }}>
                            <Image style={{ width: 10, height: 10, resizeMode: "contain", marginRight: 10 }}
                                source={require("../Assets/Images/check.png")}
                            />
                            <Text style={{ fontSize: 12, fontWeight: "500", width: "96%" }}>{"Turn your head towards " + headPositon + " and then move back straight."}</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingTop: 10 }}>
                            <Image style={{ width: 10, height: 10, resizeMode: "contain", marginRight: 10 }}
                                source={require("../Assets/Images/check.png")}
                            />
                            <Text style={{ fontSize: 12, fontWeight: "500", width: "96%" }}>{"Shoulder must be visible."}</Text>
                        </View>
                    </View>
                    <Button
                        buttonStyle={[commonStyles.buttonStyle, { backgroundColor: state.themeChangeReducer.primaryColor, marginTop: 15, width: "90%", marginBottom: 50 }, commonStyles.shadowStyle]}
                        textStyle={commonStyles.textStyle}
                        text={"Record a video"}
                        onPress={recordVideoPress}
                    />
                </View>
            </ScrollView>
        </RBSheet>
    );
};

export default CustomBottomSheet;

const styles = StyleSheet.create(
    {

    }
)