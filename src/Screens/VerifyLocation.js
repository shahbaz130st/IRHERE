import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, PermissionsAndroid, FlatList, Alert, Dimensions, Platform } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { colors } from "../Themes/colors";
import ModalOpenField from "../Component/modalOpenField";
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
import RNSettings from 'react-native-settings';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import AlertModal from "../Utils/AlertModal";
import { signOut } from "../Store/ActionsCreator";
import { StackActions } from "@react-navigation/native";
import CustomBottomSheet from "../Component/CustomBottomSheet";
import { RNCamera } from 'react-native-camera';
import Header from "../Component/Header";
import { PERMISSIONS, check, request, RESULTS, openSettings } from 'react-native-permissions';
import CustomCheckBoxBottomSheet from "../Component/CustomCheckBoxBottomSheet";
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
  const [items, setItems] = useState([{ checked: false, label: "Congestion or Running Nose", value: "Congestion or Running Nose" }, { checked: false, label: "Cough", value: "Cough" }, { checked: false, label: "Diarrhea", value: "Diarrhea" }, { checked: false, label: "Fatigue", value: "Fatigue" }, { checked: false, label: "Fever or Chills", value: "Fever or Chills" }, { checked: false, label: "Headache", value: "Headache" }, { checked: false, label: "Muscle or Body Aches", value: "Muscle or Body Aches" }, { checked: false, label: "Nausea or Vomiting", value: "Nausea or Vomiting" }, { checked: false, label: "New loss or taste or smell", value: "New loss or taste or smell" }, { checked: false, label: "Shortness or breath or difficulty breathing", value: "Shortness or breath or difficulty breathing" }, { checked: false, label: "Sore Throat", value: "Sore Throat" }]);
  const user = useSelector(state => state.authenticationReducer.user)
  const [showRadioBottomSheet, setShowRadioBottomSheet] = useState(false)
  const dispatch = useDispatch()
  const logOut = () => {
    dispatch(signOut())
    props.navigation.dispatch(login)
  }

  useEffect(async () => {
    Geocoder.init(Platform.OS === "ios" ? constant.ios_map_key : constant.android_map_key);
    await requestLocationPermission()
  }, [])
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {

      const res = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      console.log(res)
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
      else if (res === RESULTS.BLOCKED) {
        openSettings().catch(() => console.warn('cannot open settings'));
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
    setLoading(true)
    var config = {
      headers: {
        "Content-Type": "multipart/form-data"
      },
    };
    console.log(constant.generate_Pattern)
    axios
      .post(constant.generate_Pattern, config)
      .then(async function (response) {
        setLoading(false)
        console.log(response.data)
        called_pattern = response.data
        props.navigation.navigate("VerificationRules", { data: response.data, list: value })
        // setPattern(response.data)
        // setShowBottom(true)
        // AlertComponent({ msg: response.data.head_pose === 1 ? "Raise " + response.data.fingers + " fingers of your right hand for entire video and turn your head towards right and shoulder must be visible." : "Raise " + response.data.fingers + " finger of your right hand for entire video and turn your head towards left and shoulder must be visible.", onOkPress: () => { captureImage('video') } })
      })
      .catch(function (error) {
        setLoading(false)
        AlertComponent({ msg: error.message, title: "Error", type: "error" })
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

          AlertComponent({ msg: response.data.desc, title: "Error", type: "error" })
        }
      })
      .catch(function (error) {
        setLoading(false)
        console.log(error)
        AlertComponent({ msg: error.message, title: "Error", type: "error" })
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
          AlertComponent({ msg: response.data.desc, title: "Error", type: "error" })
        }
      })
      .catch(function (error) {
        setLoading(false)
        console.log(error)
        AlertComponent({ msg: error.message, title: "Error", type: "error" })
      });
  }
  const processVideo = (name) => {
    setLoading(true)
    setStatus("Precessing.....")
    var config = {
      headers: {
        "Content-Type": "multipart/form-data"
      },
    };
    const data = new FormData();
    data.append('apikey', "68685dc6-5fb7-46c6-8cd5-228fc33b5485");
    data.append('id', user.id);
    data.append('video_filename', name);
    data.append('fingers', called_pattern.fingers);
    data.append('head_pose', called_pattern.head_pose);
    data.append('pose_time', called_pattern.timestamp);
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
          AlertComponent({ msg: response.data.desc, title: "Error", type: "error" })
          setStatus("Verification Failed.Make a video again")
        }
      })
      .catch(function (error) {
        setLoading(false)
        console.log(error)
        AlertComponent({ msg: error.message, title: "Error", type: "error" })
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
        res2 === RESULTS.GRANTED;
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
          headerText={"Verify Your Location"} />
        {
          Preference.get("mode") === "quarantine" &&
          <View style={[commonStyles.innerViewStyle, { backgroundColor: state.themeChangeReducer.secondaryColor, paddingBottom: 10 }]} >
            <Text style={styles.bodyStyle}>{"Your current location"}</Text>
            <ModalOpenField
              // disabled={true}
              onPress={async () => { await requestLocationPermission() }}
              numberOfLines={1}
              value={currentAddress === "" ? "Location" : currentAddress}
              valueStyle={{ fontSize: 16, color: colors.placeholderColor, fontWeight: "400" }}
              containerStyle={[commonStyles.inputContainerStyle, { marginTop: 10, flexDirection: "row", paddingHorizontal: 0 }]}
              textViewStyle={[commonStyles.passwordInputinnerStyle, { paddingLeft: 15, justifyContent: "center" }]}
              rightImageViewStyle={{
                width: "15%", height: "100%", alignItems: "center", justifyContent: "center", backgroundColor: colors.whiteColor, borderTopRightRadius: phoneScreen.height * 1 / 100, borderBottomRightRadius: phoneScreen.height * 1 / 100
              }}
              rightImage={images.location}
              rightImageStyle={{ width: "60%", height: "60%", resizeMode: "contain" }}
            />
            <Text style={[styles.bodyStyle, { marginTop: 10 }]}>{"Do you have any Symptoms"}</Text>
            <ModalOpenField
              numberOfLines={1}
              containerStyle={[commonStyles.inputContainerStyle, { marginTop: 15 }]}
              textViewStyle={commonStyles.selectionInputTextStyle}
              value={value.length === 0 ? "Choose Symptoms (optional)" : value.join(", ")}
              valueStyle={{ fontSize: 16, color: colors.placeholderColor, fontWeight: "400" }}
              rightImage={images.bottomArrowIcon}
              rightImageViewStyle={commonStyles.selectionRightArrowView}
              rightImageStyle={commonStyles.selectionRightArrow}
              onPress={() => { setShowRadioBottomSheet(true)/* setShowPicker(true) */ }}
            />
            <Text style={[styles.bodyStyle, { marginTop: 10, fontSize: 14, color: colors.placeholderColor }]}>{"Please note that these symptoms are provided by CDC and may appear 2-14 days after exporure to the virus."}</Text>

            <View style={{ flex: 1 }} />
            <Button
              image
              imageStyle={{ height: 25, width: 25, tintColor: state.themeChangeReducer.secondaryColor, position: "absolute", zIndex: 1111, right: 20 }}
              buttonStyle={[commonStyles.buttonStyle, { backgroundColor: state.themeChangeReducer.primaryColor, marginVertical: 18 }]}
              textStyle={commonStyles.textStyle}
              text={"Continue"}
              onPress={() => {
                setResultImage("")
                generate_Pattern()
              }}
            />
            {/* <DropDownPicker
              multiple={true}
              containerStyle={{
                marginTop: 10,
              }}
              zIndex={2000}
              zIndexInverse={2000}
              style={commonStyles.inputContainerStyle}
              dropDownContainerStyle={{ backgroundColor: colors.inputField }}
              placeholderStyle={commonStyles.inputInnerStyle}
              dropDownContainerStyle={{
                borderColor: colors.greyColor,
                borderWidth: 1.5,
                borderRadius: 2,
                height: 122
              }}
              listItemContainerStyle={{
                backgroundColor: colors.whiteColor,
                borderColor: "#8B97A8",
                borderWidth: 0.2,
                borderRadius: 2,
              }}
              onChangeValue={(text) => { console.log(text) }}
              multipleText={value.toString()}
              labelStyle={commonStyles.inputInnerStyle}
              listItemLabelStyle={commonStyles.inputInnerStyle}
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
            /> */}

            {/*  <ModalOpenField
                value={props?.route?.params?.list && props.route.params.list.length > 0 ? props.route.params.list.toString() : "Choose your Symptoms (multiple)"}
                containerStyle={[commonStyles.inputContainerStyle, { marginTop: 10, height: Platform.OS === "android" ? phoneScreen.height * 7 / 100 : phoneScreen.height * 6 / 100 }]}
                inputStyle={[commonStyles.inputInnerStyle, { color: props?.route?.params?.list && props.route.params.list.length > 0 ? colors.greyColor : colors.placeholderColor }]}
                onPress={() => { props.navigation.navigate("SymptomScreen") }}
              /> */}
            {/* <View style={{ width: "100%", alignItems: "center", marginTop: 20 }}>
                <View style={{ height: Platform.OS === "android" ? phoneScreen.height * 18 / 100 : phoneScreen.height * 15 / 100, width: 197, borderColor: colors.placeholderColor, borderWidth: 1, borderRadius: 10, marginTop: 10, alignItems: "center", justifyContent: "center", padding: 10 }}>
                  {
                    resultImage !== "" ?
                      <Image
                        style={{ height: Platform.OS === "android" ? phoneScreen.height * 18 / 100 : phoneScreen.height * 15 / 100, width: 197, borderRadius: 10 }}
                        source={{ uri: `data:image/gif;base64,${resultImage}` }}
                      />
                      :
                      <Text style={{ color: "black", textAlign: "center", fontWeight: "bold" }}>
                        {status}
                      </Text>
                  }
                </View>
              </View> */}
          </View>
            /*  :
            <View style={{ alignItems: "center" }}>
              <BiggerButton
                buttonStyle={styles.biggerButtonStyle}
                leftImage={images.currentLocation}
                leftImageStyle={styles.lImageStyle}
                rightImage={images.rightArrowIcon}
                rightImageStyle={styles.rImageStyle}
                textViewStyle={{ flex: 1, marginHorizontal: 5 }}
                text={"Your Current Location"}
                textStyle={[styles.textStyle, { color: state.themeChangeReducer.primaryColor }]}
                text1={"75-71 Covent Garden London, UK"}
                text1Style={[styles.text1Style, { color: state.themeChangeReducer.primaryColor }]}
                onPress={() => { props.navigation.navigate("verifyLocation") }}
              />
              <BiggerButton
                buttonStyle={styles.biggerButtonStyle}
                leftImage={images.locationIcon}
                leftImageStyle={styles.lImageStyle}
                rightImage={images.rightArrowIcon}
                rightImageStyle={styles.rImageStyle}
                textViewStyle={{ flex: 1, marginHorizontal: 5 }}
                text={"Confirm a Known Location"}
                textStyle={[styles.textStyle, { color: state.themeChangeReducer.primaryColor }]}
                onPress={() => { setShowItem(true) }}
              />
              <View style={{ height: Platform.OS === "android" ? phoneScreen.height * 18 / 100 : phoneScreen.height * 15 / 100, width: 197, borderColor: colors.placeholderColor, borderWidth: 1, borderRadius: 10, marginTop: 10 }}>
                {
                  avatar !== "" &&
                  <Image
                    style={{ height: Platform.OS === "android" ? phoneScreen.height * 18 / 100 : phoneScreen.height * 15 / 100, width: 197, borderRadius: 10 }}
                    source={{ uri: avatar }}
                  />
                }
                <TouchableOpacity style={{ position: "absolute", bottom: 0, right: -10, backgroundColor: state.themeChangeReducer.primaryColor, padding: 5, alignItems: "center", justifyContent: "center", borderRadius: 6 }}
                  onPress={() => { captureImage("photo") }}>
                  <Image style={{ width: 23, height: 17, resizeMode: "contain" }} source={images.cameraIcon} />
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 5 }}>{"Take a Selfi"}</Text>
            </View>
        } */}

        {/* <Button
          buttonStyle={[commonStyles.buttonStyle, { backgroundColor: state.themeChangeReducer.primaryColor, marginTop: 15 }, commonStyles.shadowStyle]}
          textStyle={commonStyles.textStyle}
          text={"Record a video"}
          onPress={() => {
            const symptoms = props?.route?.params?.list ? props.route.params.list : []
            if (symptoms.length == 0) {
              AlertComponent({ msg: "Please select symptoms" })
            } else {
              setResultImage("")
              generate_Pattern()
            }
          }}
        /> */}
        {showItem &&
          <View style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "#090A0A36", alignItems: "center", justifyContent: "center", width: phoneScreen.width }}>
            <View style={{ height: 206, width: "90%", backgroundColor: state.themeChangeReducer.secondaryColor, borderRadius: 24, padding: 20 }}>
              <Text style={{ fontSize: 13, fontWeight: "600" }}>{"Select From known Address"}</Text>
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
                    <TouchableOpacity
                      style={{ flexDirection: "row", width: "100%", alignItems: "center", padding: 5 }}
                    >
                      <View style={{ height: 12, width: 12, borderRadius: 6, borderColor: colors.blackTextColor, borderWidth: 1, alignItems: "center", justifyContent: "center", marginRight: 5 }}>
                        <View style={{ height: 4, width: 4, borderRadius: 2, backgroundColor: colors.blackTextColor }}>
                        </View>
                      </View>
                      <Text style={{ fontSize: 10, fontWeight: "400" }}>{item.name}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
              <View style={{ width: "100%" }}>
                <Button
                  buttonStyle={[commonStyles.buttonStyle, { backgroundColor: state.themeChangeReducer.primaryColor, marginTop: 0, width: 70, height: 30 }, commonStyles.shadowStyle]}
                  textStyle={commonStyles.textStyle}
                  text={"Ok"}
                  onPress={() => { setShowItem(false) }}
                />
              </View>
            </View>
          </View>
        }
        {
          showBottom &&
          <CustomBottomSheet
            visible={showBottom}
            crossIcon={() => { setShowBottom(false) }}
            fingers={called_pattern.fingers}
            headPositon={called_pattern.head_pose === 0 ? "left" : "right"}
            recordVideoPress={() => {
              setShowBottom(false)
              // setShowCamera(true)
              setTimeout(() => { captureImage('video') }, 500)

            }}
          />
        }
        {
          showAlert &&
          <AlertModal
            showAlert={showAlert}
            ok_Button={() => { setShowAlert(false) }}
            header={alertHeader}
            body={alertBody}
          />
        }
        <Loader visible={loading} />

      </KeyboardAwareScrollView>
      {
        showRadioBottomSheet &&
        <CustomCheckBoxBottomSheet
          visible={showRadioBottomSheet}
          listOfItems={items}
          headerText={"Symptoms"}
          subHeaderText={"Choose multiple"}
          ItemSeparatorComponent={() =>
            <View
              style={{
                height: 1,
                backgroundColor: colors.lightGreyColor
              }}
            />
          }
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", height: 48, alignItems: "center" }}
                onPress={() => {
                  let tempArray = items
                  for (let i = 0; i < tempArray.length; i++) {
                    if (i === index) {
                      tempArray[i].checked = !tempArray[i].checked
                    }
                  }
                  setItems([...tempArray])
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "400", color: colors.blackTextColor }}>{item.label}</Text>
                {
                  item.checked &&
                  <View style={{ width: 24, height: 24, alignItems: "center", justifyContent: "center" }}>
                    <Image source={images.tickBlueIcon} style={{ width: "100%", height: "100%", resizeMode: "contain" }} />
                  </View>
                }

              </TouchableOpacity>
            );
          }}
          onSelectPress={() => {
            let tempArray = items, result = [];
            for (let i = 0; i < tempArray.length; i++) {
              if (tempArray[i].checked) {
                result.push(tempArray[i].label)
              }
            }
            setValue([...result])
            setShowRadioBottomSheet(false)
            console.log(result)
          }}
          onDragDown={() => {
            let tempArray = items, result = [];
            for (let i = 0; i < tempArray.length; i++) {
              if (tempArray[i].checked) {
                result.push(tempArray[i].label)
              }
            }
            // if (result.length === 0) {
            //   setValue([...result])
            //   setShowRadioBottomSheet(false)
            //   AlertComponent({ msg: "Please select symptoms" })
            // }
            // else {
            setValue([...result])
            setShowRadioBottomSheet(false)
            console.log(result)
            // }
          }}
        />

      }
    </View>
  )
}
export default VerifyLocation;

const styles = StyleSheet.create(
  {
    mainViewStyle: {
      flex: 1
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
      fontSize: 14,
      fontWeight: "400",
      color: colors.blackTextColor
    }
  }
)