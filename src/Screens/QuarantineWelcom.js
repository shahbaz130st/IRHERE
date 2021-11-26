import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../Themes/colors";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import ModalOpenField from "../Component/modalOpenField";
import Button from "../Component/Button";
import commonStyles from "../Themes/commonStyles";
import { images } from "../Assets/Images";
import InputField from "../Component/InputField";
import constant from "../Utils/ApiConstants";
import { AlertComponent } from "../Utils/Alert";
import Loader from "../Utils/Loader";
import CustomCheckBox from "../Component/CustomCheckBox";
import axios from "axios";
import { StackActions } from "@react-navigation/native";
import { phoneScreen } from "../Themes/phoneScreen";

const mainApp = StackActions.replace("TabGroup")
import { useSelector } from "react-redux";
import CustomModal from "../Component/CustomModal";
import Preference from "react-native-preference";
const QuarantineWelcom = (props) => {
  const state = useSelector(state => state)
  let user = useSelector(state => state.authenticationReducer.user)
  const [isolationType, setIsolationType] = useState("")
  const [isolationTime, setIsolationTime] = useState("")
  const [isolationTimeName, setIsolationTimeName] = useState("")
  const [otherIsolationTime, setOtherIsolationTime] = useState("")
  const [pickerType, setPickerType] = useState("")
  const [loading, setLoading] = useState(false)
  const [checkBox, setCheckBox] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [listOfItems, setListOfItems] = useState([{ name: "Voluntary Self Isolation" }, { name: "Mandatory Self Isolation" }, { name: "Mandatory Quarantine" }])
  const [isolationTimeList, setIsolationTimeList] = useState([{ name: "7 days", value: 7 }, { name: "14 days", value: 14 }, { name: "Other (Please type Below)", value: "Other (Please type Below)" }])
  const [isolationReasonList, setIsolationReasonList] = useState([{ id: 1, name: "Close Contact", checked: false }, { id: 2, name: "Avaiting Results", checked: false }, { id: 3, name: "Mandatory Lockdown", checked: false }])
  const [selectedIsolationReason, setSelectedIsolationReason] = useState([])
  const validation = () => {
    if (isolationType === "") {
      AlertComponent({ msg: "Please select isolation type",title:"Error",type:"error" })
    }
    else if (selectedIsolationReason.length === 0) {
      AlertComponent({ msg: "Please select isolation reason",title:"Error",type:"error" })
    }
    else if (isolationTime == "") {
      AlertComponent({ msg: "Please select isolation duration",title:"Error",type:"error" })
    }
    else if (isolationTime == "Other (Please type Below)" && otherIsolationTime == "") {
      AlertComponent({ msg: "Please add other isolation duration",title:"Error",type:"error" })
    }
    else {
      addQuestion()
    }
  }
  const addQuestion = () => {
    setLoading(true)
    var config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    const data = new FormData();
    data.append('user_id', user.id);
    data.append('q1', props.route.params.location);
    data.append('q2', isolationType);
    data.append('q3', selectedIsolationReason.toString());
    if (isolationTime !== "Other (Please type Below)") {
      data.append('q4', parseInt(isolationTime));
    }
    else {
      data.append("q4", parseInt(otherIsolationTime))
    }

    console.log(constant.add_questionnaire, data)
    axios.post(constant.add_questionnaire, data, config)
      .then(function (response) {
        console.log(response.data)
        setLoading(false)
        if (response.data.code === "1") {
          Preference.set("CompleteQuestionaire", "done")
          props.navigation.dispatch(mainApp)
        }
        else {
          // setShowAlert(true)
          // setAlertHeader("Error")
          // setAlertBody(response.data.desc)
          AlertComponent({ msg: response.data.desc,title:"Error",type:"error" })
        }
      })
      .catch(function (error) {
        setLoading(false)
        AlertComponent({ msg: error.message,title:"Error",type:"error" })
      });
  }
  return (
    <View style={styles.mainViewStyle}>
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} >
        <View style={[styles.innerViewStyle1, { backgroundColor: state.themeChangeReducer.primaryColor }]}>
          <Text style={[styles.headingStyle, { color: state.themeChangeReducer.secondaryColor }]}>{"Welcome"}</Text>
          <Image source={images.welcomImage} style={styles.imageStyle} />
        </View>
        <View style={[styles.innerViewStyle2, { backgroundColor: state.themeChangeReducer.secondaryColor }]} >
          <Text style={[styles.heading1Style, { color: colors.blackTextColor }]}>{"Tell us a little about your situation"}</Text>
          <Text style={styles.bodyStyle}>{"How are you isolating?"}</Text>
          <ModalOpenField
            value={isolationType === "" ? "Select Isolation type" : isolationType}
            containerStyle={[commonStyles.inputContainerStyle, { marginTop: 15 }]}
            textViewStyle={commonStyles.selectionInputTextStyle}
            valueStyle={{ fontSize: 16, color: colors.placeholderColor, fontWeight: "400" }}
            rightImage={images.bottomArrowIcon}
            rightImageViewStyle={commonStyles.selectionRightArrowView}
            rightImageStyle={commonStyles.selectionRightArrow}
            onPress={() => {
              setPickerType("isolationType")
              setShowPicker(true)
            }}
          />
          <Text style={styles.bodyStyle}>{"Why are you isolating?"}</Text>
          <ModalOpenField
            value={selectedIsolationReason.length === 0 ? "Select Reasons of Isolation" : selectedIsolationReason.toString()}
            containerStyle={[commonStyles.inputContainerStyle, { marginTop: 15 }]}
            textViewStyle={commonStyles.selectionInputTextStyle}
            valueStyle={{ fontSize: 16, color: colors.placeholderColor, fontWeight: "400" }}
            rightImage={images.bottomArrowIcon}
            rightImageViewStyle={commonStyles.selectionRightArrowView}
            rightImageStyle={commonStyles.selectionRightArrow}
            onPress={() => {
              setPickerType("isolationReason")
              setSelectedIsolationReason([])
              setShowPicker(true)
            }}
          />
          <Text style={styles.bodyStyle}>{"How long are you isolating for?"}</Text>
          <ModalOpenField
            value={isolationTimeName === "" ? "Select Isolation Period" : isolationTimeName}
            containerStyle={[commonStyles.inputContainerStyle, { marginTop: 15 }]}
            textViewStyle={commonStyles.selectionInputTextStyle}
            valueStyle={{ fontSize: 16, color: colors.placeholderColor, fontWeight: "400" }}
            rightImage={images.bottomArrowIcon}
            rightImageViewStyle={commonStyles.selectionRightArrowView}
            rightImageStyle={commonStyles.selectionRightArrow}
            onPress={() => {
              setPickerType("isolationTime")
              setShowPicker(true)
            }}
          />
          {
            isolationTime === "Other (Please type Below)" &&
            <InputField
              placeholder={"Isolation period ( Other ) "}
              placeholderTextColor={colors.placeholderColor}
              containerStyle={[commonStyles.inputContainerStyle, { marginTop: 15, height: Platform.OS === "android" ? phoneScreen.height * 7 / 100 : phoneScreen.height * 6 / 100 }]}
              inputStyle={commonStyles.inputInnerStyle}
              onChangeText={(text) => setOtherIsolationTime(text)}
              value={otherIsolationTime}
              keyboardType={"numeric"}
            />
          }

          <View style={{ marginTop: 10, alignItems: "center", width: "100%" }}>
            <CustomCheckBox
              checkstyle={{ borderWidth: 0.8, borderColor: colors.greyColor }}
              onChange={() => { setCheckBox(!checkBox) }}
              isChecked={checkBox}
              textStyle={{ flex: 1 }}
              tintColor={colors.checkBoxLightGreyColor}
              labelStyle={{ fontSize: 12, color: colors.placeholderColor }}
              label={"By starting the isolation with us you agree to iRHere’s Terms & Conditions & I agree that all the information provided here is true and accurate."}
              label1Style={{ textDecorationLine: "underline", fontSize: 12, color: colors.placeholderColor }}
            />
          </View>
          <Button
            buttonStyle={[commonStyles.buttonStyle, { backgroundColor: state.themeChangeReducer.primaryColor, marginVertical: 15 }]}
            textStyle={commonStyles.textStyle}
            text={"Start my Isolation"}
            onPress={() => { validation() }}
          />

        </View>

        <Loader visible={loading} />
      </KeyboardAwareScrollView>

      {
        showPicker &&
        <CustomModal
          listOfItems={pickerType === "isolationType" ? listOfItems : pickerType === "isolationReason" ? isolationReasonList : isolationTimeList}
          headingText={pickerType === "isolationType" ? "Choose Isolation Type" : "Choose Isolation Time"}
          headingStyle={{ fontSize: 18, fontWeight: "500", color: state.themeChangeReducer.primaryColor }}
          headingButtonStyle={{ fontSize: 16, fontWeight: "500", color: state.themeChangeReducer.primaryColor }}
          okButtonPress={() => {
            let tempArray = isolationReasonList
            for (let i = 0; i < tempArray.length; i++) {
              if (tempArray[i].checked) {
                selectedIsolationReason.push(tempArray[i].name)
              }
            }
            setShowPicker(false)
          }}
          showOkButton={pickerType === "isolationReason" && true}
          oKButtonPressStyle={{ width: 80, height: 30, marginTop: 0 }}
          ItemSeparatorComponent={() =>
            <View
              style={{
                height: 1,
                backgroundColor: "#E5E5E5",
              }}
            />
          }
          renderItem={({ item, index }) => {
            if (pickerType === "isolationReason") {
              return (
                <View style={{ width: "100%", paddingVertical: 7 }}>
                  <CustomCheckBox
                    checkstyle={{ borderWidth: 2, borderColor: item.checked ? state.themeChangeReducer.primaryColor : colors.blackTextColor, backgroundColor: item.checked ? state.themeChangeReducer.primaryColor : "white" }}
                    onChange={() => {
                      let tempArray = isolationReasonList
                      for (let i = 0; i < tempArray.length; i++) {
                        if (i === index) {
                          tempArray[i].checked = !tempArray[i].checked
                        }
                      }
                      setIsolationReasonList([...tempArray])
                    }}
                    isChecked={item.checked}
                    textStyle={{ flex: 1 }}
                    tintColor={item.checked ? "white" : colors.placeholderColor}
                    labelStyle={[commonStyles.checkLabelStyle, { color: item.checked ? state.themeChangeReducer.primaryColor : colors.blackTextColor }]}
                    label={item.name}
                    label1={index === 0 && "   (likely contact with COVID-19 person)"}
                    label1Style={{ fontSize: 9, color: item.checked ? state.themeChangeReducer.primaryColor : colors.blackTextColor }}
                  />
                </View>
              )
            }
            else {
              return (
                <TouchableOpacity
                  style={{ width: "100%", paddingVertical: 13 }}
                  onPress={() => {
                    if (pickerType === "isolationType") {
                      setIsolationType(item.name)
                      setShowPicker(false)
                    }
                    else if (pickerType === "isolationTime") {
                      setIsolationTimeName(item.name)
                      setIsolationTime(item.value)
                      setShowPicker(false)
                    }
                  }}
                >
                  <Text style={commonStyles.checkLabelStyle}>{item.name}</Text>
                </TouchableOpacity>
              );
            }
          }} />
      }
    </View>
  )
}
export default QuarantineWelcom;

const styles = StyleSheet.create(
  {
    mainViewStyle: {
      flex: 1
    },
    innerViewStyle1: {
      height: phoneScreen.height * 30 / 100,
      backgroundColor: colors.primaryColor,
      alignItems: "center",
      justifyContent: "space-evenly"
    },
    imageStyle: {
      resizeMode: "contain",
      height: "50%",
      width: "50%"
    },
    headingStyle: {
      fontSize: 24,
      fontWeight: "700",
      fontStyle: "normal",
    },
    heading1Style: {
      fontSize: 16,
      fontWeight: "500",
      fontStyle: "normal",
    },
    bodyStyle: {
      marginTop: 12,
      fontSize: 14,
      fontWeight: "400",
      fontStyle: "normal",
    },
    innerViewStyle2: {
      height: phoneScreen.height * 70 / 100 + 20,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      marginTop: -20,
      paddingHorizontal: 30,
      paddingTop: 30
    }
  }
)