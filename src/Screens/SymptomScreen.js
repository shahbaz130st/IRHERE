import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { colors } from "../Themes/colors";
import Button from "../Component/Button";
import commonStyles from "../Themes/commonStyles";
// import constant from "../Utils/ApiConstants";
import { AlertComponent } from "../Utils/Alert";
import Loader from "../Utils/Loader";
import CustomCheckBox from "../Component/CustomCheckBox";
// import axios from "axios";
import { useSelector } from "react-redux";

const SymptomScreen = (props) => {
  const [loading, setLoading] = useState(false)
  const state = useSelector(state => state)
  const [listOfItems, setListOfItems] = useState([{ checked: false, name: "Congestion or Running Nose" }, { checked: false, name: "Cough" }, { checked: false, name: "Diarrhea" }, { checked: false, name: "Fatigue" }, { checked: false, name: "Fever or Chills" }, { checked: false, name: "Headache" }, { checked: false, name: "Muscle or Body Aches" }, { checked: false, name: "Nausea or Vomiting" }, { checked: false, name: "New loss or taste or smell" }, { checked: false, name: "Shortness or breath or difficulty breathing" }, { checked: false, name: "Soar Throat" }, { checked: false, name: "None of the above" }])
  const [selectedItem, setSelectedItem] = useState([])

  return (
    <View style={[styles.innerViewStyle2, { backgroundColor: state.themeChangeReducer.secondaryColor }]} >
      <View style={{ width: "100%", alignItems: "center" }}>
        <Text style={[styles.headingStyle, { marginTop: Platform.OS === "android" ? 10 : 40, color: state.themeChangeReducer.primaryColor }]}>{"Choose your Symptoms"}</Text>
        <Text style={[styles.heading1Style, { marginTop: 5, color: state.themeChangeReducer.primaryColor }]}>{"Select how you are feeling from the list below"}</Text>
        <Text style={[styles.heading2Style, { color: colors.blackTextColor }]}>{"Please note that these symptoms are provided by CDC and may appear 2-14 days after exporure to the virus."}</Text>
      </View>
      <FlatList
        numColumns={1}
        data={listOfItems}
        keyExtractor={(item, index) => {
          return index.toString();
        }}
        extraData={{ list: listOfItems }}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        style={{ flex: 1, width: "100%", marginTop: 20 }}
        renderItem={({ item, index }) => {
          return (
            <CustomCheckBox
            containerStyle={{
              height: 33, width: "100%", borderColor: "#8B97A8",
              borderWidth: 0.2, borderRadius: 6,
              justifyContent: "center",
              paddingLeft: 10, marginBottom: 10,
              justifyContent: "flex-start"
            }}
            checkstyle={{ borderWidth: 1.5, borderColor: colors.blackTextColor, backgroundColor: "white" }}
            onChange={() => {
              let tempArray = listOfItems
              for (let i = 0; i < tempArray.length; i++) {
                if (i === index) {
                  tempArray[i].checked = !tempArray[i].checked
                }
              }
              setListOfItems([...tempArray])
            }}
            isChecked={item.checked}
            tintColor={colors.blackTextColor}
            labelStyle={[commonStyles.checkLabelStyle, { color: colors.blackTextColor }]}
            label={item.name}
          />
          )
        }}
      />
      <View style={{ width: "100%", alignItems: "center" }}>
        <Button
          buttonStyle={[commonStyles.buttonStyle, { backgroundColor: state.themeChangeReducer.primaryColor, width: "40%", marginTop: 0 }, commonStyles.shadowStyle]}
          textStyle={commonStyles.textStyle}
          text={"Done"}
          onPress={() => {
            let tempArray = listOfItems
            for (let i = 0; i < tempArray.length; i++) {
              if (tempArray[i].checked) {
                selectedItem.push(tempArray[i].name)
              }
            }
            props.navigation.navigate("verifyLocation",{list:selectedItem})
          }}
        />
      </View>
      <Loader visible={loading} />
    </View>

  )
}
export default SymptomScreen;

const styles = StyleSheet.create(
  {
    innerViewStyle2: {
      flex: 1,
      padding: 30,
    },
    headingStyle: {
      fontSize: 24,
      fontWeight: "700",
      fontStyle: "normal",
    },
    heading1Style: {
      fontSize: 12,
      // fontWeight: "400",
      fontStyle: "normal",
      textAlign: "center"
    },
    heading2Style: {
      fontSize: 12,
      // fontWeight: "300",
      fontStyle: "normal",
      textAlign: "center"
    },
  }
)