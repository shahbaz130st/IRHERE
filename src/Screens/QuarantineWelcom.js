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
import Header from "../Component/Header";
import CustomRadioButtonBottomSheet from "../Component/CustomRadioButtonBottomSheet";

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
  const [listOfItems, setListOfItems] = useState([{ name: "Voluntary Self Isolation", isChecked: false }, { name: "Mandatory Self Isolation", isChecked: false }, { name: "Mandatory Quarantine", isChecked: false }])
  const [isolationTimeList, setIsolationTimeList] = useState([{ name: "7 days", value: 7, isChecked: false }, { name: "14 days", value: 14, isChecked: false }, { name: "Click here to type other isolation days", value: "Other (Please type Below)", isChecked: false }])
  const [isolationReasonList, setIsolationReasonList] = useState([{ id: 1, name: "Close Contact", checked: false }, { id: 2, name: "Avaiting Results", checked: false }, { id: 3, name: "Mandatory Lockdown", checked: false }])
  const [selectedIsolationReason, setSelectedIsolationReason] = useState([])
  const validation = () => {
    if (selectedIsolationReason.length === 0) {
      AlertComponent({ msg: "Please select isolation reason", title: "Error", type: "error" })
    }
    else if (isolationType === "") {
      AlertComponent({ msg: "Please select isolation type", title: "Error", type: "error" })
    }

    else if (isolationTime == "") {
      AlertComponent({ msg: "Please select isolation duration", title: "Error", type: "error" })
    }
    else if (isolationTime == "Other (Please type Below)" && otherIsolationTime == "") {
      AlertComponent({ msg: "Please add other isolation duration", title: "Error", type: "error" })
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
    data.append("address", props.route.params.address)

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
          AlertComponent({ msg: response.data.desc, title: "Error", type: "error" })
        }
      })
      .catch(function (error) {
        setLoading(false)
        AlertComponent({ msg: error.message, title: "Error", type: "error" })
      });
  }
  return (
    <View style={[commonStyles.mainViewStyle, { backgroundColor: state.themeChangeReducer.secondaryColor }]}>
      <Header
        leftIcon={images.unboldIcon}
        backIconPress={() => { props.navigation.goBack() }}
        headerText={"Welcome"} />
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} >
        <View style={{
          paddingHorizontal: 24,
          paddingBottom: 50,
          padding: 30, backgroundColor: state.themeChangeReducer.secondaryColor
        }} >
          <Text style={[styles.heading1Style, { color: colors.blackTextColor }]}>{"Tell us a little about your situation"}</Text>
          <Text style={styles.bodyStyle}>{"Why are you isolating?"}</Text>
          <ModalOpenField
            numberOfLines={1}
            value={selectedIsolationReason.length === 0 ? "Select Reasons of Isolation" : selectedIsolationReason.join(", ")}
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
          <Text style={styles.bodyStyle}>{"How are you isolating?"}</Text>
          <ModalOpenField
            numberOfLines={1}
            containerStyle={[commonStyles.inputContainerStyle, { marginTop: 15 }]}
            textViewStyle={commonStyles.selectionInputTextStyle}
            value={isolationType === "" ? "Select Isolation type" : isolationType}
            valueStyle={{ fontSize: 16, color: colors.placeholderColor, fontWeight: "400" }}
            rightImage={images.bottomArrowIcon}
            rightImageViewStyle={commonStyles.selectionRightArrowView}
            rightImageStyle={commonStyles.selectionRightArrow}
            onPress={() => {
              setPickerType("isolationType")
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
          <View style={{ flex: 1 }} />
          <View style={{ marginVertical: 18 }}>
            <Text style={{ color: colors.placeholderColor, fontSize: 14, fontWeight: "400" }} >{"By starting the isolation with us you agree to iRHere’s Terms & Conditions & I agree that all the information provided here is true and accurate."}</Text>
          </View>
          <Button
            buttonStyle={[commonStyles.buttonStyle, { backgroundColor: state.themeChangeReducer.primaryColor }]}
            textStyle={commonStyles.textStyle}
            text={"Start my Isolation"}
            onPress={() => { validation() }}
          />
        </View>
      </KeyboardAwareScrollView>
      {
        showPicker &&
        <CustomRadioButtonBottomSheet
          visible={showPicker}
          listOfItems={pickerType === "isolationType" ? listOfItems : pickerType === "isolationReason" ? isolationReasonList : pickerType === "isolationTime" && isolationTimeList}
          headerText={pickerType === "isolationType" ? "Choose Isolation Type" : "Choose Isolation Time"}
          onDragDown={() => setShowPicker(false)}
          subHeaderText={pickerType === "isolationReason" ? "Choose multiple" : "Choose one"}
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
                  if (pickerType === "isolationType") {
                    let tempArray = listOfItems
                    for (let i = 0; i < tempArray.length; i++) {
                      if (i === index) {
                        tempArray[i].isChecked = true
                        setIsolationType(tempArray[i].name)
                        setShowPicker(false)
                      }
                      else {
                        tempArray[i].isChecked = false
                      }
                    }
                    setListOfItems([...tempArray])
                  }
                  else if (pickerType === "isolationTime") {
                    let tempArray = isolationTimeList
                    for (let i = 0; i < tempArray.length; i++) {
                      if (i === index) {
                        tempArray[i].isChecked = true
                        setIsolationTimeName(tempArray[i].name)
                        setIsolationTime(tempArray[i].value)
                        setShowPicker(false)
                      }
                      else {
                        tempArray[i].isChecked = false
                      }
                    }
                    setIsolationTimeList([...tempArray])
                  }
                  else {
                    let tempArray = isolationReasonList
                    for (let i = 0; i < tempArray.length; i++) {
                      if (i === index) {
                        tempArray[i].checked = !tempArray[i].checked
                      }
                    }
                    setIsolationReasonList([...tempArray])
                  }
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "400", color: colors.blackTextColor }}>{item.name}</Text>
                {
                  pickerType === "isolationReason" ?
                    <View style={{ width: 24, height: 24, alignItems: "center", justifyContent: "center" }}>
                      {item.checked &&
                        <Image source={images.tickBlueIcon} style={{ width: "100%", height: "100%", resizeMode: "contain" }} />}
                    </View>
                    :
                    <View style={{ borderColor: item.isChecked ? state.themeChangeReducer.primaryColor : "#CDCFD0", backgroundColor: item.isChecked ? state.themeChangeReducer.primaryColor : colors.whiteColor, width: 24, height: 24, borderWidth: 1, borderRadius: 12, alignItems: "center", justifyContent: "center" }}>
                      <View style={{ height: 8, width: 8, backgroundColor: colors.whiteColor, borderRadius: 4 }}></View>
                    </View>

                }

              </TouchableOpacity>
            );
          }}
          onSelectPress={() => {
            if (pickerType === "isolationType") {
              setShowPicker(false)
            }
            else if (pickerType === "isolationTime") {
              setShowPicker(false)
            }
            else {
              let tempArray = isolationReasonList
              for (let i = 0; i < tempArray.length; i++) {
                if (tempArray[i].checked) {
                  selectedIsolationReason.push(tempArray[i].name)
                }
              }
              setShowPicker(false)
            }
          }}
        />
      }
      <Loader visible={loading} />
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