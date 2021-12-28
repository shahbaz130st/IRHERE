import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, PermissionsAndroid, FlatList, Alert, Dimensions, Platform } from "react-native";
import { colors } from "../Themes/colors";
import ModalOpenField from "../Component/modalOpenField";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import Button from "../Component/Button";
import commonStyles from "../Themes/commonStyles";
import { images } from "../Assets/Images";
import constant from "../Utils/ApiConstants";
import { AlertComponent } from "../Utils/Alert";
import Loader from "../Utils/Loader";
import axios from "axios";
import { phoneScreen } from "../Themes/phoneScreen";
import { useDispatch, useSelector } from "react-redux";
import Preference from "react-native-preference";
import BiggerButton from "../Component/BiggerButton";
import {
    launchCamera
} from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import AlertModal from "../Utils/AlertModal";
import { signOut } from "../Store/ActionsCreator";
import { StackActions } from "@react-navigation/native";
import CustomBottomSheet from "../Component/CustomBottomSheet";
import { RNCamera } from 'react-native-camera';
import Header from "../Component/Header";
import { PERMISSIONS, check, request, RESULTS } from 'react-native-permissions';
import DropDownPicker from 'react-native-dropdown-picker';
const login = StackActions.replace("OnBoarding")
let called_pattern = {}
const VerifyLocation = (props) => {

    const [loading, setLoading] = useState(false)
    const state = useSelector(state => state)
    const [avatar, setAvatar] = useState("")
    const [verification, setVerification] = useState("")
    const [showItem, setShowItem] = useState(false)
    const [location, setLocation] = useState({})
    const [listOfItems, setListOfItems] = useState([{ name: "71-77 covet garden  london, United kingdom" }, { name: "71-77 covet garden  london, United kingdom" }, { name: "71-77 covet garden  london, United kingdom" }, { name: "71-77 covet garden  london, United kingdom" }])
    const [filePath, setFilePath] = useState("")
    const [pattern, setPattern] = useState({})
    const [currentAddress, setCurrentAddress] = useState("")
    const [status, setStatus] = useState("Make a video")
    const [resultImage, setResultImage] = useState("")
    const [showAlert, setShowAlert] = useState(false)
    const [alertHeader, setAlertHeader] = useState("")
    const [alertBody, setAlertBody] = useState("")
    const [showBottom, setShowBottom] = useState(false)
    const [showCamera, setShowCamera] = useState(false)
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState([]);
    // const [listOfItems, setListOfItems] = useState([{ checked: false, name: "Congestion or Running Nose" }, { checked: false, name: "Cough" }, { checked: false, name: "Diarrhea" }, { checked: false, name: "Fatigue" }, { checked: false, name: "Fever or Chills" }, { checked: false, name: "Headache" }, { checked: false, name: "Muscle or Body Aches" }, { checked: false, name: "Nausea or Vomiting" }, { checked: false, name: "New loss or taste or smell" }, { checked: false, name: "Shortness or breath or difficulty breathing" }, { checked: false, name: "Soar Throat" }, { checked: false, name: "None of the above" }])
    const [items, setItems] = useState([{ checked: false, label: "Congestion or Running Nose", value: "Congestion or Running Nose" }, { checked: false, label: "Cough", value: "Cough" }, { checked: false, label: "Diarrhea", value: "Diarrhea" }, { checked: false, label: "Fatigue", value: "Fatigue" }, { checked: false, label: "Fever or Chills", value: "Fever or Chills" }, { checked: false, label: "Headache", value: "Headache" }, { checked: false, label: "Muscle or Body Aches", value: "Muscle or Body Aches" }, { checked: false, label: "Nausea or Vomiting", value: "Nausea or Vomiting" }, { checked: false, label: "New loss or taste or smell", value: "New loss or taste or smell" }, { checked: false, label: "Shortness or breath or difficulty breathing", value: "Shortness or breath or difficulty breathing" }, { checked: false, label: "Soar Throat", value: "Soar Throat" }, { checked: false, label: "None of the above", value: "None of the above" }]);
    const user = useSelector(state => state.authenticationReducer.user)

    useEffect(async () => {
        console.log(props?.route?.params?.data)
        Geocoder.init("AIzaSyD6ClGJNjuVbHUZWgf2K4gAcrtTX3T99iU");
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
                if (res2 === RESULTS.GRANTED) {
                    getLocation();
                }
            }
        }
        else {
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
            setLocation({ lat: info.coords.latitude, long: info.coords.longitude })
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
    const generate_Pattern = () => {
        // setLoading(true)
        var config = {
          headers: {
            "Content-Type": "multipart/form-data"
          },
        };
        console.log(constant.generate_Pattern)
        axios
          .post(constant.generate_Pattern, config)
          .then(async function (response) {
            // setLoading(false)
            console.log(response.data)
            called_pattern = response.data
            props.navigation.navigate("VerificationRules", { data: response.data, list: value })
            // setPattern(response.data)
            // setShowBottom(true)
            // AlertComponent({ msg: response.data.head_pose === 1 ? "Raise " + response.data.fingers + " fingers of your right hand for entire video and turn your head towards right and shoulder must be visible." : "Raise " + response.data.fingers + " finger of your right hand for entire video and turn your head towards left and shoulder must be visible.", onOkPress: () => { captureImage('video') } })
          })
          .catch(function (error) {
            // setLoading(false)
            AlertComponent({ msg: error.message,title:"Error",type:"error" })
          });
      }
    const uploadVideo = (file) => {
        setLoading(true)
        setStatus("Uploading.....")
        var config = {
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "*/*"
            },
        };
        const data = new FormData();
        data.append('file', file /* filePath */);
        console.log(constant.upload_video, data, file)
        axios
            .post(constant.upload_video, data, config)
            .then(function (response) {
                setLoading(false)
                if (response.data.code === "1") {
                    console.log(response.data)
                    convertVideo(file.name)
                }
                else {
                    // setShowAlert(true)
                    // setAlertHeader("Error")
                    // setAlertBody(response.data.desc)
                    generate_Pattern()
                    AlertComponent({ msg: response.data.desc,title:"Error",type:"error" })
                }
            })
            .catch(function (error) {
                setLoading(false)
                console.log(error)
                AlertComponent({ msg: error.message,title:"Error",type:"error" })
            });
    }
    const convertVideo = (name) => {
        setLoading(true)
        setStatus("Conversion.....")
        var config = {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        };
        const data = new FormData();
        data.append('apikey', "68685dc6-5fb7-46c6-8cd5-228fc33b5485");
        data.append('video_filename', name);
        console.log(constant.convert_video, data)
        axios
            .post(constant.convert_video, data, config)
            .then(function (response) {
                setLoading(false)
                if (response.data.code === "1") {
                    console.log(response.data)
                    processVideo(name)
                }
                else {
                    // setShowAlert(true)
                    // setAlertHeader("Error")
                    // setAlertBody(response.data.desc)
                    generate_Pattern()
                    AlertComponent({ msg: response.data.desc,title:"Error",type:"error" })
                }
            })
            .catch(function (error) {
                setLoading(false)
                console.log(error)
                AlertComponent({ msg: error.message,title:"Error",type:"error" })
            });
    }
    const processVideo = (name) => {
        setLoading(true)
        setStatus("Processing.....")
        var config = {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        };
        const data = new FormData();
        data.append('apikey', "68685dc6-5fb7-46c6-8cd5-228fc33b5485");
        data.append('id', user.id);
        data.append('video_filename', name);
        data.append('fingers', props?.route?.params?.data.fingers);
        data.append('head_pose', props?.route?.params?.data.head_pose);
        data.append('pose_time', props?.route?.params?.data.timestamp);
        data.append('lat', location.lat);
        data.append('long', location.long);
        data.append('address_text', currentAddress);
        data.append('symptoms', props?.route?.params?.list ? props.route.params.list.toString() : "");
        console.log(constant.process_video, data)
        axios
            .post(constant.process_video, data, config)
            .then(function (response) {
                setLoading(false)

                if (response.data.Face_Found === "True") {
                    console.log(response.data)
                    setStatus("Precessing Complete")
                    setResultImage(response.data.frame)
                    props.navigation.navigate("certificateValidation", { certificate: response.data })
                    // setShowAlert(true)
                    // setAlertHeader("Successfull")
                    // setAlertBody(response.data.desc)

                }
                else {
                    // setFilePath("")
                    // setShowAlert(true)
                    // setAlertHeader("Error")
                    // setAlertBody(response.data.desc)
                    generate_Pattern()
                    AlertComponent({ msg: response.data.desc,title:"Error",type:"error" })
                    setStatus("Verification Failed.Make a video again")
                }
            })
            .catch(function (error) {
                setLoading(false)
                console.log(error)
                AlertComponent({ msg: error.message,title:"Error",type:"error" })
            });
    }
    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs camera permission',
                    },
                );
                // If CAMERA Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else {
            const res = await check(PERMISSIONS.IOS.CAMERA);
            if (res === RESULTS.GRANTED) {
                console.log('You can use camera');
                return res === RESULTS.GRANTED;

            } else if (res === RESULTS.DENIED) {
                const res2 = await request(PERMISSIONS.IOS.CAMERA);
                return res2 === RESULTS.GRANTED;
            }
        }
    };
    const captureImage = async (type) => {
        let options = {
            mediaType: type,
            maxWidth: 300,
            maxHeight: 550,
            quality: Platform.OS === "ios" ? 0.8 : 0.3,
            videoQuality: Platform.OS === "ios" ? "medium" : 'low',
            durationLimit: 3, //Video max duration in seconds
            saveToPhotos: false,
            cameraType: "front"
        };
        let isCameraPermitted = await requestCameraPermission();
        if (isCameraPermitted) {
            launchCamera(options, (response) => {
                console.log('Response = ', response);
                if (response.didCancel) {
                    alert('User cancelled camera picker');
                    return;
                } else if (response.errorCode == 'camera_unavailable') {
                    alert('Camera not available on device');
                    return;
                } else if (response.errorCode == 'permission') {
                    alert('Permission not satisfied');
                    return;
                } else if (response.errorCode == 'others') {
                    alert(response.errorMessage);
                    return;
                }
                if (type === "video") {
                    setStatus("Video is recorded.Please verify it.")
                    // setFilePath({ uri: response.assets[0].uri, type: 'video/mp4', name: response.assets[0].fileName });
                }
                uploadVideo({ uri: Platform.OS === "ios" ? response.assets[0].uri.replace('file://', '') : response.assets[0].uri, type: 'video/mp4', name: Platform.OS === "ios" ? response.assets[0].uri.split("/").pop() : response.assets[0].fileName })
                // setAvatar(response.assets[0].uri)
                // setFilePath({ uri: response.assets[0].uri, type: 'image/jpeg', name: response.assets[0].fileName });
            });
        }
    };

    return (
        <View style={[commonStyles.mainViewStyle, { backgroundColor: state.themeChangeReducer.secondaryColor }]}>
            <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} >
                <Header
                    leftIcon={images.unboldIcon}
                    backIconPress={() => { props.navigation.goBack() }}
                    headerText={"Verify Your Identity"} />
                <View style={{ flex: 1, justifyContent: "space-between", alignItems: "center", paddingHorizontal: 30,paddingBottom: 10  }}>
                    <View style={{ alignItems: "center", paddingTop: "10%",marginBottom: 60 }}>
                        <Text style={[styles.bodyStyle, { color: colors.blackTextColor, fontWeight: "700", fontSize: 18 }]}>{"Record a video"}</Text>
                        <Text style={{ fontSize: 14, fontWeight: "400", marginTop: 10 }}>{"To make sure its really you, please"}</Text>
                        <Text style={{ fontSize: 14, fontWeight: "400" }}>{"record 3 seconds video of yourself"}</Text>
                        <Text style={{ fontSize: 14, fontWeight: "400" }}>{"while performing the following actions"}</Text>

                    </View>

                    <View style={[{
                        backgroundColor: colors.whiteColor,
                        width: "100%",
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                        borderRadius: 5,
                        paddingHorizontal: "10%",
                        paddingBottom:"10%",
                        marginBottom:"10%"
                    }]}>
                        <View style={{ alignItems: "center", width: "100%", marginTop: -60 }}>
                            <Image source={images.selfImage} style={{ height: 120, width: 120, resizeMode: "contain" }} />
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <View style={{ width: "20%", alignItems: "center", justifyContent: "center" }}>
                                <View style={styles.countViewStyle}>
                                    <Text style={{ color: colors.whiteColor, fontSize: 14 }}>1</Text>
                                </View>
                            </View>
                            <View style={{ width: "80%" }}>
                                <Text style={{ fontSize: Platform.OS==="android"?14:16, fontWeight: "400", lineHeight: 20 }}>{props?.route?.params?.data.fingers === 1 ? "Raise " + props?.route?.params?.data.fingers + " finger of your hand." : "Raise " + props?.route?.params?.data.fingers + " fingers of your hand."}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", paddingTop: 10 }}>
                            <View style={{ width: "20%", alignItems: "center", justifyContent: "center" }}>
                                <View style={styles.countViewStyle}>
                                    <Text style={{ color: colors.whiteColor, fontSize: 14 }}>2</Text>
                                </View>
                            </View>
                            <View style={{ width: "80%" }}>
                                <Text style={{ fontSize: Platform.OS==="android"?14:16, fontWeight: "400", lineHeight: 20 }}>{props?.route?.params?.data.head_pose === 0 ? "Turn your head towards left and then move back straight." : "Turn your head towards right and then move back straight."}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", paddingTop: 10 }}>
                            <View style={{ width: "20%", alignItems: "center", justifyContent: "center" }}>
                                <View style={styles.countViewStyle}>
                                    <Text style={{ color: colors.whiteColor, fontSize: 14 }}>3</Text>
                                </View>
                            </View>
                            <View style={{ width: "80%" }}>
                                <Text style={{ fontSize: Platform.OS==="android"?14:16, fontWeight: "400", lineHeight: 20 }}>{"Shoulder must be visible."}</Text>
                            </View>
                        </View>
                    </View>


                    <View style={{ width: "100%" }}>
                        <Text style={{ fontSize: 12, textAlign: "center", color: colors.placeholderColor }}>{"We never store any of your video.Only your encrypted facial data is stored for verification purposes."}</Text>
                        <Button
                            image
                            rightImage={images.cameraImage}
                            imageStyle={{ height: 25, width: 25, tintColor: state.themeChangeReducer.secondaryColor, position: "absolute", zIndex: 1111, right: 20 }}
                            buttonStyle={[commonStyles.buttonStyle, { backgroundColor: state.themeChangeReducer.primaryColor, marginVertical: 20 }]}
                            textStyle={commonStyles.textStyle}
                            text={"Open Camera"}
                            onPress={() => {
                                captureImage('video')
                            }}
                        />
                    </View>
                </View>
                {
                    showAlert &&
                    <AlertModal
                        showAlert={showAlert}
                        ok_Button={() => {
                            setShowAlert(false)
                            props.navigation.goBack()
                        }}
                        header={alertHeader}
                        body={alertBody}
                    />
                }
                <Loader visible={loading} styleLoader={{ elevation: 6, }}
                    statusText={status} />
            </KeyboardAwareScrollView>
        </View>
    )
}
export default VerifyLocation;

const styles = StyleSheet.create(
    {
        mainViewStyle: {
            flex: 1
        },
        countViewStyle: {
            height: 22,
            width: 22,
            borderRadius: 11,
            backgroundColor: "#7bd22c",
            alignItems: "center",
            justifyContent: "center",
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
        innerViewStyle2: {
            height: phoneScreen.height * 85 / 100,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            paddingHorizontal: 30,
            paddingTop: 10
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
        preview: {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            height: Dimensions.get('window').height - 400,
            width: Dimensions.get('window').width,
            position: "absolute",
            zIndex: 111
        },
        bodyStyle: {
            fontSize: 14
        }
    }
)